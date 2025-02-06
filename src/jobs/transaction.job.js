const Queue = require('bull');
const Transaction = require('../models/transaction.model');
const Wallet = require('../models/wallet.model');
const logger = require('../config/logger');

const transactionQueue = new Queue('transactions', {
    redis: { host: '127.0.0.1', port: 6379 }, // Ensure Redis is running
});

/**
 * Process transaction jobs
 */
transactionQueue.process(async (job, done) => {
    try {
        const { userId, amount, type, recipientId } = job.data;

        logger.info(`Processing transaction for user: ${userId}, amount: ${amount}, type: ${type}`);

        const senderWallet = await Wallet.findOne({ owner: userId });
        if (!senderWallet) throw new Error('Sender wallet not found');

        const recipientWallet = await Wallet.findOne({ owner: recipientId });
        if (!recipientWallet) throw new Error('Recipient wallet not found');

        if (type === 'debit' && senderWallet.balance < amount) {
            throw new Error('Insufficient balance');
        }

        // Perform the transaction
        if (type === 'debit') {
            senderWallet.balance -= amount;
            recipientWallet.balance += amount;
        } else if (type === 'credit') {
            senderWallet.balance += amount;
        }

        await senderWallet.save();
        await recipientWallet.save();

        await Transaction.create({
            user: userId,
            amount,
            type,
            recipient: recipientId,
            status: 'completed',
        });

        logger.info(`Transaction completed for user: ${userId}`);
        done();
    } catch (error) {
        logger.error(`Transaction failed: ${error.message}`);
        done(error);
    }
});

/**
 * Add a transaction to the queue
 */
const addTransactionToQueue = async (transactionData) => {
    await transactionQueue.add(transactionData);
};

module.exports = {
    addTransactionToQueue,
};
