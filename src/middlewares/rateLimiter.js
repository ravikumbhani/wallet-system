const rateLimit = require('express-rate-limit');
const httpStatus = require('http-status');
const ApiError = require('../utils/ApiError');

const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // Limit each IP to 100 requests per windowMs
    message: new ApiError(httpStatus.TOO_MANY_REQUESTS, 'Too many requests, please try again later'),
    headers: true,
    handler: (req, res, next, options) => {
        next(new ApiError(httpStatus.TOO_MANY_REQUESTS, options.message));
    },
});

module.exports = limiter;
