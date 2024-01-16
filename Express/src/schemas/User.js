const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    username: { type: String, required: true, min: 6, max: 255, unique: true },
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true, min: 6, max: 1024 },
    admin: { type: Boolean, default: false },
    phone: {type: String, required: true },
    greekOrg: {type: String, required: false },
    greekOrgRole: {type: String, required: false },
    greekChapter: {type: String, required: false },
    greekChapterRole: {type: String, required: false },
});

const User = mongoose.model('User', userSchema);

module.exports = User;