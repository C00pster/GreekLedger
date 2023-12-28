const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    username: { type: String, required: true, min: 6, max: 255 },
    name: { type: String, required: true },
    email: { type: String, required: true },
    password: { type: String, required: true, min: 6, max: 1024 },
    role: {type: String, required: true },
    phone: {type: String, required: true },
    greekOrg: {type: String, required: true },
    greekChapter: {type: String, required: false },
});

const User = mongoose.model('User', userSchema);

module.exports = User;