const mongoose = require('mongoose');

const memberSchema = new mongoose.Schema({
    name: String,
    email: {type: String, unique: true, required: true},
    password: { type: String, required: true },
    phone_number: { type: String, required: true },
    fraternity: { type: mongoose.Schema.Types.ObjectId, ref: 'Fraternity' },
});

const Member = mongoose.model('Member', memberSchema);

module.exports = Member;