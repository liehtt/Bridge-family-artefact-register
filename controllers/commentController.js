/**
 * This module contains all the backend logic for processing the data related
 * to comments
 */

const mongoose = require('mongoose');
const Artifact = mongoose.model('Artifact');
const Comment = mongoose.model('Comment');

const DEBUG = false;

// Create a comment according to user's post and add this comment to the
// artifact's comment list.

const commentArtifact = (req, res, next) => {

    let id = req.params.artifactID;

    let newComment = new Comment({
        "content": req.body.comment,
        "artifactID": id,
        "userID": req.session.userID
    });

    newComment.save(function(err, comment) {
        if(err) {
            next(err);
        } else {
            Artifact.findByIdAndUpdate(id,
                {$push: {comments: comment}},
                {new: true}
            )
            .populate({
                path: 'comments',
                populate: {path: 'userID'}
            })
            .populate('owner')
            .exec(function(err, data) {
                if(err) {
                    console.log(err);
                } else {
                    res.send(data);
                }
            })

        }
    })


};

module.exports = {
    commentArtifact: commentArtifact
}
