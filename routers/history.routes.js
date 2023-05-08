import authenticateToken from "../middlewares/authentication.js";
import HistoryController from "../controllers/history_controller.js";
import express from "express";
const historyRouter = express.Router();
historyRouter.post("/create",authenticateToken,HistoryController.createHistory);
historyRouter.get("/get",authenticateToken,HistoryController.getHistory);
historyRouter.get("/test",HistoryController.testPredict);
export default historyRouter;