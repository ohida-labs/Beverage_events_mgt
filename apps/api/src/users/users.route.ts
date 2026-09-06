//All user Actions and Data: role and priority;
import { Router } from "express";
import {
  CreateUserController,
  DeleteAccountController,
  getUserController,
  UpdateUserController,
} from "./users.controller";

const UserRouter = Router();

//General actions
UserRouter.route("/")
  .post(CreateUserController)
  .get(getUserController)
  .patch(UpdateUserController)
  .delete(DeleteAccountController);

UserRouter.route("/all").get(getUserController);

export default UserRouter;
