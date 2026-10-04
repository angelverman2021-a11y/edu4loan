import { Router } from "express";
import { listWhatIfScenarios, getWhatIfScenarioByCode } from "../controllers/whatIf.controller";

const router = Router();

router.get("/", listWhatIfScenarios);
router.get("/:code", getWhatIfScenarioByCode);

export default router;
