const express = require('express');
const walletController = require('../../controllers/wallet.controller');
const authMiddleware = require('../../middlewares/auth');
const validate = require('../../middlewares/validate');
const walletValidation = require('../../validations/wallet.validation');

const router = express.Router();

// Wallet-related routes (protected by authentication)
router.get('/', authMiddleware, walletController.getWallet);
router.post(
    '/fund',
    authMiddleware,
    validate(walletValidation.fundWallet),
    walletController.fundWallet
);
router.post(
    '/withdraw',
    authMiddleware,
    validate(walletValidation.withdraw),
    walletController.withdraw
);
router.get('/transactions', authMiddleware, walletController.getWalletTransactions);

module.exports = router;
