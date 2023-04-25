import mongoose from "mongoose";

const HistorySchema = new mongoose.Schema(
    {
        heartBeat: {
            type: Number,
            required: true,
        },
        oxygen: {
            type: Number,
            required: true,
        },
        isHealthy: {
            type: Boolean,
        },
    },
    { timestamps: true }
);

export default mongoose.model("History", HistorySchema);