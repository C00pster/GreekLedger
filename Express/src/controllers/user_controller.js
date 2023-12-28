const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const registerUser = async (req, res) => {
    try {
        const hashedPassword = await bcrypt.hash(req.body.password, 10);
        const user = new User({
            username: req.body.username,
            name: req.body.name,
            email: req.body.email,
            password: hashedPassword,
            role: req.body.role,
            phone: req.body.phone,
            greekOrg: req.body.greekOrg,
            greekChapter: req.body.greekChapter ? req.body.greekChapter : null,
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
            res.header('auth-token', token).send("Logged in");
        } else {
            res.send('Not Allowed');
        }
    } catch (err) {
        res.status(500).send(err);
    }
};

const getProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user._id);
        if (!user) return res.status(404).send('User not found');
        res.json(user);
    } catch (err) {
        res.status(500).send(err);
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