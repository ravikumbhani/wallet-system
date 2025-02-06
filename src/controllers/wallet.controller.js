const httpStatus = require('http-status');
const catchAsync = require('../utils/catchAsync');
const { walletService } = require('../services');
const ApiError = require('../utils/ApiError');

const getWallet = catchAsync(async (req, res) => {
    const wallet = await walletService.getWalletByUserId(req.user.id);
    if (!wallet) {
        throw new ApiError(httpStatus.NOT_FOUND, 'Wallet not found');
    }
    res.json({ success: true, wallet });
});

const createWallet = catchAsync(async (req, res) => {
    const wallet = await walletService.createWallet(req.user.id);
    res.status(httpStatus.CREATED).json({ success: true, wallet });
});

const deposit = catchAsync(async (req, res) => {
    const { amount } = req.body;
    const wallet = await walletService.deposit(req.user.id, amount);
    res.json({ success: true, wallet });
});

const withdraw = catchAsync(async (req, res) => {
    const { amount } = req.body;
    const wallet = await walletService.withdraw(req.user.id, amount);
    res.json({ success: true, wallet });
});

module.exports = {
    getWallet,
    createWallet,
    deposit,
    withdraw,
};
