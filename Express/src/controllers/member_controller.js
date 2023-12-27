const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const Member = require('../models/Admin');

const registerMember = async (req, res) => {
    try {
        const hashedPassword = await bcrypt.hash(req.body.password, 10);
        const member = new Member({
            name: req.body.name,
            email: req.body.email,
            password: hashedPassword,
        });
        
        const savedMember = await member.save();
        res.status(201).send({ member: savedMember._id });
    } catch (err) {
        res.status(400).send(err);
    }
};

const loginMember = async (req, res) => {
    const member = await Member.findOne({ email: req.body.email });
    if (member == null) {
        return res.status(400).send('Cannot find member');
    }

    try {
        if (await bcrypt.compare(req.body.password, member.password)) {
            const token = jwt.sign({ _id: member._id }, process.env.TOKEN_SECRET);
            res.header('auth-token', token).send(token);
        } else {
            res.send('Not Allowed');
        }
    } catch (err) {
        res.status(500).send(err);
    }
};

module.exports = {
    registerMember,
    loginMember
};