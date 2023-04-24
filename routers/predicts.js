import express from "express";
import { predict } from "../controllers/predict_controller.js";

const router = express.Router();

// Gửi yêu cầu dự đoán của user - gửi dữ liệu về cho server xử lý và server sẽ gửi nó tới cho server python
// Đầu tiên lấy id của người dùng được truyền tới từ endpoint
// Sau đó truy vấn tới bảng data với id đó và lấy dữ liệu về
// Sau đó lấy các data đó ra để suy ra dữ liệu và gửi đến server khác
// Đợi server xử lý xong, kết quả sẽ được lưu vào History và được hiển thị lên màn hình
// Cụ thể:
// B1: Xử lý dữ liệu từ client
// B2: Gửi dữ liệu đó đến cho một server khác (tạm gọi là server2)
// B3: Nhận phản hồi từ server2
// B4: Lưu vào History
// B5: Gửi kết quả phản hồi từ server2 đến cho client
router.post("/data/:dataid", predict)

export default router;


