import type { Request, Response } from "express";
import { asyncHandler } from "@/utils/middleware/error";
import { GetAvailableBeveragesService } from "./beverages.service";

export const GetAvailableBeveragesController = asyncHandler(
  async (_req: Request, res: Response) => {
    const result = await GetAvailableBeveragesService();

    res.json({
      status: true,
      data: result.beverages,
    });
  },
);
