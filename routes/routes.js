/* Purpose: Connect controller function to routes to work
            as an api for React frontend */
const express = require('express');
const router = express.Router();

const userController = require('../controllers/userController');
const artifactController = require('../controllers/artifactController');
const apiController = require('../controllers/apiController');
const familyController = require('../controllers/familyController');

// Posting the login information from user
router.post('/login', userController.validateLogin);

// Log a user out
router.get('/logout', userController.requiresLogin, userController.logout);

// Posting the signup information from user
router.post('/signup', userController.validateSignup);

// Posting artifact information (image and descriptions of artifact)
//router.post('/postArtifact', userController.requiresLogin, artifactController.uploadImage, artifactController.postArtifact);
router.post('/postArtifact', artifactController.uploadImage, artifactController.postArtifact);

// Editing artifact information from user
router.post('/editArtifact', userController.requiresLogin, artifactController.editArtifact);

// Check whether the user is logged in or not
router.get('/api/validateLogin', apiController.validateLogin);

// Get artifacts of a user
router.get('/getArtifacts', userController.requiresLogin, userController.getUserArtifacts);

// Get artifact by Id
router.post('/getArtifactById', artifactController.getArtifactById);

// Get All artifacts
router.get('/getAllArtifacts', userController.requiresLogin, artifactController.getFamilyArtifacts);

// Create a family
router.post('/createFamily', userController.requiresLogin, familyController.createFamily);

// Invite a family member
router.post('/inviteFamily', userController.requiresLogin, familyController.inviteFamilyMember);

// Accept an invitation
router.post('/acceptFamily', userController.requiresLogin, familyController.acceptInvitation);

// Reject an invitation
router.post('/rejectFamily', userController.requiresLogin, familyController.rejectInvitation);

module.exports = router;
