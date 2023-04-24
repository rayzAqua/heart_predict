import express from "express";
import DataControllers from "../controllers/data_controller.js";

const dataRouter = express.Router();

dataRouter.post("/", DataControllers.createData);
dataRouter.get("/latest/:id", DataControllers.getLatestData);

export default dataRouter;