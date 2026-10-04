import { api } from "./api";
import { ChatbotQueryContext, ChatbotResponse } from "@/types";

export const chatbotService = {
  ask: async (question: string, context: ChatbotQueryContext = {}): Promise<ChatbotResponse> => {
    try {
      const res = await api.post<ChatbotResponse>("/chatbot/ask", { question, context });
      return res.data;
    } catch (err: any) {
      // Offline fallback
      return {
        answer:
          "Edu4Loan Knowledge Engine is currently operating in offline mode. For verified guidelines, please refer to the Practical Help and FAQ sections.",
        citations: [],
        suggestedPrompts: [
          "What if parent has no salary slip?",
          "Is collateral required up to ₹7.5 Lakhs?",
          "How to apply for VIT Bhopal education loan?",
        ],
        contextRecognized: context,
      };
    }
  },
};
