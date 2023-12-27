const mongoose = require('mongoose');

const fraternitySchema = new mongoose.Schema({
    name: String,
    foundingYear: Number,
    members: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Member' }],
    member_cout: Number,
    president: { type: mongoose.Schema.Types.ObjectId, ref: 'Member' },
    officers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Member' }],
    officers_count: Number,
    address: String,
    city: String,
    state: String,
    zip: String,
    email: String,
});