const mongoose = require('mongoose');

const chapterMeetingSchema = new mongoose.Schema({
    title: { type: String, required: true, min: 6, max: 255 },
    description: { type: String, required: true, min: 6, max: 255 },
    start: { type: Date, required: true },
    end: { type: Date, required: true },
    greekChapter: { type: String, ref: 'GreekChapter' },
    attendance: { type: Number, default: 0 },
    present: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    absent_excused: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    absent_unexcused: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
});

const ChapterMeeting = mongoose.model('ChapterMeeting', chapterMeetingSchema);

module.exports = {
    ChapterMeeting
};