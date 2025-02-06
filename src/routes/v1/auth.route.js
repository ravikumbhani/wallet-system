const express = require('express');
const authController = require('../../controllers/auth.controller');
const validate = require('../../middlewares/validate');
const authValidation = require('../../validations/auth.validation');
const authMiddleware = require('../../middlewares/auth');

const router = express.Router();

// User authentication routes
router.post('/register', validate(authValidation.register), authController.register);
router.post('/login', validate(authValidation.login), authController.login);
router.post('/refresh-token', authController.refreshTokens);
router.post('/logout', authMiddleware, authController.logout);

module.exports = router;
