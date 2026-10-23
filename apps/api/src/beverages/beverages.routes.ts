import { Router } from "express";
import { GetAvailableBeveragesController } from "./beverages.controller";

const BeverageRoute = Router();

BeverageRoute.get("/", GetAvailableBeveragesController);

export default BeverageRoute;
