const GreekChapter = require('../schemas/GreekChapter');
const { CalendarEvent } = require('../schemas/CalendarEvent');

const createCalendarEvent = async (req, res) => {
    try {
        const calendarEvent = new CalendarEvent({
            title: req.body.title,
            description: req.body.description,
            start: req.body.start,
            end: req.body.end,
        });

        const savedCalendarEvent = await calendarEvent.save();
        res.status(201).send({ calendarEvent: savedCalendarEvent._id });
    } catch (err) {
        res.status(400).send(err);
    }
};

const takeAttendance = async (req, res) => {
    try {
        const updatedEvent = await CalendarEvent.findByIdAndUpdate(
            req.body.eventId,
            { $set: { attendance: req.body.attendance, present: req.body.present, absent: req.body.absent } },
            { new: true }
        );

        if (updatedEvent) {
            res.status(404).send('Calendar Event not found');
        }

        res.status(201).send({ chapterMeeting: updatedEvent._id});
    } catch (err) {
        res.status(400).send(err);
    }
};

const getCalendarEvent = async (req, res) => {
    try {
        const calendarEvent = await CalendarEvent.findById(req.query.id);
        if (!calendarEvent) res.status(404).send('Calendar Event not found');

        res.json(calendarEvent);
    } catch (err) {
        res.status(400).send(err);
    }
};

const updateCalendarEvent = async (req, res) => {
    try {
        const updatedEvent = await CalendarEvent.findByIdAndUpdate(
            req.body.eventId,
            {
                title: req.body.title,
                description: req.body.description,
                start: req.body.start,
                end: req.body.end,
            },
            { new: true }
        );

        if (!updatedEvent) {
            return res.status(404).send('Calendar Event not found');
        }

        res.status(200).send(updatedEvent);
    } catch (err) {
        res.status(400).send(err);
    }
};

const deleteCalendarEvent = async (req, res) => {
    try {
        const deletedEvent = await CalendarEvent.findByIdAndDelete(req.body.eventId);
        if (!deletedEvent) {
            return res.status(404).send('Calendar Event not found');
        }

        res.status(200).send(deletedEvent);
    } catch (err) {
        res.status(400).send(err);
    }
};

module.exports = {
    createCalendarEvent,
    takeAttendance,
    getCalendarEvent,
    updateCalendarEvent,
    deleteCalendarEvent,
};