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
    res.json({ token });
  },
);

export const PasswordResetController = asyncHandler(
  async (req: Request, res: Response) => {
    //new_password && old_password
    const credientials = req.body as {
      old_password?: string; //Dashboard settings
      reset_token?: string; // Forgotten password
      new_password: string;
    };

    //Validate field;
    if (!credientials.old_password || !credientials.new_password) {
      throw new Error("Invalid password! Check again");
    }

    if (credientials.old_password === credientials.new_password) {
      throw new Error("Can not use same password");
    }

    const reset_response = await PasswordResetService({
      userId: "adasd",
      old_password: "dasd",
      new_password: "",
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
    res.json({ token });
  },
);

//Delete session on the db
/*export const LogoutController = asyncHandler(
  async (req: Request, res: Response) => {
    const message = await  
    res.json({
      OMO: { email, password },
    });
  },
);*/

//Collect extra information from client
//export const onBoardingController = asyncHandler(async(req: Request, res: Response) => {})
