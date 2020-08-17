const express = require('express');
const router = express.Router();

const userController = require('../controllers/userController');
const artifactController = require('../controllers/artifactController');

router.get('/deleteArtifact/:artifactID', artifactController.deleteArtifact);

router.post('/updateAccessLevel', artifactController.updateAccessLevel);

module.exports = router;
