import jsonwebtoken from "jsonwebtoken";
import Account from "../models/Account.js";
async function authenticateToken(req, res, next) {
  // Get token from Authorization header
  const token = req.headers["authorization"] || req.query.token;

  // If token is null, return 401 Unauthorized
  if (!token) {
    return res.status(400).json({
      status: false,
      message: "Không có quyền truy cập",
      data: {},
    });
  }
  try {
    // Verify token using secret key
    const decoded = jsonwebtoken.verify(token, process.env.JWT_SECRET);
    const user = await Account.findOne({ email: decoded.email });
    if (!user) {
      return res.status(400).json({
        status: false,
        message: "Người dùng không tồn tại!",
        data: {},
      });
    }

    req.body = { ...decoded, ...req.body, user };
    next();
  } catch (error) {
    if (error.message == "jwt expired") {
      return res.status(400).json({
        status: false,
        message: "Token đã hết hạn",
        data: { error },
      });
    }
    return res.status(400).json({
      status: false,
      message: "Token không hợp lệ",
      data: { error },
    });
  }
}

export default authenticateToken;
