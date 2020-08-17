/* Server file */

const express = require('express');
const bodyparser = require('body-parser');
const path = require ('path');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const MongoStore = require('connect-mongo')(session);

const app = express();

// Database set up
const db = require("./models/db");

// Setting up the bodyparser, so the body of the request can be parsed as JSON
// object.
app.use(bodyparser.json());
app.use(bodyparser.urlencoded({ extended: true }));

// Middlewares
app.use(express.static(path.join(__dirname, 'client/build')));
app.use(express.static(path.join(__dirname, 'client/public')));

// Setting up the configuration of the user session.
app.use(cookieParser());
app.use(session({
    secret: "bridge",
    cookie: { maxAge: 12 * 3600 * 1000 },
    resave: true,
    saveUninitialized: false,
    store: new MongoStore({ mongooseConnection: db.db })
}));

// Routes set up
const routes = require('./routes/routes');
const commentRoutes = require('./routes/commentRoutes');
const userRoutes = require('./routes/userRoutes');
const artifactRoutes = require('./routes/artifactRoutes');

app.use('/', routes);
app.use('/comment', commentRoutes);
app.use('/user', userRoutes);
app.use('/artifact', artifactRoutes);

// To make sure the react dynamic routes can work properly.
app.get('*', (request, response) => {
	response.sendFile(path.join(__dirname, 'client/build', 'index.html'));
});

// Port set up
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Express serving at port ${PORT}`);
});

module.exports = app;
