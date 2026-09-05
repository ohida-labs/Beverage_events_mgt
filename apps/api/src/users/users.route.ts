//All user Actions and Data: role and priority;
import { Router } from "express";
import {
  DeleteAccountController,
  getUserController,
  UpdateUserController,
} from "./users.controller";

const UserRouter = Router();

//General actions
UserRouter.route("/")
  .post(getUserController)
  .patch(UpdateUserController)
  .delete(DeleteAccountController);

export default UserRouter;
