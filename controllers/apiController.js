/* Purpose: Backend function to check if user is logged in */

const validateLogin = (req, res, next) => {
    let result = {isLoggedIn: false};
    let session = req.session;
    if (session && session.userID) {
        result.isLoggedIn = true;
        res.json({session, result});
    } else {
        res.json({result});
    }
}

module.exports = {
    validateLogin: validateLogin
}
