const Joi = require('joi');

/**
 * Validation schema for user authentication
 */
const register = {
    body: Joi.object().keys({
        name: Joi.string().required().min(3).max(50),
        email: Joi.string().email().required(),
        password: Joi.string().required().min(6),
        role: Joi.string().valid('user', 'vendor').required(),
    }),
};

const login = {
    body: Joi.object().keys({
        email: Joi.string().email().required(),
        password: Joi.string().required(),
    }),
};

const refreshToken = {
    body: Joi.object().keys({
        refreshToken: Joi.string().required(),
    }),
};

module.exports = {
    register,
    login,
    refreshToken,
};
