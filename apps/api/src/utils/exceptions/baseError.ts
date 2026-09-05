class BaseError extends Error {
  isOperational: boolean;
  statusCode: number;

  constructor(
    statusCode: number,
    isOperational: boolean = true,
    description: string,
  ) {
    //From THE parent class!
    super(description);
    Object.setPrototypeOf(this, new.target.prototype);

    //Adding this to the Error Class
    this.name = new.target.name;
    this.statusCode = statusCode;
    this.isOperational = isOperational;
    Error.captureStackTrace(this, new.target);
  }
}
export default BaseError;
