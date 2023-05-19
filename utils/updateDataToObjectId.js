import Data from "../models/Data.js";
import mongoose from "mongoose";

const ObjectId = mongoose.Types.ObjectId;

await Data.updateMany({userInfo: "644206edaf3edb5a506e9455"}, {$set: {userInfo: new ObjectId("644206edaf3edb5a506e9455")}})