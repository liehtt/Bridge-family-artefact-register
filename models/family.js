/* Family represents a family group that groups users with connections together.
    every member in the Family is able to view other member's posted artifacts */

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const FamilySchema = new Schema(
    {
        groupAvatar: {type: String, default: '/images/default_avatar.png'},
        groupName: { type: String, unique: true, required: true},
        members: [{ type: Schema.Types.ObjectId, ref: "User" }],
        owner: { type: Schema.Types.ObjectId, ref: "User" },
        description: { type: String, default: "none" },
        dateofEstablish: {type: Date, default: Date.now()}
    }
);

const Family = mongoose.model("Family", FamilySchema);
module.exports = Family;
