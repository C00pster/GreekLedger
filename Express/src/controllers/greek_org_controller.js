const GreekOrg = require('../schemas/GreekOrg');
const User = require('../schemas/User');

const createGreekOrg = async (req, res) => {
    try {
        const greekOrg = new GreekOrg({
            _id: req.body.name
        });

        const savedGreekOrg = await greekOrg.save();
        res.status(201).send({ greekOrg: savedGreekOrg._id });
    } catch (err) {
        res.status(400).send(err);
    }
};

const getGreekOrg = async (req, res) => {
    try {
        const greekOrg = await GreekOrg.findById(req.query.name);
        if (!greekOrg) return res.status(404).send('Greek Organization not found');
        res.json(greekOrg);
    } catch (err) {
        res.status(500).send(err);
    }
};

const addGreekOrgPresident = async (req, res) => {
    try {
        const greekOrg = await GreekOrg.findById(req.body.greekOrg);
        if (!greekOrg) return res.status(404).send('Greek Organization not found');

        const president = await User.findOne({ username: req.body.president });
        if (!president) return res.status(404).send('User not found');

        if (president.greekChapterRole === "president") return res.status(400).json({ message: president.name + " is already the president of a greek chapter"});
        if (president.greekChapterRole === "officer")  return res.status(400).json({ message: president.name + " is already an officer in a greek chapter"});
        if (president.greekOrgRole === "president") return res.status(400).json({ message: president.name + " is already the president of a greek organization"});
        if (president.greekOrgRole === "officer") return res.status(400).json({ message: president.name + " is already an officer in a greek organization"});

        if (greekOrg.president._id) {
            const oldPresident = await User.findById(greekOrg.president._id);
            oldPresident.greekOrgRole = "member";
            await oldPresident.save();
        }

        greekOrg.president._id = president._id;
        greekOrg.president.name = president.name;
        await greekOrg.save();

        president.greekOrg = greekOrg._id;
        president.greekOrgRole = "president";
        president.greekChapter = null;
        president.greekChapterRole = null;
        await president.save();

        res.json(greekOrg);
    } catch (err) {
        res.status(500).send(err);
        console.log(err)
    }
}

const addGreekOrgOfficers = async (req, res) => {
    try {
        const greekOrg = await GreekOrg.findById(req.body.greekOrg);
        if (!greekOrg) return res.status(404).send('Greek Organization not found');

        const officers = await User.find({ username: req.body.officers });
        if (officers.length == 0) return res.status(404).send('No user found');

        const saveOfficerPromises = officers.map(officer => {
            if (officer.greekChapterRole === "president") return res.status(400).json({ message: officer.name + " is already the president of a greek chapter"});
            if (officer.greekChapterRole === "officer")  return res.status(400).json({ message: officer.name + " is already an officer in a greek chapter"});
            if (officer.greekOrgRole === "president") return res.status(400).json({ message: officer.name + " is already the president of a greek organization"});
            if (officer.greekOrgRole === "officer") return res.status(400).json({ message: officer.name + " is already an officer in a greek organization"});
            greekOrg.officers.push({ _id: officer._id, name: officer.name });

            officer.greekOrg = greekOrg._id;
            officer.greekOrgRole = "officer";
            officer.greekChapter = null;
            officer.greekChapterRole = null;
            return officer.save();
        });

        await Promise.all(saveOfficerPromises);
        await greekOrg.save();

        res.json(greekOrg);
    } catch (err) {
        res.status(500).send(err);
        console.log(err);
    }
};

const removeGreekOrgOfficers = async (req, res) => {
    try {
        const greekOrg = await GreekOrg.findOne({ _id: req.body.greekOrg });
        if (!greekOrg) return res.status(404).send('Greek Organization not found');

        const officers = await User.find({ username: { $in: req.body.officers } });
        if (!officers) return res.status(404).send('User not found');

        const officerIdsToRemove = new Set(officers.map(officer => officer._id.toString()));

        greekOrg.officers = greekOrg.officers.filter(officer => !officerIdsToRemove.has(officer._id.toString()));

        const updateOfficerPromises = officers.map(officer => {
            officer.greekOrgRole = "member";
            return officer.save();
        });

        await Promise.all(updateOfficerPromises);
        await greekOrg.save();

        res.status(204).send('Greek Chapter Officers Removed');
    } catch (err) {
        res.status(500).send(err);
    }
};

module.exports = {
    createGreekOrg,
    getGreekOrg,
    addGreekOrgPresident,
    addGreekOrgOfficers,
    removeGreekOrgOfficers,
};