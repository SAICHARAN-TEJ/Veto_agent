/**
 * Wraps an async function to catch errors and pass them to the next Express error handler.
 * This eliminates the need for try-catch blocks in every route handler.
 */
const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

module.exports = asyncHandler;
