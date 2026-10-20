import { api } from "../Utils/APIClient";
import { requestSocket } from "../Utils/SocketClient";

// api.get already returns the response body; the payload may sit in body.data
const unwrap = (body) => body?.data ?? body;

export const systemResourceService = {
  getResources: () => requestSocket("system:get"),

  checkOllamaUpdate: async (refresh = false) =>
    unwrap(
      await api.get("/api/system/update", {
        params: refresh ? { refresh: true } : undefined,
        timeout: 30000, // registry checks can take longer than the 5s default
      }),
    ),
};
