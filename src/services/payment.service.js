const httpStatus = require('http-status');
const Wallet = require('../models/wallet.model');
const Transaction = require('../models/transaction.model');
const ApiError = require('../utils/ApiError');

/**
 * Process a payment transaction between two users
 * @param {string} senderId - The ID of the user sending the payment
 * @param {string} receiverId - The ID of the user receiving the payment
 * @param {number} amount - The amount to be transferred
 * @returns {Promise<Transaction>}
 */
const processPayment = async (senderId, receiverId, amount) => {
    if (senderId === receiverId) {
        throw new ApiError(httpStatus.BAD_REQUEST, "Sender and receiver cannot be the same");
    }

    const senderWallet = await Wallet.findOne({ user: senderId });
    const receiverWallet = await Wallet.findOne({ user: receiverId });

    if (!senderWallet) {
        throw new ApiError(httpStatus.NOT_FOUND, "Sender's wallet not found");
    }

    if (!receiverWallet) {
        throw new ApiError(httpStatus.NOT_FOUND, "Receiver's wallet not found");
    }

    if (senderWallet.balance < amount) {
        throw new ApiError(httpStatus.BAD_REQUEST, "Insufficient funds");
    }

    // Deduct amount from sender's wallet
    senderWallet.balance -= amount;
    await senderWallet.save();

    // Add amount to receiver's wallet
    receiverWallet.balance += amount;
    await receiverWallet.save();

    // Create a transaction record
    const transaction = await Transaction.create({
        sender: senderId,
        receiver: receiverId,
        amount,
        status: 'completed',
        type: 'transfer',
    });

    return transaction;
};

/**
 * Retrieve all transactions for a user
 * @param {string} userId
 * @returns {Promise<Array<Transaction>>}
 */
const getTransactionsByUserId = async (userId) => {
    const transactions = await Transaction.find({
        $or: [{ sender: userId }, { receiver: userId }],
    }).sort({ createdAt: -1 });

    return transactions;
};

module.exports = {
    processPayment,
    getTransactionsByUserId,
};
