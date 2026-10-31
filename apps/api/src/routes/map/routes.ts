import express from "express";
import { sendCoords } from "./POST_sendCoords";
import { predictRiskHandler } from "./POST_predictRisk";
import { explainRiskHandler } from "./POST_explain";

const router = express.Router();

router.post("/send-coords", sendCoords);
router.post("/predict-risk", predictRiskHandler);
router.post("/explain", explainRiskHandler);

export default router;
