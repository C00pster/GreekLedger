// Managed in greek_chapter_routes.js

const GreekChapter = require('../schemas/GreekChapter');
const { Meeting } = require('../schemas/Meeting');

const createMeeting = async (req, res) => {
    try {
        const greekChapter = await GreekChapter.findById(req.body.greekChapter);
        if (!greekChapter) return res.status(404).send('Greek Chapter not found');

        const meeting = new Meeting({
            title: req.body.title,
            description: req.body.description,
            start: req.body.start,
            end: req.body.end,
            greekChapter: greekChapter._id
        });
        const savedMeeting = await meeting.save();

        greekChapter.meetings.push(savedMeeting._id);
        await greekChapter.save();

        res.status(201).json({ meeting: savedMeeting._id });
    } catch (err) {
        res.status(400).send("An error occurred");
        console.error(err);
    }
};

const getMeeting = async (req, res) => {
    try {
        const meeting = await Meeting.findById(req.query.id);
        if (!meeting) res.status(404).send('Chapter Meeting not found');

        if (meeting.greekChapter !== req.auth.greekChapter) {
            return res.status(403).send('Unauthorized to view this event');
        }

        res.json(meeting);
    } catch (err) {
        res.status(400).send("An error occurred");
    }
};

const updateMeeting = async (req, res) => {
    try {
        const meeting = await Meeting.findById(req.body.eventId);
        if (!meeting) return res.status(404).send('Chapter Meeting not found');
        if (meeting.greekChapter !== req.auth.greekChapter) {
            return res.status(403).send('Unauthorized to update this event');
        }

        const updatedEvent = await Meeting.findByIdAndUpdate(
            req.body.eventId,
            {
                title: req.body.title,
                description: req.body.description,
                start: req.body.start,
                end: req.body.end,
            },
            { new: true }
        );

        res.status(200).json({ _id: updatedEvent._id });
    } catch (err) {
        res.status(400).send("An error occurred");
        console.error(err);
    }
};

const deleteMeeting = async (req, res) => {
    try {
        const meeting = await Meeting.findById(req.body.eventId);
        if (!meeting) return resizeTo.status(404).send('Chapter Meeting not found');
        if (meeting.greekChapter !== req.auth.greekChapter) {
            return res.status(403).send('Unauthorized to delete this event');
        }

        await Meeting.findByIdAndDelete(req.body.eventId);

        res.status(200).send("Event deleted");
    } catch (err) {
        res.status(400).send("An error occurred");
    }
};

const takeAttendance = async (req, res) => {
    try {
        const meeting = await Meeting.findById(req.body.eventId);
        if (!meeting) return res.status(404).send('Chapter Meeting not found');

        if (meeting.greekChapter !== req.auth.greekChapter) {
            return res.status(403).send('Unauthorized to take attendance for this event');
        }

        const greekChapter = await GreekChapter.findById(meeting.greekChapter);
        if (!greekChapter) return res.status(404).send('Greek Chapter not found');

        if (greekChapter.members.length === 0) return res.status(400).send('No members to take attendance for');

        const { present, absent_unexcused, absent_excused } = req.body;
        const allMemberAttendanceIds = [...present, ...absent_excused, ...absent_unexcused];

        const allMemberIds = greekChapter.members.map(member => member._id.toString());
        const allMembersExist = allMemberAttendanceIds.every(memberId => allMemberIds.includes(memberId));
        if (!allMembersExist) return res.status(400).send('One or more members do not exist');

        const updatedEvent = await Meeting.findByIdAndUpdate(
            req.body.eventId,
            {
                $set: {
                    attendance: present.length, 
                    present: present,
                    absent_unexcused: absent_unexcused,
                    absent_excused: absent_excused,
                } 
            },
            { new: true }
        );

        res.status(201).json(updatedEvent);
    } catch (err) {
        res.status(400).send("An error occurred");
        console.error(err)
    }
};

module.exports = {
    createMeeting,
    takeAttendance,
    getMeeting,
    updateMeeting,
    deleteMeeting,
};