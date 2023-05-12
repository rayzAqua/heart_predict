import express from "express";
import { predict } from "../controllers/predict_controller.js";

const router = express.Router();

router.post("/data", predict)

export default router;


