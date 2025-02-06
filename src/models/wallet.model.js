const mongoose = require('mongoose');

const walletSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
            unique: true,
        },
        balance: {
            type: Number,
            required: true,
            default: 0.0,
        },
        currency: {
            type: String,
            required: true,
            default: 'USD',
            enum: ['USD', 'EUR', 'GBP', 'INR'],
        },
    },
    {
        timestamps: true,
    }
);

// Method to check if the wallet has enough balance
walletSchema.methods.hasSufficientBalance = function (amount) {
    return this.balance >= amount;
};

// Method to credit (add) balance
walletSchema.methods.credit = function (amount) {
    this.balance += amount;
    return this.save();
};

// Method to debit (deduct) balance
walletSchema.methods.debit = function (amount) {
    if (!this.hasSufficientBalance(amount)) {
        throw new Error('Insufficient balance');
    }
    this.balance -= amount;
    return this.save();
};

const Wallet = mongoose.model('Wallet', walletSchema);

module.exports = Wallet;
