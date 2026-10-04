import { api } from "./api";
import { WhatIfScenario } from "@/types";

export const whatIfService = {
  listScenarios: async (category?: string, search?: string): Promise<WhatIfScenario[]> => {
    const params = new URLSearchParams();
    if (category && category !== "all") params.append("category", category);
    if (search && search.trim()) params.append("search", search.trim());
    const query = params.toString() ? "?" + params.toString() : "";
    try {
      const res = await api.get<WhatIfScenario[]>("/what-if" + query);
      return res.data || [];
    } catch {
      return [];
    }
  },

  getScenarioByCode: async (code: string): Promise<WhatIfScenario | null> => {
    try {
      const res = await api.get<WhatIfScenario>("/what-if/" + code);
      return res.data;
    } catch {
      return null;
    }
  },
};
