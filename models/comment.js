/* Comment is the model for the comments made on artifacts, for every comment,
    we will know who made the comment, and on which artifact the comment is
    made on */

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const CommentSchema = new Schema(
    {
        content: {type: String},
        artifactID: {type: Schema.Types.ObjectId, ref: "Artifact"},
        userID: {type: Schema.Types.ObjectId, ref: "User"}
    }
);

const Comment = mongoose.model("Comment", CommentSchema);
module.exports = Comment;
