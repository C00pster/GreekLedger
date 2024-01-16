const mongoose = require('mongoose');

const greekOrgSchema = new mongoose.Schema({
    _id: { type: String, required: true, min: 6, max: 255 },
    members: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    officers: [{
        _id: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
        name: String,
    }],
    president: {
        _id: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
        name: String,
    },
    greekChapters: [{ type: String, ref: 'GreekChapter' }],
});

const GreekOrg = mongoose.model('GreekOrg', greekOrgSchema);

module.exports = GreekOrg;