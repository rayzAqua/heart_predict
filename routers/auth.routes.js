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
authRouter.patch(
  "/change-password-in-forgot",
  authenticateToken,
  AuthControllers.changePasswordInForgot
);
authRouter.post("/forgot-password", AuthControllers.forgotPassword);
authRouter.get("/change-password-form", AuthControllers.changePasswordForm);
authRouter.post("/refresh-token", AuthControllers.refeshToken);
authRouter.post("/token", AuthControllers.token);
authRouter.put("/:id/update", authenticateToken, AuthControllers.updateUser);

export default authRouter;
