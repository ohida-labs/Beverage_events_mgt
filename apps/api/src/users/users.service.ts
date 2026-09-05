import bc from "bcrypt";
import NotFoundError from "@/utils/exceptions/NotFound";
import {
  CreateUser,
  GetAllUsersDb,
  GetUser,
  UpdateUser,
} from "./repository/users.repository";
import { IFilterUser, IUpdateUser } from "@/utils/types/interfaces/user";
import AuthError from "@/utils/exceptions/AuthError";

//General
export const GetUserDetails = async (userId: string) => {
  //might different user
  const user = await GetUser(userId);

  if (!user) {
    throw new NotFoundError("User not Found!");
  }

  return user;
};
export const UpdateUserDetails = async (
  userId: string,
  data: IUpdateUser,
  permissions?: string[],
) => {
  //Role is definitely an admin
  if (permissions && permissions.length > 0) {
    //Validate the permission here:
    //  if any of the key in updates object are not in the permission array.
    //  throw unauthorized error!
    Object.keys(data).forEach((update) => {
      if (!permissions.includes(update)) {
        throw new AuthError("Unauthorized access to update user information");
      }
    });
  }

  //USER ARE NOT ALLOWED TO UNBLACKLIST, CHANGE ROLE
  const updated = await UpdateUser(userId, data);
  return updated;
};

//inform organisation by posting on a 'action table' later!
export const DeleteUserDetails = async (userId: string) => {
  const user = await GetUser(userId);
  if (!user) {
    throw new NotFoundError("User not found!");
  }

  if (user.role !== "default") {
    throw new AuthError(
      "Unauthorized: Permission denied. Contact dev to remove your account!",
    );
  }
  const deleted = await UpdateUser(userId, {
    user_id: null,
  });

  //Send notice to org;

  return deleted;
};

//Admin control
export const CreateNewAdminUser = async (
  admin_id: string,
  data: {
    email: string;
    password: string;
  },
) => {
  const user = await GetUser(admin_id);

  if (user && user.role !== "default") {
    throw new AuthError(
      "Permission denied: You are not authorized to create a user",
    );
  }

  //create user with email and name,
  const newuser = await CreateUser({
    email: data.email,
    first_name: data.email.split("@")[0],
    password: await bc.hash(data.password, 10),
  });

  return newuser;
};

export const GetAllUsers = async (id: string, filter: IFilterUser) => {
  const user = await GetUser(id);

  if (user && user.role !== "default") {
    throw new AuthError(
      "Permission denied: You are not authorized to view these informations",
    );
  }

  const allusers = await GetAllUsersDb(filter);

  return {
    users: allusers.map((user) => ({
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
    })),
  };
};
