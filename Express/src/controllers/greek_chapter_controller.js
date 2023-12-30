const GreekChapter = require('../schemas/GreekChapter');
const GreekOrg = require('../schemas/GreekOrg');
const User = require('../schemas/User');

const createGreekChapter = async (req, res) => {
    try {
        const greekOrg = await GreekOrg.findById(req.body.greekOrgName);
        if (!greekOrg) return res.status(404).send('Greek Organization not found');

        const greekChapter = new GreekChapter({
            _id: req.body.greekChapterName,
            greekOrg: greekOrg._id,
        });

        const savedGreekChapter = await greekChapter.save();
        greekOrg.greekChapters.push(savedGreekChapter._id);

        res.status(201).send({ greekChapter: savedGreekChapter._id });
    } catch (err) {
        res.status(500).send(err);
    }
};

const getGreekChapter = async (req, res) => {
    try {
        const greekChapter = await GreekChapter.findById(req.body.name);
        if (!greekChapter) return res.status(404).send('Greek Chapter not found');

        res.json(greekChapter);
    } catch (err) {
        res.status(500).send(err);
    }
};

const deleteGreekChapter = async (req, res) => {
    try {
        const greekChapter = await GreekChapter.findByID(req.body.greekChapterName);
        if (!greekChapter) return res.status(404).send('Greek Chapter not found');

        const greekOrg = await GreekOrg.findById(greekChapter.greekOrg);
        if (!greekOrg) return res.status(404).send('Greek Organization not found');

        greekOrg.greekChapters.pop(greekChapter._id);
        await greekOrg.save();

        await greekChapter.remove();
        res.status(204).send();
    } catch (err) {
        res.status(500).send(err);
    }
};

const addGreekChapterPresident = async (req, res) => {
    try {
        const greekChapter = await GreekChapter.findById(req.body.greekChapterName);
        if (!greekChapter) return res.status(404).send('Greek Chapter not found');

        if (greekChapter.president) {
            const oldPresident = await User.findById(greekChapter.president);
            oldPresident.greekChapter = null;
            await oldPresident.save();
        }

        const president = await User.findOne({ username: req.body.president });
        if (!president) return res.status(404).send('User not found');

        greekChapter.president = president._id;
        await greekChapter.save();

        president.greekChapter = greekChapter._id;
        await president.save();

        res.json(greekChapter);
    } catch (err) {
        res.status(500).send(err);
    }
};

const addGreekChapterOfficers = async (req, res) => {
    try {
        const greekChapter = await GreekChapter.findById(req.body.greekChapterName);
        if (!greekChapter) return res.status(404).send('Greek Chapter not found');

        const officers = await User.find({ username: req.body.officers });
        if (!officers) return res.status(404).send('User not found');

        for (const officer of officers) {
            greekChapter.officers.push(officer._id);

            officer.greekChapter = greekChapter._id;
            await officer.save();
        }
        await greekChapter.save();

        res.json(greekChapter);
    } catch (err) {
        res.status(500).send(err);
    }
};

const removeGreekChapterOfficers = async (req, res) => {
    try {
        const greekChapter = await GreekChapter.findById(req.body.greekChapterName);
        if (!greekChapter) return res.status(404).send('Greek Chapter not found');

        const officers = await User.find({ username: req.body.officers });
        if (!officers) return res.status(404).send('User not found');

        for (const officer of officers) {
            greekChapter.officers.pop(officer._id);

            officer.greekChapter = null;
            await officer.save();
        }
        await greekChapter.save();

        res.json(greekChapter);
    } catch (err) {
        res.status(500).send(err);
    }
};

module.exports = {
    createGreekChapter,
    getGreekChapter,
    deleteGreekChapter,
    addGreekChapterPresident,
    addGreekChapterOfficers,
    removeGreekChapterOfficers,
};