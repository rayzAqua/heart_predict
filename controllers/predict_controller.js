import Data from "../models/Data.js"
import History from "../models/History.js";
import { randomPredictData } from "../utils/randomPredictData.js";

export const predict = async (req, res, next) => {

    const dataId = req.params.dataid;

    try {
        // B1: Xử lý dữ liệu từ client
        // B1.1: Lấy data của user dựa trên id data
        const userData = await Data.findById(dataId).populate({
            path: "userInfo",
            select: ["gender", "birthDay", "height", "weight"]
        });

        //B1.2: Trích xuất từng dữ liệu một để tiến hành xử lý
        // Trích xuất dữ liệu của thuộc tích userInfo
        const { gender, birthDay, height, weight, ...otherDetails1 } = userData.userInfo._doc;
        // Trích xuất dữ liệu của userData
        const { heart, spO2, ...otherDetails2 } = userData._doc;

        //B2: Suy dữ liệu từ các dữ liệu hiện có.

        // Xử lý tuổi - tính ra từ ngày sinh
        // B1: Chuyển kiểu của birthDay thành kiểu Date
        const brthDay = new Date(birthDay);
        // B2: Lấy ngày hiện tại
        const currentDate = new Date();
        // B3: Tính sự chênh lệch giữa hai mốc thời gian (đơn vị miliseconds)
        const diffTime = Math.abs(currentDate - brthDay)
        // B4: Quy đổi từ số miliseconds thành số ngày
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
        // B5: Quy đổi từ số ngày thành số năm (tuổi)
        const age = Math.floor(diffDays / 365)

        // Xử lý giới tính - quy đổi thành 0 và 1
        const lowercaseGender = gender.toLowerCase();
        const sex = lowercaseGender === "nam" ? 0 : 1;

        // Xử lý trtbps - suy ra từ spO2 - nếu huyết áp thấp thì lượng oxy cũng sẽ thấp theo
        // Mức SpO2 bình thường nằm trong khoảng 95-100%.
        // Mức SpO2 dưới 90% được xem là thấp và có thể cho thấy rối loạn hô hấp hoặc sự suy giảm hoạt động của tim.
        // Người bị bệnh phổi tắc nghẽn mạn tính hoặc bệnh tiểu đường, mức SpO2 bình thường có thể dao động trong khoảng 90-95%.
        //B1: Tạo một mảng các số đó oxygen có trong ngày hiện tại
        const SpO2 = spO2.map((spo2) => {
            if (currentDate.getFullYear() === spo2.date.getFullYear() &&
                currentDate.getMonth() === spo2.date.getMonth() &&
                currentDate.getDate() === spo2.date.getDate()) {
                return spo2.oxygen;
            }
        });
        console.log(SpO2);
        //B2: Tính trung bình cộng
        const averSpO2 = Math.ceil((SpO2.reduce((sum, curr) => sum + curr, 0)) / SpO2.length);
        //B3: Quy đổi:
        // Mức trtbps bình thường là từ 90 đến 119 mmHg.
        // Mức trtbps bất thường là từ 120 đến 200 mmHg.
        const trtbps = averSpO2 ? ((averSpO2 >= 93 && averSpO2 <= 100) ? randomPredictData(90, 119) : randomPredictData(120, 200)) : null;

        // Xử lý cholesterol - suy ra từ chiều cao và cân nặng - chỉ số BMI có liên quan đến cholesterol
        // Dưới 18.5: Gầy
        // Từ 18.5 đến 24.9: Bình thường
        // Từ 25.0 đến 29.9: Hơi béo
        // Từ 30.0 đến 34.9: Béo phì độ I
        // Từ 35.0 đến 39.9: Béo phì độ II
        // Trên 40.0: Béo phì độ III
        // B1: Chuẩn hoá lại thông tin
        const wght = parseFloat(weight);
        const hght = parseFloat(height)
        // B2: Tính chỉ số bmi từ chiều cao và cân nặng và chuẩn hoá
        const bmi = parseFloat((wght / ((hght / 100) ** 2)).toFixed(2));
        // B3: Quy đổi:
        // Cholesterol < 200 mg/dL (5.2 mmol/L) là bình thường
        // chỉ số cholesterol ở người bình thường luôn duy trì mức 170mg/dL, đạt giới hạn trong khoảng 170 – 199mg/dL
        // 200-239 mg/dL (5.2-6.2 mmol/L) được xem là tăng nguy cơ.
        // ≥ 240 mg/dL (6.2 mmol/L) là mức độ cao.
        const chol = (bmi >= 30 && bmi <= 34.9) ? randomPredictData(200, 239) :
            (bmi >= 35 && bmi <= 39.9) ? randomPredictData(240, 299) :
                (bmi >= 40) ? randomPredictData(300, 350) :
                    randomPredictData(170, 199);

        // Xử lý nhịp tim
        // B1: Tạo một mảng các số đo của heartRate có trong ngày hiện tại.
        const HR = heart.map((hr) => {
            if (currentDate.getFullYear() === hr.date.getFullYear() &&
                currentDate.getMonth() === hr.date.getMonth() &&
                currentDate.getDate() === hr.date.getDate()) {
                return hr.heartRate;
            }
        });
        console.log(HR)
        // B2: Tính trung bình cộng
        const averHR = Math.ceil((HR.reduce((sum, curr) => sum + curr, 0) / HR.length));
        // B3: Quy đổi
        const thalachh = averHR;

        // B1.3: Lưu lại dữ liệu
        const data = {
            age: age,
            sex: sex,
            cp: req.body.cp,
            trtbps: trtbps,
            chol: chol,
            fbs: req.body.fbs || -1,
            restecg: req.body.restecg || -1,
            thalachh: thalachh,
            exng: req.body.exng,
            oldpeak: req.body.oldpeak || -1,
        }

        // B2: Gửi dữ liệu đến cho AI
        // Chuyển đổi model AI từ py sang onnx
        // Gọi đến model onnx trong server nodejs
        // Chuyển đổi mẫu json trên thành csv
        // Gửi tệp csv này đến cho model onnx để dự đoán

        // B3: Nhận phản hồi

        // B4: Lưu vào History

        // B5: Gửi kết quả đến cho client
        
        res.status(200).json(data);

    } catch (err) {
        next(err)
    }


}
