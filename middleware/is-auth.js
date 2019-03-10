// Middleware is used to interact with certain incoming requests
// and perform various functions and checks prior to accessing the
// database.

const jwt = require('jsonwebtoken')
module.exports = (req, res, next) => {
    const authHeader = req.get('Authorization');
    if (!authHeader) {
        req.isAuth = false; // no header then return
        return next();
    }
    const token = authHeader.split(' ')[1];
    if (!token || token === '') { // no token or token blank then return
        req.isAuth = false;
        return next()
    }
    let decodedToken;
    try { 
        decodedToken = jwt.verify(token, 'somesupersecretkey') // verify token with secret
    } catch (err) {
        req.isAuth = false
        return next()
    }
    req.isAuth = true;
    req.userId = decodedToken.userId;
    next()
}