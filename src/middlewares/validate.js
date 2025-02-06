const { validate, ValidationError, Joi } = require('express-validation');
const httpStatus = require('http-status');
const ApiError = require('../utils/ApiError');

const validateRequest = (schema) => {
    return async (req, res, next) => {
        try {
            await validate(schema, {}, {})(req, res, () => next());
        } catch (error) {
            if (error instanceof ValidationError) {
                return next(new ApiError(httpStatus.BAD_REQUEST, error.details));
            }
            next(error);
        }
    };
};

module.exports = validateRequest;
