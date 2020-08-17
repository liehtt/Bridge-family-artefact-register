/* User represents the user of the website, storing all the information
    of the user */

const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const bcrypt = require('bcrypt');

const UserSchema = new mongoose.Schema(
    {
        email: {type: String, unique: true, required: true, trim: true},
        password: {type: String, required: true},
        firstName: {type: String},
        lastName: {type: String},
        nickName: {type: String},
        birthdate: {type: Date},
        gender: {type: String, default: "Not Specified"},
        avatar: {type: String, default: '/images/default_avatar.png'},
        artifacts: [{type: Schema.Types.ObjectId, ref: "Artifact"}],
        families: [{type: Schema.Types.ObjectId, ref: "Family"}],
        invitations: [{
            family: {type: Schema.Types.ObjectId, ref: "Family"},
            receivedFrom: {type: Schema.Types.ObjectId, ref: "User"},
            description: {type: String},
            groupName: {type:String},
            groupAvatar: {type:String},
            status: {type: String, default: "tbd"}
        }],
        resetPasswordToken: {type: String},
        resetPasswordExpires: {type: Date}
    }
);

// Hashing a password before saving it to the database
UserSchema.pre("save", function(next) {
    let user = this;
    bcrypt.hash(user.password, 10, (err, hash) => {
        if (err) {
            return next(err);
        } else {
            user.password = hash;
            next();
        }
    });
});

// Authenticate input against database.
UserSchema.statics.authenticate = (email, password, cb) => {
    User.findOne({email: email})
        .exec((err, user) => {
            if (err) {
                return cb(err);
            } else if (!user) {
                const err = new Error("User not found");
                err.status = 401;
                return cb(err);
            }
            bcrypt.compare(password, user.password, (err, result) => {
                if (result == true) {
                    return cb(null, user);
                } else {
                    return cb(err);
                }
            });
        });
};

// Add a customed validator to make sure email will be unique.
UserSchema.path("email").validate((value, done) => {
    User.countDocuments({ email: value }, (err, count) => {
        if (err) {
            return done(err);
        }
        if (count === 0) {
            return true;
        } else {
            return false;
        }
    });
}, "Email already registered.");

const User = mongoose.model("User", UserSchema);
module.exports = User;
