import express from "express";
const dataRouter = express.Router();
import DataController from "../controllers/data_controller.js"

dataRouter.post("/", DataController.createData);
dataRouter.get("/:id", DataController.getData);

export default dataRouter;