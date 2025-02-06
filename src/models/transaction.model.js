const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema(
    {
        sender: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        receiver: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        amount: {
            type: Number,
            required: true,
            min: 0.01,
        },
        currency: {
            type: String,
            required: true,
            default: 'USD',
            enum: ['USD', 'EUR', 'GBP', 'INR'],
        },
        status: {
            type: String,
            enum: ['pending', 'completed', 'failed'],
            default: 'pending',
        },
        transactionType: {
            type: String,
            enum: ['transfer', 'deposit', 'withdrawal'],
            required: true,
        },
    },
    {
        timestamps: true,
    }
);

// Method to mark transaction as completed
transactionSchema.methods.complete = function () {
    this.status = 'completed';
    return this.save();
};

// Method to mark transaction as failed
transactionSchema.methods.fail = function () {
    this.status = 'failed';
    return this.save();
};

const Transaction = mongoose.model('Transaction', transactionSchema);

module.exports = Transaction;
