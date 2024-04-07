class ApiError extends Error {
    constructor(
      statusCode=500,
      message="An error without a message provided",
      errors=[],
      stack = '',
      ) {
      super(message);
      this.statusCode = statusCode||500;
      this.errors=errors;
      this.success= false;
      this.data= null;// i could be listening to success flag or data flag at frontend
      if (stack) {
        this.stack = stack;
      } else {
        Error.captureStackTrace(this, this.constructor);
      }
  }
  }
  export default ApiError;