import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";

const app = express();
dotenv.config();

const connect = async () => {
    try {
        await mongoose.connect(process.env.CONNECT_STRING);
        console.log("Connected to database!");
    } catch (error) {
        throw error;
    }
}

mongoose.connection.on("disconnected", () => {
    console.log("Database disconnected!")
});

app.listen(8881, () => {
    connect();
    console.log("Connected to server!");
});