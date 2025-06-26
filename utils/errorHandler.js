
export function withErrorHandling(handler) {
    return async function (req, res) {
        try {
            await handler(req, res)
        } catch (error) {
            console.error("API Error:", error);
            const statusCode = error.statusCode || 500;
            const message = error.message || "Internal Server Error";
            res.status(statusCode).json({ error: message });
        }

    }

}

class AppError extends Error {
    constructor(message, statusCode = 400) {
      super(message);
      this.statusCode = statusCode;
    }
  }
  
  module.exports = {
    withErrorHandling,
    AppError,
  };