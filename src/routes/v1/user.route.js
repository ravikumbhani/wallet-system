const express = require('express');
const userController = require('../../controllers/user.controller');
const authMiddleware = require('../../middlewares/auth');
const rbacMiddleware = require('../../middlewares/rbac');
const validate = require('../../middlewares/validate');
const userValidation = require('../../validations/user.validation');

const router = express.Router();

// User management routes (only accessible by authenticated users)
router.get('/profile', authMiddleware, userController.getProfile);
router.put(
    '/profile',
    authMiddleware,
    validate(userValidation.updateProfile),
    userController.updateProfile
);

// Admin/vendor management (only accessible by admin/vendor roles)
router.get('/', authMiddleware, rbacMiddleware('admin'), userController.getAllUsers);
router.get('/:userId', authMiddleware, rbacMiddleware('admin'), userController.getUserById);
router.delete('/:userId', authMiddleware, rbacMiddleware('admin'), userController.deleteUser);

module.exports = router;
