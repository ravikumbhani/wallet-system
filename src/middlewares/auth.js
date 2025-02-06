const jwt = require('jsonwebtoken');
const httpStatus = require('http-status');
const User = require('../models/user.model');
const ApiError = require('../utils/ApiError');
const { JWT_SECRET } = require('../config/vars');

const auth = async (req, res, next) => {
    try {
        const token = req.header('Authorization')?.replace('Bearer ', '');
        if (!token) {
            throw new ApiError(httpStatus.UNAUTHORIZED, 'Authentication token required');
        }

        const decoded = jwt.verify(token, JWT_SECRET);
        const user = await User.findById(decoded.id);

        if (!user) {
            throw new ApiError(httpStatus.UNAUTHORIZED, 'User not found');
        }

        req.user = user;
        next();
    } catch (error) {
        next(new ApiError(httpStatus.UNAUTHORIZED, 'Invalid or expired token'));
    }
};

module.exports = auth;
