import { Router } from "express";
import {
  CreateBeverageController,
  GetAllBeveragesController,
  GetAvailableBeveragesController,
  GetBeverageByIdController,
  UpdateBeverageController,
} from "./beverages.controller";
import { AuthorizationClientRequest } from "@/utils/middleware/auth";

const BeverageRoute = Router();

BeverageRoute.get("/", GetAvailableBeveragesController);
BeverageRoute.post("/", AuthorizationClientRequest, CreateBeverageController);
BeverageRoute.patch(
  "/:drink_id",
  AuthorizationClientRequest,
  UpdateBeverageController,
);
BeverageRoute.get(
  "/all",
  AuthorizationClientRequest,
  GetAllBeveragesController,
);

//Should this only be viewed by an admin or public?
BeverageRoute.get("/:drink_id", GetBeverageByIdController);
export default BeverageRoute;
