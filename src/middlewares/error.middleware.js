function errorHandler(error, req, res, next) {
  const statusCode = error.statusCode || 500;
  const isServerError = statusCode >= 500;

  if (isServerError) {
    console.error('Unhandled application error:', {
      message: error.message,
      stack: error.stack
    });
  }

  res.status(statusCode).json({
    message: isServerError && process.env.NODE_ENV === 'production'
      ? 'Internal server error'
      : error.message || 'Internal server error'
  });
}

module.exports = {
  errorHandler
};

