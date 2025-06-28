export class AppError extends Error {
  constructor(message, statusCode = 500) {
    super(message || 'Something went wrong');
    this.statusCode = statusCode;
    this.name = 'AppError';
  }
}

export function withErrorHandling(handler) {
  return async (req, res) => {
    try {
      await handler(req, res);
    } catch (error) {
      const statusCode = error.statusCode || 500;
      const message = error.message || 'Internal Server Error';

      if (process.env.NODE_ENV !== 'production') {
        console.error('API Error:', error);
      }

      if (!res.headersSent) {
        res.status(statusCode).json({ error: message });
      }
    }
  };
}