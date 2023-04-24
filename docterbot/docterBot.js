import path from "path";
import onnx from "onnxruntime-node"
import { fixedPath } from "../utils/fixedPath.js";
import fs from "fs"

// Chuyển đổi model AI từ py sang onnx
// Gọi đến model onnx trong server nodejs
// Chuyển đổi mẫu json trên thành các tensor
// Truyền các tensor này cho model onnx để dự đoán
const docterBot = async (dataPred, next) => {

    const rootDirectoryPath = path.dirname(path.dirname(new URL(import.meta.url).pathname));
    const filePath = path.join(rootDirectoryPath, "docterbot", "svm_disease_predict.onnx");
    const modelPath = fixedPath(filePath);
    console.log(modelPath);

    try {
        // Kiểm tra xem đường dẫn thư mục có chuẩn không
        let session;
        if (fs.existsSync(modelPath)) {
            // Tạo một phiên làm việc (session) với model docterbot ONNX để chuẩn đoán sức khoẻ tim mạch
            session = await onnx.InferenceSession.create(modelPath);
        } else {
            // Nếu sai thì trả về -1
            return -1;
        }

        // Chuyển đổi đối tượng data thành một mảng giá trị để chuẩn bị cho dữ liệu đâu vào.
        const dataValues = Object.values(dataPred);

        // Chuẩn hoá dữ liệu đầu vào
        // Chuyển mảng dataValues thành hai mảng giá trị có kiểu là int và float
        const intInput = Int32Array.from(dataValues.slice(0, 9));
        const floatInput = Float32Array.from([dataValues[9]]);

        // Tạo hai đối tượng tensor đầu vào từ hai mảng trên
        // Mục đích là để chuẩn hoá kiểu dữ liệu giống với tập train
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