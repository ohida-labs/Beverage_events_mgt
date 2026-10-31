import { Response, Request } from "express";
import { asyncHandler } from "../utils/middleware/error";
import {
  CreateNewAdminUser,
  DeleteUserDetails,
  GetAllUsers,
  GetUserDetails,
  UpdateUserDetails,
} from "./users.service";
import { IFilterUser, IUpdateUser } from "@/utils/types/interfaces/user";
import ValidationError from "@/utils/exceptions/validationError";
import { UpdateUser } from "./repository/users.repository";
import AuthError from "@/utils/exceptions/AuthError";

/* Users actions */
/*
export const getUserController = asyncHandler(
  async (req: Request, res: Response) => {
    //Actual user request
    const userId = req.userId;

    //User_id
    const { user_id } = req.query;

    const userData = await GetUserDetails(userId);

    if (userData.role === "admin" && user_id) {
      const user = await GetUserDetails(user_id as string);
      res.json({
        status: true,
        data: {
          user: {
            email: user.email,
            blacklist: user.blacklisted,
            profile: user.profile,
            first_name: user.last_name,
            blacklist_reason: user.blacklisted_reason,
            phone_number: user.phone_number,
            last_number: user.last_name,
            role: user.role,
            created: user.created_at,
          },
        },
      });
      return;
    }

    res.json({
      status: true,
      data: {
        userId: userData.user_id,
        email: userData.email,
        country: userData.country,
        created: userData.created_at,
        blacklist: userData.blacklisted,
        profile: userData.profile,
        first_name: userData.last_name,
        phone_number: userData.phone_number,
        last_number: userData.last_name,
        role: userData.role,
      },
    });
  },
);
*/

export const GetDashboardStatController = asyncHandler(
  async (req: Request, res: Response) => {
    const userId = req.userId;
    // const targetUserId = req.query.user_id as string | undefined;
    /*
    const user = await GetUserDetails(userId);
    if (user.role === "admin") {
      //return p;latform stats
      const admin_stat = await GetAdminStat(userId);
      res.json({
        status: false,
        data: { stat: admin_stat },
      });
    }
    if (user.role === "consumer") {
      //return p;latform stats
      const user_stat = await GetUserStat(userId);
      res.json({
        status: false,
        data: { stat: user_stat },
      });
    }
*/
    res.json({
      status: false,
      data: null,
    });

    return;
  },
);

export const getUserController = asyncHandler(
  async (req: Request, res: Response) => {
    const userId = req.userId;
    const targetUserId = req.query.user_id as string | undefined;

    const currentUser = await GetUserDetails(userId);

    if (targetUserId && targetUserId !== userId) {
      if (currentUser.role !== "admin") {
        throw new AuthError(
          "Only administrators can view other users' details.",
        );
      }

      const user = await GetUserDetails(targetUserId);

      res.json({
        status: true,
        data: {
          user: {
            user_id: user.user_id,
            email: user.email,
            first_name: user.first_name,
            role: user.role,
            blacklist: user.blacklisted,
            blacklist_reason: user.blacklisted_reason,
            phone_number: user.phone_number,
            profile: user.profile_image_url,
            created: user.created_at,
          },
        },
      });

      return;
    }

    res.json({
      status: true,
      data: {
        user: {
          user_id: currentUser.user_id,
          email: currentUser.email,
          first_name: currentUser.first_name,
          last_name: currentUser.last_name,
          is_active: currentUser.is_active,
          country: currentUser.country,
          role: currentUser.role,
          blacklist: currentUser.blacklisted,
          blacklist_reason: currentUser.blacklisted_reason,
          phone_number: currentUser.phone_number,
          profile: currentUser.profile_image_url,
          created: currentUser.created_at,
        },
      },
    });
  },
);

//update user
/*export const UpdateUserController = asyncHandler(
  async (req: Request, res: Response) => {
    const updates: IUpdateUser = req.body;
    const userId = req.userId;
    const { user_id } = req.query;

    if (!updates) {
      throw new ValidationError({}, "There is nothing to update!");
    }

    //Original user
    const userData = await GetUserDetails(userId);

    //Check role: admin
    if (userData.role !== "default" && userData.user_id !== user_id) {
      const update_user = await UpdateUserDetails(user_id as string, updates, [
        "role",
        "blacklist",
        "blacklist_reason",
      ]);
      res.json({ status: true, data: update_user });
      return;
    }

    const update_user = await UpdateUserDetails(userId, updates);
    res.json({ status: true, data: update_user });
  },
);
*/

export const UpdateUserController = asyncHandler(
  async (req: Request, res: Response) => {
    const updates: IUpdateUser = req.body;
    const userId = req.userId;
    const targetUserId = req.query.user_id as string | undefined;

    if (!updates || Object.keys(updates).length === 0) {
      throw new ValidationError({}, "There is nothing to update!");
    }

    const userData = await GetUserDetails(userId);

    // Admin updating another user's account
    if (targetUserId && targetUserId !== userId) {
      if (userData.role !== "admin") {
        throw new AuthError("Only administrators can update other users.");
      }

      const updatedUser = await UpdateUserDetails(targetUserId, updates, [
        "role",
        "blacklisted",
        "blacklisted_reason",
      ]);

      res.json({ status: true, data: updatedUser });

      return;
    }

    // Users updating their own permitted profile fields
    if (
      updates.role !== undefined ||
      updates.blacklisted !== undefined ||
      updates.blacklisted_reason !== undefined
    ) {
      throw new AuthError(
        "You cannot change your own role or blacklist status.",
      );
    }

    const updatedUser = await UpdateUserDetails(userId, updates);

    res.json({ status: true, data: updatedUser });
  },
);

//Delete account?
export const DeleteAccountController = asyncHandler(
  async (req: Request, res: Response) => {
    const userId = req.userId;

    const response = await DeleteUserDetails(userId);

    res.json({ status: true, data: response });
  },
);

//Admin controls
export const GetUsersController = asyncHandler(
  async (req: Request, res: Response) => {
    const userId = req.userId;
    const { page, limit, search, sortBy, sortOrder, role } = req.query;
    const filter = {
      page: +page,
      limit: +limit,
      search,
      sortBy,
      sortOrder,
      role,
    } as IFilterUser;

    //Validate filter: TODO

    const response = await GetAllUsers(userId, filter);
    res.json({ status: true, data: response });
  },
);

export const CreateUserController = asyncHandler(
  async (req: Request, res: Response) => {
    const userId = req.userId;
    const credentials = req.body as {
      email: string;
      password: string;
    };
    if (!credentials || !credentials.email || !credentials.password) {
      throw new ValidationError({}, "Invalid Credentials!");
    }
    const response = await CreateNewAdminUser(userId, credentials);
    res.json({ status: true, data: response });
  },
);
