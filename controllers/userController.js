/* Purpose: Backend functions for manipulating user's info */
/* Functions: upload user avatar,
              logout the user,
              validate the login of user,
              validate the signup of user,
              get user's id,
              get user's artifacts,
              update the user's general information,
              update the user's password */

const mongoose = require('mongoose');
const User = mongoose.model('User');
const Artifact = mongoose.model('Artifact');

const path = require('path');
const multer = require('multer');
const cloudinary = require('cloudinary');
const cloudinaryStorage = require('multer-storage-cloudinary');
const nodemailer = require('nodemailer');
const crypto = require('crypto');
const bcrypt = require('bcrypt');

// Set up the cloudinary
require('../configs/cloudinaryConfig')(cloudinary);

const storage = cloudinaryStorage({
    cloudinary: cloudinary,
    folder: 'userAvatars',
    filename: function (req, file, cb) {
        cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
    }
});

const upload = multer({
    storage: storage,
    limits: {fileSize: 1024 * 1024 * 5},
    fileFilter: function (req, file, cb) {
        checkFileType(file, cb);
    }
}).single('userAvatar');

// Only images for now
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

const uploadAvatar = (req, res, next) => {

    upload(req, res, function(err) {
        if (err) {
            res.send({
                msg: err
            })
        } else {
            if (req.file == undefined) {
                res.locals.msg = "nofile";
                next();
            } else {
                next();
            }
        }
    });
};

// Validate the user input against the database, and create a user session if
// the validatoin succeeds.
const validateLogin = (req, res, next) => {

    User.authenticate(req.body.email, req.body.password, (err, user) => {
        if (!err) {
            if (user) {
                req.session.userID = user._id;
                res.redirect('/');
            } else {
                res.redirect("back");
            }
        } else {
            return next(err);
        }
    });
}

// Validate the user input for register as a new user.
const validateSignup = (req, res, next) => {

    if (req.body.password !== req.body.confPwd) {
        res.send("Passwords do not match.");
    }

    const newUser = new User({
        email: req.body.email,
        password: req.body.password,
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        nickName: req.body.nickName,
        birthdate: req.body.birthdate
    });

    newUser.save((err, user) => {
        if (!err) {
            req.session.userID = user._id;
            res.redirect('/');
        } else {
            return next(err);
        }
    });
}

// Requires the user to login to proceed to the next function.
const requiresLogin = (req, res, next) => {
    if (req.session && req.session.userID) {
        next();
    } else {
        res.redirect("back");
    }
}

// Delete the session of a user and logs him out
const logout = (req, res, next) => {
    if (req.session) {
        req.session.destroy((err) => {
            if (err) {
                next(err);
            } else {
                res.status(200).json({
                    redirectUrl: "/"
                });
            }
        });
    }
}

// Fetch the user data based on ID.
const getUserByID = (req, res, next) => {
    User.findById(req.session.userID)
        .populate('invitations.receivedFrom')
        .exec(function(err, data) {
            if(err) {
                console.log(err)
            } else {
                res.send(data);
            }
        })
}

// Get all the artifacts posted by a user.
const getUserArtifacts = (req, res, next) => {

    Artifact.find({owner: req.session.userID})
            .populate('comments')
            .populate('owner')
            .exec(function(err, artifacts) {
                if(!err) {
                    //console.log(artifacts);
                    res.send(artifacts);
                } else {
                    res.send('error occured')
                }
            })
}

// Update the user
const updateUserInfo = (req, res) => {

    let firstName = undefined;
    let lastName = undefined;
    let nickName = undefined;
    let gender = undefined;
    let birthdate = undefined;
    let userAvatar = undefined;

    if (req.file && req.file.url) {
        userAvatar = req.file.url;
    }
    if (req.body.firstName) {
        firstName = req.body.firstName;
    }
    if (req.body.lastName) {
        lastName = req.body.lastName;
    }
    if (req.body.nickName) {
        nickName = req.body.nickName;
    }
    if (req.body.gender) {
        gender = req.body.gender;
    }
    if (req.body.birthdate) {
        birthdate = req.body.birthdate;
    }

    let update = {
        firstName: firstName,
        lastName: lastName,
        nickName: nickName,
        gender: gender,
        birthdate: birthdate,
        avatar: userAvatar
    };

    let options = {
        omitUndefined: true,
        useFindAndModify: false
    }

    User.findByIdAndUpdate(req.session.userID, update, options, (err, user) => {
        if (err) {
            throw err;
        } else {
            res.redirect('/profile');
        }
    });
}

// Update the user's account passwords
const updatePassword = (req, res) => {

    if (req.body.newPwd != req.body.confPwd) {
        res.redirect('back');
    }

    User.findById(req.session.userID, (err, user) => {
        if (err) {
            throw err;
        } else {
            User.authenticate(user.email, req.body.currPwd, (err, user) => {
                if (err) {
                    throw err;
                } else {
                    user.password = req.body.newPwd;

                    user.save((err, user) => {
                        if (err) {
                            throw err;
                        } else {
                            res.redirect('/profile');
                        }
                    });
                }
            });

        }
    });
}

const forgotPassword = (req, res) => {
    if(req.body.email === '') {
        res.send({message: 'email-required'});
    } else {
        User.find({email: req.body.email}, (err, data) => {
            if(err) {
                console.log(err);
            } else {
                if(data.length === 0) {
                    res.send({message: 'email-not-in-db'})
                } else {
                    const token = crypto.randomBytes(20).toString('hex');
                    let update = {$set: {resetPasswordToken: token, resetPasswordExpires: Date.now() + 360000}}
                    User.findOneAndUpdate({email: req.body.email}, update, {new: true}, function(err, data) {
                        if(err) {
                            console.log(err);
                        } else {
                            //console.log(data);
                        }
                    })

                    const transporter = nodemailer.createTransport({
                        service: 'gmail',
                        auth: {
                            user: 'teambridge2019@gmail.com',
                            pass: 'teambridge01!'
                        }
                    });

                    const mailOptions = {
                        from: 'teambridge2019@gmail.com',
                        to: `${req.body.email}`,
                        subject: `[RESET-PASSWORD: ${req.body.email}]`,
                        text: 'Click the link to reset your password \n\n' +
                              `http://localhost:3000/reset/${token}\n\n` +
                              `Thank you!`
                    };

                    transporter.sendMail(mailOptions, function(err, response) {
                        if(err) {
                            console.log(err);
                        } else {
                            res.send({message: 'recovery mail sent'});
                        }
                    });
                }
            }
        });
    }
}

const resetPassword = (req, res) => {
    console.log(req.body.token);
    User.find({resetPasswordToken: req.body.token, resetPasswordExpires: {$gt: Date.now()}}, function(err, data) {
        if(err) {
            console.log(err);
        } else {
            if(data.length === 0) {
                res.send({message: 'invalid or expired'});
            } else {
                res.send({user:data, message: 'link-ok'});
            }
        }
    })
}

const updatePasswordViaEmail = (req, res) => {

    User.findById(req.body.id, (err, user) => {
        if (err) {
            throw err;
        } else {
            bcrypt
                .hash(req.body.password, 10)
                .then(hashed => {
                    User.findByIdAndUpdate(req.body.id, {$set: {password: hashed, resetPasswordToken: '', resetPasswordExpires: null}}, {new: true}, function(err, data) {
                        res.send({message: 'password-updated'});
                    })
                })
        }
    });
}

module.exports = {
    validateLogin: validateLogin,
    validateSignup: validateSignup,
    requiresLogin: requiresLogin,
    getUserByID: getUserByID,
    getUserArtifacts: getUserArtifacts,
    updateUserInfo: updateUserInfo,
    logout: logout,
    uploadAvatar: uploadAvatar,
    updatePassword: updatePassword,
    forgotPassword: forgotPassword,
    resetPassword: resetPassword,
    updatePasswordViaEmail: updatePasswordViaEmail
}
