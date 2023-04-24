import mongoose from "mongoose";

const HistorySchema = new mongoose.Schema(
    {
        // Lấy trung bình
        heartBeat: {
            type: Number,
            required: true,
        },
        // Lấy trung bình
        oxygen: {
            type: Number,
            required: true,
        },
        // Chuẩn đoán
        isNotHealthy: {
            type: Boolean,
        },
    },
    { timestamps: true }
);

export default mongoose.model("History", HistorySchema);