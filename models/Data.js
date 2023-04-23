import mongoose from "mongoose";

const DataSchema = new mongoose.Schema(
    {
        // Lấy age, sex và BMI
        userInfo: {
            type: String,
            required: true,
            ref: "User",
        },
        // Một mảng các nhịp tim - Khi được truy vấn tới sẽ lấy toàn bộ cả mảng này để tình trung bình nhịp tim theo ngày
        heart: [{
            heartRate: {
                type: Number,
                required: true,
            },
            date: {
                type: Date,
                default: Date.now,
            }
        }],
        // Một mảng các nộng độ O2 - Khi được truy vấn tới sẽ lấy toàn bộ cả mảng này để tình trung bình nồng độ O2 theo ngày
        spO2: [{
            oxygen: {
                type: Number,
                required: true,
            },
            date: {
                type: Date,
                default: Date.now,
            }
        }],
    });

export default mongoose.model("Data", DataSchema);