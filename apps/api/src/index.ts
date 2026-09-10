//import type { ApiResponse, User } from "@repo/shared";

//Extenal Package
import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import path from "node:path";

//Middlewares
import {
  errorLoggingMiddleWare,
  errorResponseHandler,
  RouteNotFoundHandler,
} from "./utils/middleware/error";

//Routes
import AuthRouter from "./auth/auth.route";
import EventRoute from "./events/events.route";
import UserRouter from "./users/users.route";

//dotenv.config({ path: ".env.local" });

dotenv.config({
  path: path.resolve("apps/api/.env.local"),
});

const app = express();
const PORT = 8080;

app.use(cookieParser());
app.use(cors());
app.use(express.json());

//Auth
app.use("/v0.1/auth", AuthRouter);

//User
app.use("/v0.1/user", UserRouter);

//Events
app.use("/v0.1/user", EventRoute);

app.get("/", (req, res) => {
  res.send("Welcome to BEMGS API!");
});

// 404 handler
app.use(RouteNotFoundHandler);
//app.use(methodNotAllowedHandler(['GET', 'POST', 'PUT', 'DELETE']));

// Global error handler - must be last middleware
app.use(errorResponseHandler);

//Log SomeEles
app.use(errorLoggingMiddleWare);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
