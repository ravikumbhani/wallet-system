const httpStatus = require('http-status');
const catchAsync = require('../utils/catchAsync');
const { userService } = require('../services');
const ApiError = require('../utils/ApiError');

const getUsers = catchAsync(async (req, res) => {
    const users = await userService.getAllUsers();
    res.json({ success: true, users });
});

const getUserById = catchAsync(async (req, res) => {
    const user = await userService.getUserById(req.params.userId);
    if (!user) {
        throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
    }
    res.json({ success: true, user });
});

const updateUser = catchAsync(async (req, res) => {
    const user = await userService.updateUser(req.params.userId, req.body);
    res.json({ success: true, user });
});

const deleteUser = catchAsync(async (req, res) => {
    await userService.deleteUser(req.params.userId);
    res.status(httpStatus.NO_CONTENT).send();
});

module.exports = {
    getUsers,
    getUserById,
    updateUser,
    deleteUser,
};
