import onnx from "onnxruntime-node"
import { fixedPath } from "../utils/fixedPath.js";
import fs from "fs"


const docterBot = async (dataPred, next) => {

    // Đọc đường dẫn đến model AI.
    const modelPath = fixedPath(["docterbot", "svm_disease_predict.onnx"]);
    console.log(modelPath);

    try {
        // Kiểm tra xem đường dẫn đến model có chuẩn không.
        let session;
        if (fs.existsSync(modelPath)) {
            // Tạo một phiên làm việc (session) với model docterbot ONNX để chuẩn đoán sức khoẻ tim mạch.
            session = await onnx.InferenceSession.create(modelPath);
        } else {
            // Nếu đường dẫn có vấn đề thì trả về -1
            console.log("Wrong Model Path!");
            return -1;
        }

        // Chuyển đổi đối tượng data thành một mảng giá trị để chuẩn bị cho dữ liệu đâu vào.
        const dataValues = Object.values(dataPred);
        // Chuẩn hoá dữ liệu đầu vào:
        // Chuyển mảng dataValues thành hai mảng giá trị có kiểu là int và float.
        // Mục đích: chuẩn hoá kiểu dữ liệu giống với tập train.
        const intInput = Int32Array.from(dataValues.slice(0, 9));
        const floatInput = Float32Array.from([dataValues[9]]);
        // Tạo hai đối tượng tensor cho đầu vào từ hai mảng trên.
        const tensorA = new onnx.Tensor("int32", intInput, [1, 9]);
        const tensorB = new onnx.Tensor("float32", floatInput, [1, 1]);

        // Tạo ra một đối tượng feeds. Đối tượng này gồm các cặp key-value được dùng để xác định tập dữ liệu cho các đầu vào
        // của model ONNX
        const feeds = { "int_input": tensorA, "float_input": tensorB };

        // Tiến hành truyền dữ liệu đầu vào và bắt đầu sử đụng model để dự đoán
        // Biến predict sẽ nhận một mảng các giá trị dự đoán, độ lớn của mảng tuỳ theo kích thước
        // của tập dữ liệu đầu vào.
        const predict = await session.run(feeds);

        // Trả về kết quả dự đoán
        return predict.label.data;

    } catch (err) {
        next(err);
    }
}

export default docterBot;