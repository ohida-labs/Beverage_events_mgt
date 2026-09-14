import { Router } from "express";
import {
  ForgotPasswordController,
  LoginController,
  PasswordResetController,
  SignupController,
  UserIsAuthorizedCheck,
} from "./auth.controller";

const AuthRouter = Router();

//With Auth Token FROM CHALLONGE API
AuthRouter.route("/signup").post(SignupController);

AuthRouter.route("/login").post(LoginController);

AuthRouter.route("/password_reset").post(PasswordResetController);

AuthRouter.route("/forgot_password").post(ForgotPasswordController);

AuthRouter.route("/authorized").get(UserIsAuthorizedCheck);
export default AuthRouter;
