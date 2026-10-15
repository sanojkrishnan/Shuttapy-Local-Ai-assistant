import { api } from "../Utils/APIClient";

export const messageAPI = {
  fetchResponse: (message, onChunk) =>
    api.stream("/api/chat/fetch", { message }, onChunk),
};