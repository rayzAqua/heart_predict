import passport from "passport";
import LocalStrategy from "passport-local";
import Account from "../models/Account.js";
import User from "../models/User.js";
import sendChangePassMail from "../utils/mail.js";
import { compare, encode } from "../utils/my-bcrypt.js";
import { getRefeshToken, getToken } from "../utils/token.js";
import jsonwebtoken from "jsonwebtoken";
import path from "path";

// passport.use(new LocalStrategy(Account.authenticate()));
// passport.serializeUser(Account.serializeUser());
// passport.deserializeUser(Account.deserializeUser());

class AuthControllers {
  //[POST] /account/sign-up
  async signUp(req, res, next) {
    try {
      const {
        username,
        name,
        imageUrl,
        gender,
        birthDay,
        phoneNumber,
        familyPhoneNumber,
        height,
        weight,
      } = req.body;
      if (imageUrl == undefined) imageUrl ="";
      const userInfo = await User.create({
        name,
        imageUrl,
        gender,
        birthDay,
        phoneNumber,
        familyPhoneNumber,
        height,
        weight,
      });

      const user = await Account.create({
        email: username,
        password: encode(req.body.password),
        userInfo: userInfo,
      });

      return res.status(200).json({
        status: true,
        message: "Tạo tài khoản thành công!",
        data: { user },
      });
    } catch (error) {
      console.log(error);
      return res.status(200).json({
        status: false,
        message: error.message,
        data: { error },
      });
    }
  }

  //[POST] /account/sign-in
  async signIn(req, res) {
    try {
      // check if the user exists
      const user = await Account.findOne({ email: req.body.username }).populate(
        "userInfo"
      );
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
            data: {
              user: user,
              refreshToken: refreshToken,
            },
          });
        } else {
          return res.status(200).json({
            status: false,
            message: "Mật khẩu không đúng!",
            data: {},
          });
        }
      } else {
        return res.status(200).json({
          status: false,
          message: "Tài khoản không tồn tại!",
          data: {},
        });
      }
    } catch (error) {
      return res
        .status(200)
        .json({ status: false, message: "Lỗi!", data: { error } });
    }
  }

  //[PATCH] /acccount/change-password
  async changePassword(req, res) {
    const { username, newPassword, oldPassword } = req.body;
    if (!newPassword || !oldPassword) {
      return res.status(200).json({
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
          return res.status(200).json({
            status: false,
            message: "Mật khẩu cũ không đúng!",
            data: { error },
          });
        }
      }
    } catch (error) {
      return res.status(200).json({
        status: false,
        message: "Đổi mật khẩu thất bại!",
        data: { error },
      });
    }
  }

  //[PATCH] /acccount/change-password-in-forgot
  async changePasswordInForgot(req, res) {
    const { email: username, newPassword } = req.body;
    //check valid old password
    if (!newPassword) {
      return res.send(message("", false, "Mật khẩu mới không được để trống!"));
    }

    try {
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
    } catch (error) {
      return res.status(200).json({
        status: false,
        message: "Đổi mật khẩu thất bại!",
        data: { error },
      });
    }
  }

  //[POST] /acccount/forgot-password
  async forgotPassword(req, res) {
    const { username } = req.body;
    // check valid email
    try {
      const user = await Account.findOne({ email: username });

      if (!user) {
        return res.status(200).json({
          status: false,
          message: "Email không đúng!",
          data: {},
        });
      }
      const token = getToken(username, true);
      const rs = await sendChangePassMail(username, token);
      if (rs.response.includes("OK")) {
        return res.status(200).json({
          status: true,
          message: "Đã gửi mail đổi mật khẩu tới: " + username,
          data: {},
        });
      }
    } catch (error) {
      return res.status(200).json({
        status: false,
        message: "Khôi phục mật khẩu thất bại!",
        data: { error },
      });
    }
  }

  //[GET] /acccount/change-password-form"
  async changePasswordForm(req, res) {
    res.sendFile(path.join(__dirname, "../public/change-password-form.html"));
  }

  // [POST] /account/refresh-token
  async refeshToken(req, res) {
    const refreshToken = req.body.token;
    console.log(req.body);
    if (!refreshToken) return res.sendStatus(401);

    jsonwebtoken.verify(refreshToken, process.env.JWT_SECRET, (err, user) => {
      if (err)
        return res.status(200).json({
          status: false,
          message: "Refesh token không hợp lệ!",
          data: { err },
        });

      const token = getToken(user.email, false, user.role);
      return res.status(200).json({
        status: false,
        message: "Refesh token thành công!",
        data: { token },
      });
    });
  }

  // [POST] /account/token
  async token(req, res) {
    const email = req.body.email;
    if (email === undefined || email == "")
      return res.status(200).json({
        status: false,
        message: "Lấy token thất bại!",
        data: {},
      });
    const token = getToken(email, true);
    return res.status(200).json({
      status: true,
      message: "Lấy token thành công!",
      data: { token },
    });
  }

  //[PUT] /account/:id/update
  async updateUser(req, res) {
    try {
      const id = req.params.id;
      console.log("id: ", id);
      const {
        name,
        imageUrl,
        gender,
        birthDay,
        phoneNumber,
        familyPhoneNumber,
        height,
        weight,
      } = req.body;

      const user = await User.findById(id);
      if (!user) {
        return res.status(200).json({
          status: false,
          message: "Không tìm thấy tài khoản có id:" + idStaff,
          data: {},
        });
      }

      await User.updateOne(
        { _id: id },
        {
          $set: {
            name,
            imageUrl,
            gender,
            birthDay,
            phoneNumber,
            familyPhoneNumber,
            height,
            weight,
          },
        },
        { new: true }
      );

      return res.status(200).json({
        status: true,
        message: "Cập  nhật thông tin thành công!",
        data: {},
      });
    } catch (error) {
      return res.status(200).json({
        status: false,
        message: "Cập  nhật thông tin thất bại!",
        data: { error },
      });
    }
  }
}

export default new AuthControllers();
