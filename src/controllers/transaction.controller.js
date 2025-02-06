const httpStatus = require('http-status');
const catchAsync = require('../utils/catchAsync');
const { transactionService } = require('../services');
const ApiError = require('../utils/ApiError');

const getTransactions = catchAsync(async (req, res) => {
    const transactions = await transactionService.getTransactionsByUserId(req.user.id);
    res.json({ success: true, transactions });
});

const getTransactionById = catchAsync(async (req, res) => {
    const transaction = await transactionService.getTransactionById(req.params.transactionId);
    if (!transaction) {
        throw new ApiError(httpStatus.NOT_FOUND, 'Transaction not found');
    }
    res.json({ success: true, transaction });
});

const createTransaction = catchAsync(async (req, res) => {
    const { amount, type, recipientId } = req.body;
    const transaction = await transactionService.createTransaction(req.user.id, amount, type, recipientId);
    res.status(httpStatus.CREATED).json({ success: true, transaction });
});

module.exports = {
    getTransactions,
    getTransactionById,
    createTransaction,
};
