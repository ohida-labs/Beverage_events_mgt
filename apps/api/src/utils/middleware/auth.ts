/*
This file called for every authorize request by the browser or discord bot;
*/
import jwt from "jsonwebtoken";
import { NextFunction, Request, Response } from "express";
import AuthError from "../exceptions/AuthError";

const jwtSecret = process.env.JWT_SECRET as string;

export async function AuthorizationClientRequest(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  const authHeader = req.headers.authorization;
  if (!authHeader) return res.status(401).end();
  const token = authHeader.split(" ")[1];
  try {
    const decoded = jwt.verify(token, jwtSecret) as {
      user_id: string;
    };
    //console.log(decoded);//user_id, iat, exp
    req.userId = decoded.user_id;
    next();
  } catch (e) {
    console.log(e);
    if (e.code === "ERR_JWT_EXPIRED") {
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
    next();
  }
}

//Discord decoding request; Checking if it real
export const AuthorizationBotRequest = () => {};
