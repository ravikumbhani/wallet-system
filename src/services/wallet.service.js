const httpStatus = require('http-status');
const Wallet = require('../models/wallet.model');
const ApiError = require('../utils/ApiError');

/**
 * Create a new wallet for a user
 * @param {Object} walletBody
 * @returns {Promise<Wallet>}
 */
const createWallet = async (walletBody) => {
    const existingWallet = await Wallet.findOne({ user: walletBody.user });
    if (existingWallet) {
        throw new ApiError(httpStatus.BAD_REQUEST, 'User already has a wallet');
    }

    const wallet = await Wallet.create(walletBody);
    return wallet;
};

/**
 * Get wallet by user ID
 * @param {string} userId
 * @returns {Promise<Wallet>}
 */
const getWalletByUserId = async (userId) => {
    const wallet = await Wallet.findOne({ user: userId });
    if (!wallet) {
        throw new ApiError(httpStatus.NOT_FOUND, 'Wallet not found');
    }
    return wallet;
};

/**
 * Credit amount to wallet
 * @param {string} userId
 * @param {number} amount
 * @returns {Promise<Wallet>}
 */
const creditWallet = async (userId, amount) => {
    const wallet = await Wallet.findOne({ user: userId });
    if (!wallet) {
        throw new ApiError(httpStatus.NOT_FOUND, 'Wallet not found');
    }

    wallet.balance += amount;
    await wallet.save();
    return wallet;
};

/**
 * Debit amount from wallet
 * @param {string} userId
 * @param {number} amount
 * @returns {Promise<Wallet>}
 */
const debitWallet = async (userId, amount) => {
    const wallet = await Wallet.findOne({ user: userId });
    if (!wallet) {
        throw new ApiError(httpStatus.NOT_FOUND, 'Wallet not found');
    }

    if (wallet.balance < amount) {
        throw new ApiError(httpStatus.BAD_REQUEST, 'Insufficient balance');
    }

    wallet.balance -= amount;
    await wallet.save();
    return wallet;
};

/**
 * Delete wallet by user ID
 * @param {string} userId
 * @returns {Promise<Wallet>}
 */
const deleteWalletByUserId = async (userId) => {
    const wallet = await Wallet.findOneAndDelete({ user: userId });
    if (!wallet) {
        throw new ApiError(httpStatus.NOT_FOUND, 'Wallet not found');
    }
    return wallet;
};

module.exports = {
    createWallet,
    getWalletByUserId,
    creditWallet,
    debitWallet,
    deleteWalletByUserId,
};
