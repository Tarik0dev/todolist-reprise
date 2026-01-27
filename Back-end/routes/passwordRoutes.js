const express = require('express');
const router = express.Router();
const forgotPasswordController = require('../controllers/forgotPasswordControllers');
const resetPasswordController = require('../controllers/resetPasswordController')

router.post('/reset-password', resetPasswordController.resetPassword)
router.post('/forgot-password', forgotPasswordController.forgotPassword)

module.exports = router;