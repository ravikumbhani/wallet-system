const httpStatus = require('http-status');
const catchAsync = require('../utils/catchAsync');
const { authService, userService } = require('../services');
const ApiError = require('../utils/ApiError');

const register = catchAsync(async (req, res) => {
    const user = await userService.createUser(req.body);
    const tokens = await authService.generateAuthTokens(user);
    res.status(httpStatus.CREATED).json({ success: true, user, tokens });
});

const login = catchAsync(async (req, res) => {
    const { email, password } = req.body;
    const user = await authService.loginUserWithEmailAndPassword(email, password);
    const tokens = await authService.generateAuthTokens(user);
    res.json({ success: true, user, tokens });
});

const logout = catchAsync(async (req, res) => {
    await authService.logout(req.body.refreshToken);
    res.status(httpStatus.NO_CONTENT).send();
});

const refreshTokens = catchAsync(async (req, res) => {
    const tokens = await authService.refreshAuth(req.body.refreshToken);
    res.json({ success: true, tokens });
});

const getProfile = catchAsync(async (req, res) => {
    res.json({ success: true, user: req.user });
});

module.exports = {
    register,
    login,
    logout,
    refreshTokens,
    getProfile,
};
