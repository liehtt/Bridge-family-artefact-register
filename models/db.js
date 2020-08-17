/* Purpose: Configuration file for mongodb database */

const mongoose = require('mongoose');

// Registering the models defined for the project.
require('./artifact');
require('./comment');
require('./family');
require('./user');

const dbURL = "mongodb+srv://admin:admin123456@main-oa5q5.mongodb.net/";

const options = {
    dbName: "Bridge",
    useNewUrlParser: true,
    useCreateIndex: true
};

// Connect to the database.
mongoose.connect(dbURL, options, function(err) {
    if (!err) {
        console.log("Connected to MongoDB.");
    } else {
        console.log("Failed to connect to MongoDB.");
    }
});

const db = mongoose.connection;

module.exports.db = db;
