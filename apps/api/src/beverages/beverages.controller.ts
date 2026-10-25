import type { Request, Response } from "express";
import { asyncHandler } from "@/utils/middleware/error";
import {
  CreateBeverageService,
  GetAllBeveragesService,
  GetAvailableBeveragesService,
  UpdateBeverageService,
} from "./beverages.service";
import AuthError from "@/utils/exceptions/AuthError";
import { GetUserDetails } from "@/users/users.service";
import { GetBeverageByIdService } from "./beverages.service";

export const GetAvailableBeveragesController = asyncHandler(
  async (_req: Request, res: Response) => {
    const result = await GetAvailableBeveragesService();

    res.json({
      status: true,
      data: result.beverages,
    });
  },
);

//admin only
/*
export const GetAllBeveragesController = asyncHandler(
  async (_req: Request, res: Response) => {
    //validate request
    const result = await GetAllBeveragesService();

    res.json({
      status: true,
      data: result.beverages,
    });
  },
);*/

export const GetAllBeveragesController = asyncHandler(
  async (req: Request, res: Response) => {
    const userId = req.userId;
    const rawPage = Number(req.query.page ?? 0);
    const rawLimit = Number(req.query.limit ?? 20);

    const page = Number.isInteger(rawPage) && rawPage >= 0 ? rawPage : 0;

    const limit =
      Number.isInteger(rawLimit) && rawLimit >= 1
        ? Math.min(rawLimit, 100)
        : 20;

    const search = String(req.query.search ?? "").trim();

    const availabilityParam = req.query.availability;
    let availability: boolean | null = null;

    if (availabilityParam === "true") {
      availability = true;
    } else if (availabilityParam === "false") {
      availability = false;
    }

    const userData = await GetUserDetails(userId);

    if (userData && userData.role !== "admin") {
      throw new AuthError(
        "permission denied: you can not view all beverage data",
      );
    }

    const result = await GetAllBeveragesService({
      page,
      limit,
      search,
      availability,
    });

    res.json({
      status: true,
      data: result.beverages,
      pagination: result.pagination,
    });
  },
);

//create drink

export const CreateBeverageController = asyncHandler(
  async (req: Request, res: Response) => {
    const { name, image_url, price } = req.body;

    const userId = req.userId;

    if (!userId) {
      res.status(401).json({
        status: false,
        message: "Authentication required.",
      });
      return;
    }

    if (
      typeof name !== "string" ||
      typeof price !== "number" ||
      (image_url !== undefined &&
        image_url !== null &&
        typeof image_url !== "string")
    ) {
      res.status(400).json({
        status: false,
        message: "Provide a valid name, price, and image URL.",
      });
      return;
    }

    const result = await CreateBeverageService({
      name,
      price,
      image_url,
      created_by: userId,
    });

    res.status(201).json({
      status: true,
      message: "Beverage created successfully.",
      data: result.beverage,
    });
  },
);

//update controler

export const UpdateBeverageController = asyncHandler(
  async (req: Request, res: Response) => {
    const { drink_id } = req.params as { drink_id: string };
    const { name, image_url, price, is_available } = req.body;

    const userId = req.userId;

    if (!userId) {
      res.status(401).json({
        status: false,
        message: "Authentication required.",
      });
      return;
    }

    if (
      (name !== undefined && typeof name !== "string") ||
      (image_url !== undefined &&
        image_url !== null &&
        typeof image_url !== "string") ||
      (price !== undefined && typeof price !== "number") ||
      (is_available !== undefined && typeof is_available !== "boolean")
    ) {
      res.status(400).json({
        status: false,
        message: "Invalid beverage update fields.",
      });
      return;
    }

    const result = await UpdateBeverageService(drink_id, {
      name,
      image_url,
      price,
      is_available,
    });

    res.json({
      status: true,
      message: "Beverage updated successfully.",
      data: result.beverage,
    });
  },
);

export const GetBeverageByIdController = asyncHandler(
  async (req: Request, res: Response) => {
    const result = await GetBeverageByIdService(req.params.drink_id as string);

    res.json({
      status: true,
      data: result.beverage,
    });
  },
);
