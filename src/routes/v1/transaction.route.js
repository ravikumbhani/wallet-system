const express = require('express');
const transactionController = require('../../controllers/transaction.controller');
const authMiddleware = require('../../middlewares/auth');
const validate = require('../../middlewares/validate');
const transactionValidation = require('../../validations/transaction.validation');

const router = express.Router();

// Transaction-related routes (protected by authentication)
router.get('/', authMiddleware, transactionController.getTransactions);
router.get('/:transactionId', authMiddleware, transactionController.getTransactionById);
router.post(
    '/transfer',
    authMiddleware,
    validate(transactionValidation.transfer),
    transactionController.transferFunds
);

module.exports = router;
