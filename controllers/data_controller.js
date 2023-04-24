import Data from "../models/Data.js";

export const createData = async (req, res, next) => {

    // Tạo mới một đối tượng data với các thông tin từ req.body
    const newData = new Data(req.body);

    try {
        // Lưu đối tượng data đó vào mongoDB
        const savedData = await newData.save();
        // Sau khi lưu xong gửi đối tượng vừa tạo đến client
        res.status(200).json(savedData);

    } catch (err) {
        next(err)
    }
}