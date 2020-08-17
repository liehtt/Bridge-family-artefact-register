/* Purpose: Backend functions for manipulating family groups */
/* Functions: get all families information,
              create a family,
              send invitation to a user to join the family,
              accept the invitation,
              reject the invitation */

const mongoose = require('mongoose');
const Family = mongoose.model('Family');
const User = mongoose.model('User');

/* Get the families joined by user */
const getAllFamilies = (req, res , next) => {
    const userID = req.session.userID;
    User.findById(userID)
        .populate({
            path: 'families',
            populate: {path: 'members owner'}
        })
        .exec((err, user) => {
            if (err) {
                next(err);
            } else {
                if (user && user.families) {
                    res.json(user.families);
                }
            }
        });
};

/* Create a new family and update user's family field */
const createFamily = function(req, res) {

    let newFamily = new Family({
        groupName: req.body.groupName,
        owner: req.session.userID,
        description: req.body.description,
        members: [req.session.userID]
    })

    newFamily.save(function(err, data) {
        if(err) {
            res.send('error-saving');
        } else {
            User.findByIdAndUpdate(req.session.userID,
                {$push: {families: data}},
                {new: true},
                function(err, user) {
                    if(err) {
                        next(err)
                    }
            })
            res.send(data);
        }
    })
}

/* Create a new invitation object and update the
    invitations field of user to be invited  */
const inviteFamilyMember = (req, res, next) => {

    const invitation = {
                        family: req.body.family,
                        receivedFrom: req.session.userID,
                        description: req.body.description,
                        groupName: req.body.groupName,
                        groupAvatar: req.body.groupAvatar
                       }
    const update = {$push: { invitations: invitation }}

    Family.findById(req.body.family, function(err, family) {
        User.find({email: req.body.email}, function(err, data) {
            if(data.length === 0) {
                res.send({'status': 'not-found'});
            } else {
                if(family.members.includes(data[0]._id)) {
                    res.send({'status': 'already-in-family'})
                } else {
                    User.findOneAndUpdate({ email: req.body.email }, update, {new: true}, function(err, user) {
                        res.send({'status': 'invited'});
                    })
                }
            }
        })
    })
}

/* Update the status of invitation to indicate invitation is accepted */
const acceptInvitation = (req, res, next) => {

    const update = {$push: { families: req.body.family }, $set: { "invitations.$.status": req.body.newStatus }}
    User.findOneAndUpdate({_id: req.session.userID, 'invitations._id': req.body.id}, update, {new: true}, function(err, user) {
        if(err) {
            next(err);
        } else {
            Family.findByIdAndUpdate(req.body.family, {$push: {members: req.session.userID}}, {new: true}, function(err, family) {
                const data = {
                    user: user,
                    family: family
                }
                res.send(family);
            })
        }
    })
}

/* Update the status of invitation to indicate invitation is rejected */
const rejectInvitation = (req, res, next) => {

    const update = {$set: { "invitations.$.status": req.body.newStatus}}
    User.findOneAndUpdate({_id: req.session.userID, 'invitations._id': req.body.id}, update, {new: true}, function(err, user) {
        if(err) {
            next(err);
        } else {
            res.send('rejected');
        }
    })
}

module.exports = {
    getAllFamilies: getAllFamilies,
    createFamily: createFamily,
    inviteFamilyMember: inviteFamilyMember,
    acceptInvitation: acceptInvitation,
    rejectInvitation: rejectInvitation
}
