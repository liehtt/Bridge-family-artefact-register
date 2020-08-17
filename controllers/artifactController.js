/* Purpose: Backend functions for manipulating artifacts */
/* Functions: posting artifact,
              edit artifact,
              get all artifacts in a family,
              get an artifact by id */

const mongoose = require('mongoose');
const Artifact = mongoose.model('Artifact');
const User = mongoose.model('User');
const Family = mongoose.model('Family');

const path = require('path');
const multer = require('multer');
const cloudinary = require('cloudinary');
const cloudinaryStorage = require('multer-storage-cloudinary');

/* Set up cloudinary */
require('../configs/cloudinaryConfig')(cloudinary);

const DEBUG = true;

const storage = cloudinaryStorage({
    cloudinary: cloudinary,
    folder: 'artifacts',
    filename: function (req, file, cb) {
        cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
    }
})

/* Set up the third party package 'upload' */
const upload = multer({
    storage: storage,
    limits: {fileSize: 1024 * 1024 * 5},
    fileFilter: function (req, file, cb) {
        checkFileType(file, cb);
    }
}).single('artifactImage');

function checkFileType(file, cb) {
    const filetypes = /jpeg|jpg|png|gif|svg/;
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = filetypes.test(file.mimetype);

    if (mimetype && extname) {
        return cb(null, true);
    } else {
        cb(null, false);
    }
}

const uploadImage = function(req, res, next) {
    upload(req, res, function(err) {
        if (err) {
            res.send({
                msg: err
            });
        } else {
            if (req.file == undefined) {
                res.locals.msg = "nofile";
                next();
            } else {
                next();
            }
        }
    });
}

const getArtifactById = function(req, res) {
    Artifact.findById(req.body.id, function (err, data) {
        if(err) {
            console.log(err);
        } else {
            res.send(data);
        }
    })
}

/* Create a new artifact and updates the artifact field in user */
const postArtifact = function(req, res) {
    let newArtifact;
    let user;
    let view;
    if(req.body.viewBy) {
        view = req.body.viewBy.split(",");
    }
    let views = ([req.body.owner]).concat(view)

    if(res.locals.msg == "nofile") {
        newArtifact = new Artifact({
            // title: req.body.title,
            description: req.body.description,
            owner: req.body.owner,
            location: req.body.location,
            timeHappened: req.body.time,
            viewPermission: req.body.viewPermission,
            viewBy: views,
            anonymous: req.body.anonymous
        });
    } else {
        newArtifact = new Artifact({
            // title: req.body.title,
            description: req.body.description,
            image: req.file.url,
            owner: req.body.owner,
            location: req.body.location,
            timeHappened: req.body.time,
            viewPermission: req.body.viewPermission,
            viewBy: views,
            anonymous: req.body.anonymous
        });
    }

    newArtifact.save(function(err, newImage) {
        if(err) {
            res.send('error-saving');
        } else {
             User.findByIdAndUpdate(req.session.userID,
                 {$push: {artifacts: newImage}},
                 function(err, user) {
                     if(err) {
                         console.log(err);
                         throw err;
                     }
             });

             Artifact.findById(newImage._id)
                     .populate('owner')
                     .exec(function(err, artifact) {
                         if(err) {
                             console.log(err);
                         } else {
                             res.send(artifact);
                         }
                     })
        }
    })
}

/**
 * This function updates the description of the target family artifact based on
 * user's input.
 */
const editArtifact = function (req, res) {
    update = { $set: { description: req.body.text }};
    Artifact.findByIdAndUpdate(req.body.id, update, {new: true})
            .populate({
                path: 'comments',
                populate: {path: 'userID'}
            })
            .populate('owner')
            .exec(function(err, artifact) {
                if(err) {
                    console.log(err);
                } else {
                    res.send(artifact);
                }
            });
}

/* Get all the artifacts of the members from families user has joined */
const getFamilyArtifacts = function(req, res, next) {

    const id = mongoose.Types.ObjectId(req.session.userID);

    Family.find({members: id}, 'members', function(err, families) {
        if(err) {
            console.log(err);
            next(err);
        } else {
            var members = [];
            families.map(family => {
                members = members.concat(family.members);
            })

            var documentIds = members.map(e => {
                return mongoose.Types.ObjectId(e);
            });

            Artifact.find({owner: {$in: documentIds}})
                    .populate({
                        path: 'comments',
                        populate: {path: 'userID'}
                    })
                    .populate('owner')
                    .exec(function(err, artifacts) {
                if(err) {
                    console.log(err);
                } else {
                    res.send(artifacts);
                }
            });
        }
    })
}

/**
 * This function deletes the target family artifact and all the relationships
 * along with it.
 */

const deleteArtifact = function(req, res, next) {

    const artifactID = req.params.artifactID;
    const userID = req.session.userID;

    Artifact.findById(artifactID, (err, artifact) => {
        if (err) {
            console.log(err);
            next(err);
        }
        // Check whether the user who wants to perform the delete action is the
        // owner of the artifact.
        else {
            if (artifact.owner == userID) {
                User.update( {_id: req.session.userID}, { $pull: {artifacts: {id: artifactID } } } )
                //User.findByIdAndUpdate(req.session.userID, { $pullAll: { artifacts: [artifactID] } });
                Artifact.findByIdAndUpdate(artifactID, { $set: {owner: null}}, {new:true}, function(err, updatedArtifact) {
                    if (err) {
                        console.log(err);
                        next(err);
                    } else {
                        res.send({
                            msg: 'deleted'
                        });
                    }
                });
            } else {
                res.send({
                    msg:'not-owner'
                });
            }
        }
    });
}

const updateAccessLevel = function (req, res) {
    let view;
    console.log(req.body.viewBy);
    if(req.body.viewBy) {
        view = req.body.viewBy.split(",");
    }
    let views = ([req.body.owner]).concat(view)

    update = { $set: { viewPermission: req.body.viewPermission, viewBy:  views}};
    Artifact.findByIdAndUpdate(req.body.id, update, {new: true})
            .populate({
                path: 'comments',
                populate: {path: 'userID'}
            })
            .populate('owner')
            .exec(function(err, artifact) {
                if(err) {
                    console.log(err);
                } else {
                    res.send(artifact);
                }
            });
}

module.exports = {
    getFamilyArtifacts: getFamilyArtifacts,
    editArtifact: editArtifact,
    postArtifact: postArtifact,
    uploadImage: uploadImage,
    getArtifactById: getArtifactById,
    deleteArtifact: deleteArtifact,
    updateAccessLevel: updateAccessLevel,
}
