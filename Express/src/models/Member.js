const mongoose = require('mongoose');

const memberSchema = new mongoose.Schema({
    name: String,
    email: {type: String, unique: true, required: true},
    password: { type: String, required: true },
});

const Member = mongoose.model('Member', memberSchema);

module.exports = Member;