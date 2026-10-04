import { Schema, model, Document } from "mongoose";

export interface IChatbotKnowledge extends Document {
  topicKey: string;
  questionCanonical: string;
  questionAliases: string[];
  answerSummary: string;
  detailedPoints: string[];
  category: string;
  relatedBanks: string[];
  relatedSchemes: string[];
  relatedDocuments: string[];
  sourceTitle: string;
  sourceUrl?: string;
  lastVerified: string;
  verificationStatus: "verified" | "needs_verification" | "expired";
  suggestedFollowUps: string[];
  createdAt: Date;
  updatedAt: Date;
}

const ChatbotKnowledgeSchema = new Schema<IChatbotKnowledge>(
  {
    topicKey: { type: String, required: true, unique: true, index: true },
    questionCanonical: { type: String, required: true, trim: true },
    questionAliases: { type: [String], default: [] },
    answerSummary: { type: String, required: true },
    detailedPoints: { type: [String], default: [] },
    category: { type: String, required: true, index: true },
    relatedBanks: { type: [String], default: [] },
    relatedSchemes: { type: [String], default: [] },
    relatedDocuments: { type: [String], default: [] },
    sourceTitle: { type: String, required: true },
    sourceUrl: { type: String },
    lastVerified: { type: String, required: true },
    verificationStatus: {
      type: String,
      enum: ["verified", "needs_verification", "expired"],
      default: "verified",
    },
    suggestedFollowUps: { type: [String], default: [] },
  },
  { timestamps: true }
);

ChatbotKnowledgeSchema.index({
  questionCanonical: "text",
  questionAliases: "text",
  answerSummary: "text",
});

export const ChatbotKnowledge = model<IChatbotKnowledge>(
  "ChatbotKnowledge",
  ChatbotKnowledgeSchema
);
