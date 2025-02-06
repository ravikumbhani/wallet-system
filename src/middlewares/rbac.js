const httpStatus = require('http-status');
const ApiError = require('../utils/ApiError');
const { permissions } = require('../config/rbac');

const rbac = (requiredPermission) => {
    return (req, res, next) => {
        try {
            if (!req.user || !req.user.role) {
                throw new ApiError(httpStatus.FORBIDDEN, 'Access denied');
            }

            const userPermissions = permissions[req.user.role] || [];

            if (!userPermissions.includes(requiredPermission)) {
                throw new ApiError(httpStatus.FORBIDDEN, 'You do not have permission to perform this action');
            }

            next();
        } catch (error) {
            next(error);
        }
    };
};

module.exports = rbac;
