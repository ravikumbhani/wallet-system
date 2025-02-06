const httpStatus = require('http-status');
const User = require('../models/user.model');
const ApiError = require('../utils/ApiError');

/**
 * Create a new user
 * @param {Object} userBody
 * @returns {Promise<User>}
 */
const createUser = async (userBody) => {
    const existingUser = await User.findOne({ email: userBody.email });
    if (existingUser) {
        throw new ApiError(httpStatus.BAD_REQUEST, 'Email already taken');
    }

    const user = await User.create(userBody);
    return user;
};

/**
 * Get all users with filtering and pagination
 * @param {Object} filter
 * @param {Object} options
 * @returns {Promise<Array<User>>}
 */
const getUsers = async (filter, options) => {
    return User.find(filter)
        .limit(options.limit || 10)
        .skip(options.skip || 0)
        .sort(options.sort || '-createdAt');
};

/**
 * Get user by ID
 * @param {string} userId
 * @returns {Promise<User>}
 */
const getUserById = async (userId) => {
    return User.findById(userId);
};

/**
 * Update user by ID
 * @param {string} userId
 * @param {Object} updateBody
 * @returns {Promise<User>}
 */
const updateUserById = async (userId, updateBody) => {
    const user = await User.findById(userId);
    if (!user) {
        throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
    }

    Object.assign(user, updateBody);
    await user.save();
    return user;
};

/**
 * Delete user by ID
 * @param {string} userId
 * @returns {Promise<User>}
 */
const deleteUserById = async (userId) => {
    const user = await User.findByIdAndDelete(userId);
    if (!user) {
        throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
    }
    return user;
};

module.exports = {
    createUser,
    getUsers,
    getUserById,
    updateUserById,
    deleteUserById,
};
