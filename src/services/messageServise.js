import { api } from "../Utils/APIClient";

export const messageAPI = {
  fetchResponse: async (payload) => {
    return api.post("chat", payload, {
      timeout: 120000,
    });
  },
};
