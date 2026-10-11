import { requestSocket } from "../Utils/SocketClient";

export const systemResourceService = {
  getResources: () => requestSocket("system:get"),
};
