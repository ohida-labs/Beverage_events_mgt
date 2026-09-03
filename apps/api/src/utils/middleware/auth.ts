/*
This file called for every authorize request by the browser or discord bot;
*/
import jwt from "jsonwebtoken";
import { NextFunction, Request, Response } from "express";

const jwtSecret = process.env.JWT_SECRET as string;

export async function AuthorizationClientRequest(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const authToken = req.cookies?.access_token;
    if (!authToken) return res.status(401).end();

    const decoded = jwt.verify(authToken, jwtSecret);

    console.log(decoded);
    //req.userId = decoded.challonge_id;
    next();
  } catch (e) {
    console.log(e);
    //const refresh_token = req.cookies?.refresh_token as string;

    //if (!refresh_token) throw new Error("Unauthorized Access. Login again!");

    //const session = await GetSessionInDb(refresh_token);
    // if (!session) throw new Error("Invalid Session Id. Login again!");

    //Check expires_at date;
    //const now = new Date();

    //if (new Date(session?.expires_at) < now) {
    //throw new Error('Session has expired. Login again!')
    //}

    // generate new token
    /*const newToken = jwt.sign(
      { challonge_id: session?.challonge_id },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );*/

    //req.userId = session.challonge_id;
    // res.cookie("access_token", newToken, { httpOnly: true });
    //next();
  }
}

//Discord decoding request; Checking if it real
export const AuthorizationBotRequest = () => {};
