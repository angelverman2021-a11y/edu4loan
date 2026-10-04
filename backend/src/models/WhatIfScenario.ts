import { Schema, model, Document } from "mongoose";

export interface IWhatIfScenario extends Document {
  scenarioCode: string;
  title: string;
  category: string;
  summary: string;
  problemExplanation: string;
  practicalGuidance: string[];
  relevantDocuments: string[];
  bankSpecificConditions: Array<{
    bankName: string;
    condition: string;
  }>;
  officialSource: {
    value: string;
    source: string;
    sourceUrl: string;
    lastVerified: string;
    status: "verified" | "needs_verification" | "expired";
  };
  officialActionLink?: string;
  actionText?: string;
  status: "verified" | "needs_verification" | "expired";
  createdAt: Date;
  updatedAt: Date;
}

const WhatIfScenarioSchema = new Schema<IWhatIfScenario>(
  {
    scenarioCode: { type: String, required: true, unique: true, index: true },
    title: { type: String, required: true, trim: true },
    category: { type: String, required: true, index: true },
    summary: { type: String, required: true },
    problemExplanation: { type: String, required: true },
    practicalGuidance: { type: [String], default: [] },
    relevantDocuments: { type: [String], default: [] },
    bankSpecificConditions: [
      {
        bankName: { type: String, required: true },
        condition: { type: String, required: true },
      },
    ],
    officialSource: {
      value: { type: String, required: true },
      source: { type: String, required: true },
      sourceUrl: { type: String, required: true },
      lastVerified: { type: String, required: true },
      status: {
        type: String,
        enum: ["verified", "needs_verification", "expired"],
        default: "verified",
      },
    },
    officialActionLink: { type: String },
    actionText: { type: String },
    status: {
      type: String,
      enum: ["verified", "needs_verification", "expired"],
      default: "verified",
    },
  },
  { timestamps: true }
);

WhatIfScenarioSchema.index({ title: "text", summary: "text", problemExplanation: "text" });

export const WhatIfScenario = model<IWhatIfScenario>("WhatIfScenario", WhatIfScenarioSchema);
