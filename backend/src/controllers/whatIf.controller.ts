import { Request, Response, NextFunction } from "express";
import { WhatIfScenario } from "../models/WhatIfScenario";
import { sendSuccess, sendError } from "../utils/apiResponse";

export const listWhatIfScenarios = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { category, search } = req.query;
    const filter: any = {};

    if (category && typeof category === "string" && category !== "all") {
      filter.category = category;
    }

    if (search && typeof search === "string" && search.trim()) {
      filter.$or = [
        { title: { $regex: search.trim(), $options: "i" } },
        { summary: { $regex: search.trim(), $options: "i" } },
        { problemExplanation: { $regex: search.trim(), $options: "i" } },
      ];
    }

    const scenarios = await WhatIfScenario.find(filter).sort({ title: 1 });
    return sendSuccess(res, scenarios, 200, undefined, {
      total: scenarios.length,
      disclaimer: "Practical guidance compiled from verified bank guidelines and IBA norms. Final conditions depend on the lending bank.",
    });
  } catch (err) {
    next(err);
  }
};

export const getWhatIfScenarioByCode = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { code } = req.params;
    const scenario = await WhatIfScenario.findOne({ scenarioCode: code });

    if (!scenario) {
      return sendError(res, 404, "NOT_FOUND", "What-If Scenario not found");
    }

    return sendSuccess(res, scenario, 200);
  } catch (err) {
    next(err);
  }
};
