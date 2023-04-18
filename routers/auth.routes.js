import express from "express";
const authRouter = express.Router();
import AuthControllers from "../controllers/auth_controller.js";
import authenticateToken from "../middlewares/authentication.js";

authRouter.post("/sign-up", AuthControllers.signUp);
authRouter.post("/sign-in", AuthControllers.signIn);

authRouter.patch(
  "/change-password",
  authenticateToken,
  AuthControllers.changePassword
);
// authRouter.patch(
//   "/change-password-in-forgot",
//   authenticateToken,
//   accountControllers.changePasswordInForgot
// );
// authRouter.post("/forgot-password", accountControllers.forgotPassword);
// authRouter.get("/change-password-form", accountControllers.changePasswordForm);
// authRouter.post("/refresh-token", accountControllers.refeshToken);
// authRouter.post("/token", accountControllers.token);

export default authRouter;
