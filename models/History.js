import mongoose from "mongoose";

const HistorySchema = new mongoose.Schema(
    {
        
    },
    { timestamps: true }
);

export default mongoose.Model("History", HistorySchema);