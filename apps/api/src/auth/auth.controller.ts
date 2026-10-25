import { Response, Request, NextFunction } from "express";
import {
  ForgotPasswordService,
  LoginWithEmailAndPassword,
  PasswordResetService,
  SignupWithEmailAndPassword,
} from "./auth.service";
import { asyncHandler } from "../utils/middleware/error";
import jwt from "jsonwebtoken";
import AuthError from "@/utils/exceptions/AuthError";
import ValidationError from "@/utils/exceptions/validationError";

const jwtSecret = process.env.JWT_SECRET as string;
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

/*
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
*/

export const PasswordResetController = asyncHandler(
  async (req: Request, res: Response) => {
    const credentials = req.body as {
      old_password?: string;
      new_password?: string;
    };

    const { reset_token, source } = req.query as {
      reset_token?: string;
      source?: "forgot_password" | "change_password";
    };

    const email =
      typeof req.query.email === "string" ? req.query.email : undefined;

    if (source !== "change_password" && source !== "forgot_password") {
      throw new ValidationError({}, "Invalid password reset source.");
    }

    if (!credentials.new_password) {
      throw new ValidationError({}, "New password is required.");
    }

    if (credentials.new_password.length < 8) {
      throw new ValidationError({}, "Password must be at least 8 characters.");
    }

    if (source === "change_password") {
      if (!req.userId) {
        throw new AuthError("You must be logged in to change your password.");
      }

      if (!credentials.old_password) {
        throw new ValidationError({}, "Current password is required.");
      }

      if (credentials.old_password === credentials.new_password) {
        throw new ValidationError(
          {},
          "New password must differ from your current password.",
        );
      }
    } else if (!email || !reset_token) {
      throw new ValidationError({}, "Email and reset token are required.");
    }

    const reset_response = await PasswordResetService({
      userId: req.userId,
      email,
      reset_token,
      source,
      old_password: credentials.old_password,
      new_password: credentials.new_password,
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
    if (!email || !password || !first_name) {
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

//Check if authenticated
export const UserIsAuthorizedCheck = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    //get token from the headers
    const authHeader = req.headers.authorization;
    if (!authHeader) return res.status(401).end();

    const token = authHeader.split(" ")[1];

    try {
      const decoded = jwt.verify(token, jwtSecret) as {
        user_id: string;
        role: "default" | "admin" | "super_admin";
        priority: number;
      };

      res.json({
        status: true,
        data: {
          role: decoded.role,
          priority: decoded.priority,
          user_id: decoded.user_id,
        },
      });
    } catch (e) {
      console.log(e.message);
      if (e.code === "ERR_JWT_EXPIRED" || e.message === "jwt expired") {
        throw new AuthError("Session timed-out", 401);
      }

      if (e.message === "fetch failed") {
        throw new AuthError("Network failed! ", 500);
      }

      if (e.code === "ERR_JWKS_TIMEOUT") {
        throw new AuthError("Network failed! ", 500);
      }
      if (e.code === "ERR_JWS_INVALID") {
        throw new AuthError("Invalid token received! ", 400);
      }
      throw new AuthError("Could not Authenticate", 500);
    }
  },
);
