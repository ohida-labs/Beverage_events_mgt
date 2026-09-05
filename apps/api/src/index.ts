/*import express from "express";
import type { ApiResponse, User } from "@repo/shared";
const app = express();
app.get("/api/user", (_req, res) => {
  const user: User = {
    id: "123",
    name: "Ohida",
  };
  const response: ApiResponse<User> = {
    data: user,
    message: "User retrieved",
  };
  res.json(response);
});
app.listen(3000, () => {
  console.log("API running on http://localhost:3000");
});
*/

/*
The purpose of this project;
  
Personal
 - to learn and understand typescript;
 - see how database works under load;
 
Community 
 - To build a fun app for gamers;
 - To allow gamer earn from their skills;

 */
/*
import express from "express";
const app = express();
const port = "3030";

//Usees Routes 
app.route("/user", );

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
*/

//Extenal Package
import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";

//Middlewares
import {
  errorLoggingMiddleWare,
  errorResponseHandler,
  RouteNotFoundHandler,
} from "./utils/middleware/error";

//Routes
import AuthRouter from "./auth/auth.route";

const app = express();
const PORT = 8080;

dotenv.config({ path: ".env.local" });

app.use(cookieParser());
app.use(cors());
app.use(express.json());

//Auth
app.use("/v0.1/auth", AuthRouter);

//User
app.use("/v0.1/user", AuthRouter);

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
