const mongoose = require('mongoose');

const calendarEventSchema = new mongoose.Schema({
    title: { type: String, required: true, min: 6, max: 255 },
    description: { type: String, required: true, min: 6, max: 255 },
    start: { type: Date, required: true },
    end: { type: Date, required: true },
});

const CalendarEvent = mongoose.model('CalendarEvent', calendarEventSchema);

const chapterMeetingSchema = new mongoose.Schema({
    attendance: { type: Number, default: 0 },
    present: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    absent: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
});

const ChapterMeeting = CalendarEvent.discriminator('ChapterMeeting', chapterMeetingSchema);

module.exports = {
    CalendarEvent,
    ChapterMeeting
};