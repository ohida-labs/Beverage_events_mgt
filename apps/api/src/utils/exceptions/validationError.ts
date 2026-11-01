import { httpStatusCodes } from "../types/enums/httpsCodes.js";
import BaseError from "./baseError.js";

class ValidationError extends BaseError {
  errors: Record<string, string>;

  constructor(
    errors: Record<string, string>,
    description = "Validation failed",
  ) {
    super(httpStatusCodes.BAD_REQUEST, true, description);
    this.errors = errors;
  }
}

export default ValidationError;
