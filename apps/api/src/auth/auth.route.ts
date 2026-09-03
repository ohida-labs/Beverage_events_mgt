//Routers for users;
import { Router } from "express";
import {
  ForgotPasswordController,
  LoginController,
  // LogoutController,
  PasswordResetController,
  SignupController,
} from "./auth.controller";

const AuthRouter = Router();

//With Auth Token FROM CHALLONGE API
AuthRouter.route("/signup").post(SignupController);

AuthRouter.route("/login").post(LoginController);

AuthRouter.route("/password_reset").post(PasswordResetController);

AuthRouter.route("/forgot_password").post(ForgotPasswordController);
//AuthRouter.route("/logout").delete(LogoutController);
export default AuthRouter;
