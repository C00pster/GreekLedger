const mongoose = require('mongoose');

const greekChapterSchema = new mongoose.Schema({
    _id: { type: String, required: true, min: 6, max: 255 },
    members: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    officers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    president: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    greekOrg: { type: mongoose.Schema.Types.ObjectId, ref: 'GreekOrg' },
});

const GreekChapter = mongoose.model('GreekChapter', greekChapterSchema);

module.exports = GreekChapter;