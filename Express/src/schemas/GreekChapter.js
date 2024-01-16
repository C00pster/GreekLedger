const mongoose = require('mongoose');

const greekChapterSchema = new mongoose.Schema({
    _id: { type: String, required: true, min: 6, max: 255 },
    members: [{ 
        _id: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
        name: String,
    }],
    officers: [{ 
        _id: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
        name: String,
    }],
    president: {
        _id: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
        name: String,
    },
    greekOrg: { type: String, ref: 'GreekOrg' },
    calendarEvents: [{ type: mongoose.Schema.Types.ObjectId, ref: 'CalendarEvent' }],
});

const GreekChapter = mongoose.model('GreekChapter', greekChapterSchema);

module.exports = GreekChapter;