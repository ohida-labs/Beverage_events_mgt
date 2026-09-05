import NotFoundError from "@/utils/exceptions/NotFound";
import { GetUser, UpdateUser } from "./repository/users.repository";
import { IUpdateUser } from "@/utils/types/interfaces/user";
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

//Admin
export const CreateNewAdminUser = async () => {};
export const ViewUserDetails = async () => {}; // Less infor released
export const BlacklistUser = async () => {};
export const UpdateUserRoleAndPriority = async () => {};
export const GetAllUsers = async () => {};
