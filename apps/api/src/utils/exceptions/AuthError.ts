import BaseError from "./baseError";

class AuthError extends BaseError {
  constructor(description: string, statusCode = 401) {
    super(statusCode, true, description);
  }
}

export default AuthError;
