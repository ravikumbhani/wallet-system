/**
 * A higher-order function to catch async errors and pass them to the error handler.
 * @param {Function} fn - The async function to wrap.
 * @returns {Function} A new function that handles errors.
 */
const catchAsync = (fn) => (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch((err) => next(err));
};

module.exports = catchAsync;
