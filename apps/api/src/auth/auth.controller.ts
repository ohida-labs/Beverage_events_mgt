import { Response, Request } from "express";
import {
  ForgotPasswordService,
  LoginWithEmailAndPassword,
  PasswordResetService,
  SignupWithEmailAndPassword,
} from "./auth.service";
import { asyncHandler } from "../utils/middleware/error";

/*Implement auth with lucia Auth! */
export const LoginController = asyncHandler(
  async (req: Request, res: Response) => {
    const credientials = req.body as {
      email: string;
      password: string;
    };

    //Validate field;
    if (!credientials.email || !credientials.password) {
      throw new Error("Invalid Email/password");
    }

    //Token
    const token = await LoginWithEmailAndPassword(credientials);

    res.cookie("access_token", token, {
      httpOnly: process.env.NODE_ENV === "production",
    });
    res.json({ status: true, data: token });
  },
);

export const PasswordResetController = asyncHandler(
  async (req: Request, res: Response) => {
    //new_password && old_password
    const credientials = req.body as {
      old_password?: string; //Dashboard settings
      new_password: string;
    };

    const userId = req.userId || null;

    const { email, reset_token, source } = req.query as {
      reset_token: string | null;
      email: string;
      source: any;
    };

    //Validate field;
    if (!credientials.old_password || !credientials.new_password) {
      throw new Error("Invalid password! Check again");
    }

    if (credientials.old_password === credientials.new_password) {
      throw new Error("Can not use same password");
    }

    const reset_response = await PasswordResetService({
      email,
      reset_token,
      source,
      userId,
      old_password: credientials.old_password,
      new_password: credientials.new_password,
    });

    res.json({ status: true, data: reset_response });
  },
);

export const ForgotPasswordController = asyncHandler(
  async (req: Request, res: Response) => {
    //new_password && old_password
    const credientials = req.body as {
      email: string;
    };

    //Validate field;
    if (!credientials.email) {
      throw new Error("Invalid email! Check again");
    }

    const response = await ForgotPasswordService(credientials);

    res.json({ status: true, data: response });
  },
);

//Register new user
export const SignupController = asyncHandler(
  async (req: Request, res: Response) => {
    //name, email, password;
    const { email, password, first_name, last_name } = req.body;

    //Validate field;
    if (!email || !password || !first_name || !last_name) {
      throw new Error("Invalid credentials");
    }

    //Token
    const token = await SignupWithEmailAndPassword({
      email,
      password,
      first_name,
      last_name,
    });

    res.cookie("access_token", token, {
      httpOnly: process.env.NODE_ENV === "production",
    });
    res.json({ status: true, data: token });
  },
);
