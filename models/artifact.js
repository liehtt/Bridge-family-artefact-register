/* Artifact is the model that represents the information of family's
    artifact in the form of post. There is title and description for the artifact
    and people can comment or like the artifacts. Artifacts can also be images
    instead of just text. */

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const User = require('./user');
const Comment = require('./comment');

const ArtifactSchema = new Schema(
    {
        title: {type: String},
        description: {type: String},
        image: [{type: String}],
        timeHappened: {type: Date, default: Date.now()},
        timePosted: {type: Date, default: Date.now()},
        comments: [{type: Schema.Types.ObjectId, ref: "Comment"}],
        viewPermission: {type: String, default: "all"},
        viewBy: [{type: Schema.Types.ObjectId}],
        owner: {type: Schema.Types.ObjectId, ref: "User"},
        location: {type: String},
        likes: {type: Number, default: 0},
        anonymous: {type: String, default: 'false'}
    }
);

/**
 * Remove the references from user and delete the associated comments after
 * this artifact is deleted.
 */
ArtifactSchema.post(/Delete$/, function(artifact, next) {
    // Define the filter to find the owner of the artifacts
    const userFilter = {artifacts: {$elemMatch: artifact._id}};

    // Define the updates to the user.
    const userUpdate = {$pullAll: {artifacts: [artifact._id]}};

    User.update(userFilter, userUpdate);

    Comment.deleteMany({_id: {$in: artifact.comments}}, function(err) {
        if (err) {
            next(err);
        }
    });
});

const Artifact = mongoose.model("Artifact", ArtifactSchema);
module.exports = Artifact;
