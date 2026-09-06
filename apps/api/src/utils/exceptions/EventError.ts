import BaseError from "./baseError";

class EventError extends BaseError {
  title?: string;
  constructor(
    description: string,
    statusCode = 500,
    title?: string | undefined,
  ) {
    super(statusCode, true, description);
    this.title = title;
  }
}

export default EventError;
