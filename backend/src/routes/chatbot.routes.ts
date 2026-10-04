import { Router } from "express";
import { handleChatbotAsk } from "../controllers/chatbot.controller";

const router = Router();

router.post("/ask", handleChatbotAsk);

export default router;
