
import { api } from "../Utils/APIClient";

export const shuttapyService = {
  checkBackend: () => api.get("/api/health"),
};
