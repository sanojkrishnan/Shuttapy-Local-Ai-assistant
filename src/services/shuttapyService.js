import { requestSocket } from "../Utils/SocketClient";

export const shuttapyService = {
  checkBackend: () => requestSocket("shuttapy:health"),
};