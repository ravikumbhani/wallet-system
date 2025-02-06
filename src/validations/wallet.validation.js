const Joi = require('joi');

/**
 * Validation schema for wallet operations
 */
const fundWallet = {
    body: Joi.object().keys({
        amount: Joi.number().positive().required(),
        currency: Joi.string().valid('USD', 'EUR', 'GBP', 'INR').required(),
    }),
};

const withdraw = {
    body: Joi.object().keys({
        amount: Joi.number().positive().required(),
        currency: Joi.string().valid('USD', 'EUR', 'GBP', 'INR').required(),
    }),
};

module.exports = {
    fundWallet,
    withdraw,
};
