import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import path from "path";
import cors from "cors";
import route from "./routers/index.js";

const app = express();
dotenv.config();

// cấu hình body-paser
import bodyParser from "body-parser";
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// app.use(express.static(path.join(__dirname, "/public")));
app.use(
  cors({
    origin: "*",
  })
);
route(app);

const connect = async () => {
  try {
    await mongoose.connect(process.env.CONNECT_STRING);
    console.log("Connected to database!");
  } catch (error) {
    throw error;
  }
};

mongoose.connection.on("disconnected", () => {
  console.log("Database disconnected!");
});

app.listen(3000, () => {
  connect();
  console.log("Connected to server!");
});
