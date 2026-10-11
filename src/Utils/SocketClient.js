import { io } from "socket.io-client";
import { API_CONFIG } from "../config/app";

const CONNECT_TIMEOUT_MS = 10000;
const REQUEST_TIMEOUT_MS = 8000;

const socket = io(API_CONFIG.baseURL, {
  autoConnect: false,
  transports: ["websocket"], // skip the slow polling handshake
  reconnection: true,
  reconnectionAttempts: 5,
  reconnectionDelay: 1000,
});

// registered once, not on every connect attempt
socket.on("connect_error", (err) => {
  console.error("Shuttapy backend connection failed:", err.message);
});
socket.on("disconnect", (reason) => {
  console.warn("Shuttapy socket disconnected:", reason);
});

let connecting = null; // the one in-flight attempt, shared by all callers

// resolves when connected, rejects on error or timeout
export const connectSocket = () => {
  if (socket.connected) return Promise.resolve();
  if (connecting) return connecting;

  connecting = new Promise((resolve, reject) => {
    const cleanup = () => {
      clearTimeout(timer);
      socket.off("connect", onConnect);
      socket.off("connect_error", onError);
      connecting = null;
    };
    const onConnect = () => {
      cleanup();
      resolve();
    };
    const onError = (err) => {
      cleanup();
      reject(err || new Error("Backend offline"));
    };
    const timer = setTimeout(
      () => onError(new Error("Backend connection timed out")),
      CONNECT_TIMEOUT_MS,
    );

    socket.on("connect", onConnect);
    socket.on("connect_error", onError);
    socket.connect(); // no-op if already connecting
  });

  return connecting;
};

export const disconnectSocket = () => {
  socket.disconnect();
};

// like api.get(): connects if needed, asks, returns the answer
export const requestSocket = async (event) => {
  await connectSocket();

  return new Promise((resolve, reject) => {
    socket.timeout(REQUEST_TIMEOUT_MS).emit(event, (err, res) => {
      if (err) return reject(new Error("Backend did not respond in time"));
      if (res?.error) return reject(new Error(res.error));
      resolve(res);
    });
  });
};

export default socket;
