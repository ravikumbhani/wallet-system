class ApiError extends Error {
    /**
     * Create an API error.
     * @param {number} statusCode - HTTP status code of the error
     * @param {string} message - Error message
     * @param {boolean} [isOperational=true] - Whether the error is operational (default: true)
     */
    constructor(statusCode, message, isOperational = true) {
        super(message);
        this.statusCode = statusCode;
        this.isOperational = isOperational;
        Error.captureStackTrace(this, this.constructor);
    }
}

module.exports = ApiError;
