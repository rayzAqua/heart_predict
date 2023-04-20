import mongoose from "mongoose";

const DataSchema = new mongoose.Schema(
    {        
        bpm:{
            type: Number,
            required: true,
        },
        spO2:{
            type: Number,
            required: true,
        },
        temp:{
            type: Number,
            required: true,
        },
        addDate:{
            type : Date,
            required: true,
        },
        userInfo:{
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        }
    },
    { timestamps: true }
    );

export default mongoose.model("Data", DataSchema);

// Lấy age, sex và BMI
        // userInfo: {
        //     type: String,
        //     required: true,
        //     ref: "User",
        // },
        // // Một mảng các nhịp tim - Khi được truy vấn tới sẽ lấy toàn bộ cả mảng này để tình trung bình nhịp tim theo ngày
        // heart: [{
        //     heartRate: {
        //         type: Number,
        //         required: true,
        //     },
        //     date: {
        //         type: Date,
        //         required: true
        //     }
        // }],
        // // Một mảng các nộng độ O2 - Khi được truy vấn tới sẽ lấy toàn bộ cả mảng này để tình trung bình nồng độ O2 theo ngày
        // spO2: [{
        //     oxygen: {
        //         type: Number,
        //         required: true,
        //     },
        //     date: {
        //         type: Date,
        //         required: true
        //     }
        // }],
        
        // // Loại đau ngực: Loại đau ngực có 4 loại tương ứng với 0 1 2 3
        // cp: {
        //     type: Number,
        //     min: 0,
        //     max: 3,
        // },
        // // Huyết áp - suy ra từ Oxygen
        // trtbps: {
        //     type: Number,
        // },
        // // Cholesterol - suy ra từ BMI - BMI = Weight / (Height)^2
        // chol: {
        //     type: Number,
        // },
        // // Mức đường huyết đói 0: <120 mg/dl; 1: > 120 mg/dl
        // fbs: {
        //     type: Number,
        //     min: 0,
        //     max: 1,
        // },
        // // Điện tâm đồ: Theo loại: 0, 1 và 2
        // restecg: {
        //     type: Number,
        //     min: 0,
        //     max: 2,
        // },
        // // Nhịp tim cao nhất
        // thalachh: {
        //     type: Number,
        // },
        // // Tình trạng đau ngực khi vận động: Có: 1; Không: 0
        // exng: {
        //     type: Number,
        //     min: 0,
        //     max: 1,
        // },
        // //Sự suy giảm điện tâm đồ trong khoảng thời gian nghỉ ngơi sau khi tập luyện tập thể dục
        // oldpeak: {
        //     type: Number,
        // }