import { Request, Response, NextFunction } from "express";
import { queryChatbot } from "../services/chatbot.service";
import { sendSuccess, sendError } from "../utils/apiResponse";

export const handleChatbotAsk = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { question, context } = req.body;

    if (!question || typeof question !== "string" || !question.trim()) {
      return sendError(res, 400, "VALIDATION_ERROR", "A valid non-empty question string is required.");
    }

    const response = await queryChatbot(question, context || {});
    return sendSuccess(res, response, 200, undefined, {
      disclaimer: "Answers are generated from verified official sources. Edu4Loan does not predict or guarantee loan sanctions.",
    });
  } catch (err) {
    next(err);
  }
};
