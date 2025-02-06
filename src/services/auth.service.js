const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const httpStatus = require('http-status');
const User = require('../models/user.model');
const ApiError = require('../utils/ApiError');
const config = require('../config/vars');

/**
 * Generate JWT token
 * @param {Object} user
 * @returns {string}
 */
const generateToken = (user) => {
    const payload = { id: user.id, role: user.role };
    return jwt.sign(payload, config.JWT_SECRET, { expiresIn: config.JWT_EXPIRATION });
};

/**
 * Register a new user
 * @param {Object} userBody
 * @returns {Promise<User>}
 */
const registerUser = async (userBody) => {
    const { email, password, role } = userBody;
    const existingUser = await User.findOne({ email });

    if (existingUser) {
        throw new ApiError(httpStatus.BAD_REQUEST, 'Email already taken');
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({ email, password: hashedPassword, role });

    return { user, token: generateToken(user) };
};

/**
 * Login user
 * @param {string} email
 * @param {string} password
 * @returns {Promise<{ user: User, token: string }>}
 */
const loginUser = async (email, password) => {
    const user = await User.findOne({ email });

    if (!user || !(await bcrypt.compare(password, user.password))) {
        throw new ApiError(httpStatus.UNAUTHORIZED, 'Invalid email or password');
    }

    return { user, token: generateToken(user) };
};

/**
 * Get user by ID
 * @param {string} userId
 * @returns {Promise<User>}
 */
const getUserById = async (userId) => {
    return User.findById(userId);
};

module.exports = {
    registerUser,
    loginUser,
    getUserById,
};
