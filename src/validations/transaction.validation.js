const Joi = require('joi');

/**
 * Validation schema for transaction operations
 */
const createTransaction = {
    body: Joi.object().keys({
        amount: Joi.number().positive().required(),
        currency: Joi.string().valid('USD', 'EUR', 'GBP', 'INR').required(),
        type: Joi.string().valid('credit', 'debit').required(),
        recipientId: Joi.string().required(),
    }),
};

const getTransactions = {
    query: Joi.object().keys({
        page: Joi.number().integer().min(1).default(1),
        limit: Joi.number().integer().min(1).default(10),
        sortBy: Joi.string().valid('amount', 'createdAt'),
        order: Joi.string().valid('asc', 'desc').default('desc'),
    }),
};

module.exports = {
    createTransaction,
    getTransactions,
};
