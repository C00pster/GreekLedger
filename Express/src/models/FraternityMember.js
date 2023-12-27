const mongoose = require('mongoose');

const fraternityMemberSchema = new mongoose.Schema({
    member: { type: mongoose.Schema.Types.ObjectId, ref: 'Member' },
    fraternity: { type: mongoose.Schema.Types.ObjectId, ref: 'Fraternity' },
    position: String,
    join_date: Date,
    graduation_date: Date,
    status: String,
});

const FraternityMember = mongoose.model('FraternityMember', fraternityMemberSchema);

module.exports = FraternityMember;