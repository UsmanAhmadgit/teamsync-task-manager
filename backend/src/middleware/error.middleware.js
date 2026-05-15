// Global error handler — MUST be registered last in app.js
// Catches all errors thrown or passed via next(err)
function errorHandler(err, req, res, next) {
  console.error(err.stack);

  const status = err.status || err.statusCode || 500;
  const message = err.message || 'Internal Server Error';

  res.status(status).json({
    success: false,
    message,
    errors: err.errors || [],
  });
}

module.exports = errorHandler;
