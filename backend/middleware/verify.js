const jwt = require('jsonwebtoken');
const models = require('../config/database');
require('dotenv').config();

const userVerifyToken = async (req, res, next) => {
    if( !req.headers.authorization ) {
        return res.status(403).send("Authentication is required")
    }
    
    const token = req.headers.authorization.split(/\s+/).pop();
    if (!token) {
        return res.status(403).send("Authentication is required")
    }
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        if (req.user.role !== 'user') {
            return res.status(402).send('Permission Denied!')
        }
    } catch (err) {
        return res.status(401).send("Invalid Token");
    }
    return next()
}

const adminVerifyToken = async (req, res, next) => {
    const token = req.body.token || req.query.token || req.headers['x-access-token'];
    if (!token) {
        return res.status(403).send("Authentication is required")
    }
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await findbyToken(token)
        req.user = decoded;
        if (req.user.role !== 'admin' && user ) {
            return res.status(403).send('Permission Denied!')
        }
    } catch (err) {
        return res.status(401).send("Invalid Token");
    }
    return next()
}

const findbyToken = async (token) => {
    try {
        return await models.users.findOne({
            where: { token: token}
        });
    }
    catch(err) {
        return null;
    }
    
}

module.exports = {
    userVerifyToken, 
    adminVerifyToken
};