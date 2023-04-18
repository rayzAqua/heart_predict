import passport from "passport";
import LocalStrategy from "passport-local";
import Account from "../models/Account.js";
import { compare, encode } from "../utils/my-bcrypt.js";
import { getRefeshToken, getToken } from "../utils/token.js";

// passport.use(new LocalStrategy(Account.authenticate()));
// passport.serializeUser(Account.serializeUser());
// passport.deserializeUser(Account.deserializeUser());

class AuthControllers {
  //[POST] /account/sign-up
  async signUp(req, res, next) {
    try {
      const user = await Account.create({
        email: req.body.username,
        password: encode(req.body.password),
      });

      return res.status(200).json({
        status: true,
        message: "Tạo tài khoản thành công!",
        data: { user },
      });
    } catch (error) {
      return res.status(400).json({
        status: false,
        message: "Tạo tài khoản thất bại!",
        data: { error },
      });
    }
  }

  //[POST] /account/sign-in
  async signIn(req, res) {
    try {
      // check if the user exists
      const user = await Account.findOne({ email: req.body.username });
      console.log(user);
      if (user) {
        //check if password matches
        const result = compare(req.body.password, user.password);
        if (result) {
          const token = getToken(req.body.username, false, "customer");
          const refreshToken = getRefeshToken(req.body.username, "customer");
          res.setHeader("Authorization", token);

          return res.status(200).json({
            status: true,
            message: "Đăng nhập thành công!",
            data: { user: user, refreshToken: refreshToken },
          });
        } else {
          return res
            .status(400)
            .json({ status: false, message: "Mật khẩu không đúng!", data: {} });
        }
      } else {
        return res.status(400).json({
          status: false,
          message: "Tài khoản không tồn tại!",
          data: {},
        });
      }
    } catch (error) {
      return res
        .status(400)
        .json({ status: false, message: "Lỗi!", data: { error } });
    }
  }

  async changePassword(req, res) {
    const { username, newPassword, oldPassword } = req.body;
    if (!newPassword || !oldPassword) {
      return res.status(400).json({
        status: false,
        message: "Mật khẩu mới và mật khẩu cũ không được để trống",
        data: {},
      });
    }
    //check valid old password
    try {
      const user = await Account.findOne({ email: username });

      if (user) {
        //check if password matches
        const result = compare(oldPassword, user.password);
        if (result) {
          const encodedPassword = encode(newPassword);
          await Account.updateOne(
            { email: username },
            { $set: { password: encodedPassword } },
            { new: true }
          );

          return res.status(200).json({
            status: true,
            message: "Đổi mật khẩu thành công!",
            data: {},
          });
        } else {
          return res.status(400).json({
            status: false,
            message: "Mật khẩu cũ không đúng!",
            data: { error },
          });
        }
      }
    } catch (error) {
      return res.status(400).json({
        status: false,
        message: "Đổi mật khẩu thất bại!",
        data: { error },
      });
    }
  }
}

export default new AuthControllers();
