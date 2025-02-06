const Joi = require('joi');
const { objectId } = require('../utils/validateObjectId');

/**
 * Validation schema for user-related operations
 */
const createUser = {
    body: Joi.object().keys({
        name: Joi.string().required().min(3).max(50),
        email: Joi.string().email().required(),
        password: Joi.string().required().min(6),
        role: Joi.string().valid('user', 'vendor').required(),
    }),
};

const updateUser = {
    params: Joi.object().keys({
        userId: Joi.string().custom(objectId).required(),
    }),
    body: Joi.object()
        .keys({
            name: Joi.string().min(3).max(50),
            email: Joi.string().email(),
            password: Joi.string().min(6),
            role: Joi.string().valid('user', 'vendor'),
        })
        .min(1), // Ensures at least one field is provided for update
};

const deleteUser = {
    params: Joi.object().keys({
        userId: Joi.string().custom(objectId).required(),
    }),
};

const getUserById = {
    params: Joi.object().keys({
        userId: Joi.string().custom(objectId).required(),
    }),
};

module.exports = {
    createUser,
    updateUser,
    deleteUser,
    getUserById,
};
