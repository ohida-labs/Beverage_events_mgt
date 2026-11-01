import BaseError from "./baseError.js";

class AuthError extends BaseError {
  constructor(description: string, statusCode = 401) {
    super(statusCode, true, description);
  }
}

export default AuthError;
