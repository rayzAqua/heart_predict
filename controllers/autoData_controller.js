import { randomPredictData } from "../utils/randomPredictData.js";
import Data from "../models/Data.js";

export const autoGenerateData = async (req, res, next) => {

    const data = [];
    const startDate = new Date();
    startDate.setUTCHours(0, 0, 0, 0);
    const endDate = new Date(startDate.getTime() + 10 * 24 * 60 * 60 * 1000);
    console.log(startDate);
    console.log(endDate);

    try {
        // Trong đoạn từ ngày startDate đến ngày endDate
        while (startDate < endDate) {
            // Mỗi ngày có 24h, ta duyệt qua từng giờ để tạo 5 dữ liệu.
            // Quy ước:
            // Ngày chẵn: Bệnh.
            // Ngày lẻ: Khoẻ.
            // console.log(startDate);
            for (let hour = 0; hour < 24; hour++) {
                // Một h lại có 5 bộ dữ liệu
                for (let doc = 0; doc < 5; doc++) {
                    if (startDate.getDate() % 2 == 0) {
                        // console.log(startDate.getDate());
                        const userInfo = '644206edaf3edb5a506e9455';
                        const heartRate = randomPredictData(102, 202);
                        const SpO2 = randomPredictData(80, 95);
                        const temp = randomPredictData(36.5, 36.8);
                        const date = new Date(startDate);
                        date.setHours(hour);

                        data.push({
                            userInfo: userInfo,
                            heartRate: heartRate,
                            SpO2: SpO2,
                            temp: temp,
                            date: date
                        });

                    }
                    else if (startDate.getDate() % 2 != 0) {
                        // console.log(startDate.getDate());
                        const userInfo = '644206edaf3edb5a506e9455';
                        const heartRate = randomPredictData(60, 101);
                        const SpO2 = randomPredictData(96, 100);
                        const temp = randomPredictData(36.5, 36.8);
                        const date = new Date(startDate);
                        date.setHours(hour);

                        data.push({
                            userInfo: userInfo,
                            heartRate: heartRate,
                            SpO2: SpO2,
                            temp: temp,
                            date: date
                        });

                    }
                }
            }
            startDate.setDate(startDate.getDate() + 1);
            // console.log(startDate);
        }
        await Data.insertMany(data);
        res.status(200).send("Create Data Successfully!");
    } catch (err) {
        next(err);
    }

}

