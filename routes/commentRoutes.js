/**
 * This module defines the routes for handling comments
 */

const express = require('express');
const router = express.Router();

const commentController = require('../controllers/commentController');
const userController = require('../controllers/userController');

// Post a comment about a family artifact.
//router.post('/commentArtifact/:artifactID', userController.requiresLogin, commentController.commentArtifact);
router.post('/commentArtifact/:artifactID', commentController.commentArtifact);
module.exports = router;
