// Wraps async controllers to avoid try/catch everywhere
// Any thrown error automatically goes to error.middleware.js
const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

module.exports = asyncHandler;
