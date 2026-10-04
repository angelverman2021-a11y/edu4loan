import { Router } from "express";
import { getBankStatistics } from "../controllers/bankStatistics.controller";

const router = Router();

router.get("/", getBankStatistics);

export default router;
