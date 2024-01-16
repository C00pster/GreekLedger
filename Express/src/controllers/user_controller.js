const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../schemas/User');

const registerUser = async (req, res) => {
    try {
        const hashedPassword = await bcrypt.hash(req.body.password, 10);
        const user = new User({
            username: req.body.username,
            name: req.body.name,
            email: req.body.email,
            password: hashedPassword,
            phone: req.body.phone,
            greekOrg: req.body.greekOrg,
            greekChapter: req.body.greekChapter,
        });
        
        const savedUser = await user.save();
        res.status(201).send({ user: savedUser._id });
    } catch (err) {
        res.status(400).send(err);
    }
};

const loginUser = async (req, res) => {
    if (!req.body.email || !req.body.password) {
        return res.status(400).send('Missing email or password');
    }
    const user = await User.findOne(req.body.email ? { email: req.body.email } : { username: req.body.username });
    if (user == null) {
        return res.status(400).send('Cannot find user');
    }

    try {
        if (await bcrypt.compare(req.body.password, user.password)) {
            const token = jwt.sign({ _id: user._id }, process.env.TOKEN_SECRET);
            res.header('Authorization', 'Bearer ' + token).send({token: token});
        } else {
            res.send('Invalid password');
        }
    } catch (err) {
        res.status(500).send(err);
    }
};

const getProfile = async (req, res) => {
    try {
        const authHeader = req.headers.authorization;
        if (!req.headers.authorization) return res.status(401).send('Access Denied');

        const token = authHeader.split(' ')[1];
        if (!token) return res.status(401).send('Access Denied');

        const verified = jwt.verify(token, process.env.TOKEN_SECRET);
        const user = await User.findById(verified._id);

        res.send({
            username: user.username,
            name: user.name,
            email: user.email,
            phone: user.phone,
            greekOrg: user.greekOrg,
            greekOrgRole: user.greekOrgRole,
            greekChapter: user.greekChapter,
            greekChapterRole: user.greekChapterRole,
        });
    } catch (err) {
        res.status(500);
    }
};

const updateProfile = async (req, res) => {
    try {
        const updatedUser = await User.findByIdAndUpdate(req.user._id, req.body, { new: true });
        if (!updatedUser) return res.status(404).send('User not found');
        res.json(updatedUser);
    } catch (err) {
        res.status(500).send(err);
    }
};

module.exports = {
    registerUser,
    loginUser,
    getProfile,
    updateProfile,
};