import { api } from "./api";
import { WhatIfScenario } from "@/types";
import { fallbackWhatIfScenarios } from "./whatIfFallback";

export const whatIfService = {
  listScenarios: async (category?: string, search?: string): Promise<WhatIfScenario[]> => {
    const params = new URLSearchParams();
    if (category && category !== "all") params.append("category", category);
    if (search && search.trim()) params.append("search", search.trim());
    const query = params.toString() ? "?" + params.toString() : "";
    try {
      const res = await api.get<WhatIfScenario[]>("/what-if" + query);
      if (res.data && res.data.length > 0) {
        return res.data;
      }
    } catch {
      // Fallback below
    }

    let filtered = [...fallbackWhatIfScenarios];
    if (category && category !== "all") {
      filtered = filtered.filter((s) => s.category === category);
    }
    if (search && search.trim()) {
      const q = search.trim().toLowerCase();
      filtered = filtered.filter(
        (s) =>
          s.title.toLowerCase().includes(q) ||
          s.summary.toLowerCase().includes(q) ||
          (s.problemExplanation && s.problemExplanation.toLowerCase().includes(q))
      );
    }
    return filtered;
  },

  getScenarioByCode: async (code: string): Promise<WhatIfScenario | null> => {
    try {
      const res = await api.get<WhatIfScenario>("/what-if/" + code);
      if (res.data) return res.data;
    } catch {
      // Fallback below
    }
    return fallbackWhatIfScenarios.find((s) => s.scenarioCode === code) || null;
  },
};
