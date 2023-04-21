import express from "express";
import { createData } from "../controllers/data_controller.js";

const router = express.Router();

router.post("/", createData);

export default router;