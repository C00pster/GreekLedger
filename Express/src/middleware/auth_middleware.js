const jwt = require('jsonwebtoken');
const User = require('../schemas/User');

const getToken = (req) => {
    const authHeader = req.headers.authorization;
    if (!authHeader) return null;

    const token = authHeader.split(' ')[1];
    if (!token) return null;

    return token;
}

// All users can access these routes
const auth = async (req, res, next) => {
    token = getToken(req);
    if (!token) return res.status(401).send('Access Denied');

    try {
        const verified = jwt.verify(token, process.env.TOKEN_SECRET);
        req.user = verified;
        next();
    } catch (error) {
        res.status(400).send('Invalid Token');
    }
};

// Only admins can access these routes
const adminAuth = async (req, res, next) => {
    token = getToken(req);
    if (!token) return res.status(401).send('Access Denied');

    try {
        const verified = jwt.verify(token, process.env.TOKEN_SECRET);
        const member = await User.findById(verified._id);
        if (member.role !== 'admin') {
            return res.status(403).send('Access Denied');
        }
        next();
    } catch (error) {
        res.status(400).send('Invalid Token');
    }
};

module.exports = {
    auth,
    adminAuth,
};