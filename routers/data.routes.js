import express from "express";
import DataControllers from "../controllers/data_controller.js";

const dataRouter = express.Router();

dataRouter.get("/latest/:id", DataControllers.getLatestData);
dataRouter.post("/", DataControllers.createData);

export default dataRouter;
