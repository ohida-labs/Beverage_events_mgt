import { httpStatusCodes } from "../types/enums/httpsCodes";
import BaseError from "./baseError";
class NotFoundError extends BaseError {
  constructor(description: string = "Not found.") {
    super(httpStatusCodes.NOT_FOUND, true, description);
  }
}

export default NotFoundError;
