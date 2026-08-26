import express from "express";
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
