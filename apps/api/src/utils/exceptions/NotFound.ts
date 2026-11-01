import { httpStatusCodes } from "../types/enums/httpsCodes.js";
import BaseError from "./baseError.js";
class NotFoundError extends BaseError {
  constructor(description: string = "Not found.") {
    super(httpStatusCodes.NOT_FOUND, true, description);
  }
}

export default NotFoundError;
