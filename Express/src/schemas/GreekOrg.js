const mongoose = require('mongoose');

const greekOrgSchema = new mongoose.Schema({
    name: { type: String, required: true, min: 6, max: 255 },
    members: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    officers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    president: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    greekChapters: [{ type: mongoose.Schema.Types.ObjectId, ref: 'GreekChapter' }],
});

const GreekOrg = mongoose.model('GreekOrg', greekOrgSchema);

module.exports = GreekOrg;