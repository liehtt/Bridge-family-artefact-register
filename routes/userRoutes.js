/**
 * This module defines the routes for handling user data.
 */

const express = require('express');
const router = express.Router();

const userController = require('../controllers/userController');
const familyController = require('../controllers/familyController');

// Fetch the user information
router.get('/', userController.requiresLogin, userController.getUserByID);

// Fetch all the families a user belongs to.
router.get('/families', userController.requiresLogin, familyController.getAllFamilies);

// Update the user personal information.
router.post('/updateUserInfo', userController.requiresLogin, userController.uploadAvatar, userController.updateUserInfo);

// Update the user's passwords
router.post('/updatePassword', userController.requiresLogin, userController.updatePassword);

// Check if email exists for resetting password
router.post('/forgotPassword', userController.forgotPassword);

router.post('/resetPassword', userController.resetPassword);

router.post('/updatePasswordViaEmail', userController.updatePasswordViaEmail);
module.exports = router;
