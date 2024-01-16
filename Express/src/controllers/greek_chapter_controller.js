const GreekChapter = require('../schemas/GreekChapter');
const GreekOrg = require('../schemas/GreekOrg');
const User = require('../schemas/User');

const createGreekChapter = async (req, res) => {
    try {
        const greekOrg = await GreekOrg.findById(req.body.greekOrg);
        if (!greekOrg) return res.status(404).send('Greek Organization not found');

        const orgAcronym = greekOrg._id.split(' ').map(word => word[0]).join('');
        const greekChapterName = orgAcronym + " " + req.body.greekChapter;

        const greekChapter = new GreekChapter({
            _id: greekChapterName,
            greekOrg: greekOrg._id,
        });

        const savedGreekChapter = await greekChapter.save();
        greekOrg.greekChapters.push(savedGreekChapter._id);

        res.status(201).send({ greekChapter: savedGreekChapter._id });
    } catch (err) {
        res.status(500).send(err);
        console.log(err);
    }
};

const getGreekChapter = async (req, res) => {
    try {
        const greekChapter = await GreekChapter.findById(req.query.greekChapter);
        if (!greekChapter) return res.status(404).send('Greek Chapter not found');

        res.json(greekChapter);
    } catch (err) {
        res.status(500).send(err);
    }
};

const deleteGreekChapter = async (req, res) => {
    try {
        const greekChapter = await GreekChapter.findById(req.body.greekChapter);
        if (!greekChapter) return res.status(404).send('Greek Chapter not found');

        const greekOrg = await GreekOrg.findById(greekChapter.greekOrg);
        if (!greekOrg) return res.status(404).send('Greek Organization not found');

        let index = greekOrg.greekChapters.indexOf(greekChapter._id);
        greekOrg.greekChapters.splice(index, 1);
        await greekOrg.save();

        await greekChapter.deleteOne();
        res.status(204).send("Greek Chapter deleted");
    } catch (err) {
        res.status(500).send(err);
        console.log(err);
    }
};

const addGreekChapterPresident = async (req, res) => {
    try {
        const greekChapter = await GreekChapter.findById(req.body.greekChapter);
        if (!greekChapter) res.status(404).send('Greek Chapter not found');

        const president = await User.findOne({ username: req.body.president });
        if (!president) res.status(404).send('User not found');

        if (president.greekChapterRole !== "member") {
            if (president.greekChapterRole === "president") res.status(400).send(String(president.name) + " is already the president of a greek chapter");
            else res.status(400).send(String(president.name) + " is already an officer in a greek chapter");
        } else if (president.greekOrgRole !== "member") {
            if (president.greekOrgRole === "president") res.status(400).send(String(president.name) + " is already the president of a greek organization");
            else res.status(400).send(String(president.name) + " is already an officer in a greek organization");
        }

        if (greekChapter.president) {
            const oldPresident = await User.findById(greekChapter.president);
            oldPresident.greekChapterRole = "member";
            await oldPresident.save();
        }

        greekChapter.president = president._id;
        await greekChapter.save();

        president.greekChapter = greekChapter._id;
        president.greekChapterRole = "president";
        president.greekOrg = greekChapter.greekOrg;
        president.greekOrgRole = "member";
        await president.save();

        res.json(greekChapter);
    } catch (err) {
        res.status(500).send(err);
    }
};

const addGreekChapterOfficers = async (req, res) => {
    try {
        const greekChapter = await GreekChapter.findById(req.body.greekChapter);
        if (!greekChapter) return res.status(404).send('Greek Chapter not found');

        const officers = await User.find({ username: req.body.officers });
        if (!officers) return res.status(404).send('User not found');

        for (const officer of officers) {
            if (officer.greekChapterRole !== "member") {
                if (officer.greekChapterRole === "president") return res.status(400).send(String(officer.name) + " is already the president of a greek chapter");
                else return res.status(400).send(String(officer.name) + " is already an officer in a greek chapter");
            } else if (officer.greekOrgRole !== "member") {
                if (officer.greekOrgRole === "president") return res.status(400).send(String(officer.name) + " is already the president of a greek organization");
                else return res.status(400).send(String(officer.name) + " is already an officer in a greek organization");
            }
            greekChapter.officers.push(officer._id);

            officer.greekChapter = greekChapter._id;
            officer.greekChapterRole = "officer";
            officer.greekOrg = greekChapter.greekOrg;
            officer.greekOrgRole = "member";
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
            let index = greekChapter.officers.indexOf(officer._id);
            greekChapter.officers.splice(index, 1);

            officer.greekChapterRole = "member";
            await officer.save();
        }
        await greekChapter.save();

        res.status(204).send("Greek Chapter Deleted");
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