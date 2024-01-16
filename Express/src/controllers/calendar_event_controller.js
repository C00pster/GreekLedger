// Managed in greek_chapter_routes.js

const GreekChapter = require('../schemas/GreekChapter');
const { ChapterMeeting } = require('../schemas/ChapterMeeting');

const createChapterMeeting = async (req, res) => {
    try {
        const greekChapter = await GreekChapter.findById(req.body.greekChapter);
        if (!greekChapter) return res.status(404).send('Greek Chapter not found');

        const chapterMeeting = new ChapterMeeting({
            title: req.body.title,
            description: req.body.description,
            start: req.body.start,
            end: req.body.end,
            greekChapter: greekChapter._id
        });
        const savedChapterMeeting = await chapterMeeting.save();

        greekChapter.chapterMeetings.push(savedChapterMeeting._id);
        await greekChapter.save();

        res.status(201).json({ chapterMeeting: savedChapterMeeting._id });
    } catch (err) {
        res.status(400).send("An error occurred");
        console.error(err);
    }
};

const takeAttendance = async (req, res) => {
    try {
        const chapterMeeting = await ChapterMeeting.findById(req.body.eventId);
        if (!chapterMeeting) return res.status(404).send('Chapter Meeting not found');

        if (chapterMeeting.greekChapter !== req.auth.greekChapter) {
            return res.status(403).send('Unauthorized to take attendance for this event');
        }

        const greekChapter = await GreekChapter.findById(chapterMeeting.greekChapter);
        if (!greekChapter) return res.status(404).send('Greek Chapter not found');

        if (greekChapter.members.length === 0) return res.status(400).send('No members to take attendance for');

        const { present, absent_unexcused, absent_excused } = req.body;
        const allMemberAttendanceIds = [...present, ...absent_excused, ...absent_unexcused];

        const allMemberIds = greekChapter.members.map(member => member._id.toString());
        const allMembersExist = allMemberAttendanceIds.every(memberId => allMemberIds.includes(memberId));
        if (!allMembersExist) return res.status(400).send('One or more members do not exist');

        const updatedEvent = await ChapterMeeting.findByIdAndUpdate(
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

const getChapterMeeting = async (req, res) => {
    try {
        const chapterMeeting = await ChapterMeeting.findById(req.query.id);
        if (!chapterMeeting) res.status(404).send('Chapter Meeting not found');

        if (chapterMeeting.greekChapter !== req.auth.greekChapter) {
            return res.status(403).send('Unauthorized to view this event');
        }

        res.json(chapterMeeting);
    } catch (err) {
        res.status(400).send("An error occurred");
    }
};

const updateChapterMeeting = async (req, res) => {
    try {
        const chapterMeeting = await ChapterMeeting.findById(req.body.eventId);
        if (!chapterMeeting) return res.status(404).send('Chapter Meeting not found');
        if (chapterMeeting.greekChapter !== req.auth.greekChapter) {
            return res.status(403).send('Unauthorized to update this event');
        }

        const updatedEvent = await ChapterMeeting.findByIdAndUpdate(
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

const deleteChapterMeeting = async (req, res) => {
    try {
        const chapterMeeting = await ChapterMeeting.findById(req.body.eventId);
        if (!chapterMeeting) return resizeTo.status(404).send('Chapter Meeting not found');
        if (chapterMeeting.greekChapter !== req.auth.greekChapter) {
            return res.status(403).send('Unauthorized to delete this event');
        }

        const deletedEvent = await ChapterMeeting.findByIdAndDelete(req.body.eventId);

        res.status(200).send("Event deleted");
    } catch (err) {
        res.status(400).send("An error occurred");
    }
};

module.exports = {
    createChapterMeeting,
    takeAttendance,
    getChapterMeeting,
    updateChapterMeeting,
    deleteChapterMeeting,
};