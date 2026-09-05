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

/* Users actions */
export const getUserController = asyncHandler(
  async (req: Request, res: Response) => {
    //Actual user request
    const userId = req.userId;

    //User_id
    const { user_id } = req.query;

    const userData = await GetUserDetails(userId);

    if (userData.role !== "default" && user_id) {
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
            priority: user.priority,
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
        priority: userData.priority,
      },
    });
  },
);

//update user
export const UpdateUserController = asyncHandler(
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
        "priority",
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
