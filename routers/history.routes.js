import authenticateToken from "../middlewares/authentication.js";
import getHistory from "../controllers/history_controller.js";
import express from "express";
const historyRouter = express.Router();
historyRouter.get("/",authenticateToken,getHistory);
export default historyRouter;