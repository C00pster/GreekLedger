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
        const greekOrg = await GreekOrg.findById(req.body.greekOrgName);
        if (!greekOrg) return res.status(404).send('Greek Organization not found');

        const president = await User.findOne({ username: req.body.president });
        if (!president) return res.status(404).send('User not found');
        if (president.greekOrgRole !== "member" && president.greekChapterRole !== "member") return res.status(400).send('User is already an officer in a greek organization');

        if (greekOrg.president) {
            const oldPresident = await User.findById(greekOrg.president);
            oldPresident.greekOrgRole = "member";
            await oldPresident.save();
        }

        greekOrg.president = president._id;
        await greekOrg.save();

        president.greekOrg = greekOrg._id;
        president.greekOrgRole = "president";
        president.greekChapter = null;
        president.greekChapterRole = null;
        await president.save();

        res.json(greekOrg);
    } catch (err) {
        res.status(500).send(err);
    }
}

const addGreekOrgOfficers = async (req, res) => {
    try {
        const greekOrg = await GreekOrg.findById(req.body.greekOrgName);
        if (!greekOrg) return res.status(404).send('Greek Organization not found');

        const officers = await User.find({ username: req.body.officers });
        if (!officers) return res.status(404).send('User not found');

        const saveOfficerPromises = officers.map(officer => {
            if (officer.greekChapterRole !== "member") {
                if (officer.greekChapterRole === "president") return res.status(400).json({ message: officer.name + " is already the president of a greek chapter"});
                else return res.status(400).json({ message: officer.name + " is already an officer in a greek chapter"});
            } else if (officer.greekOrgRole !== "member") {
                if (officer.greekOrgRole === "president") return res.status(400).json({ message: officer.name + " is already the president of a greek organization"});
                else return res.status(400).json({ message: officer.name + " is already an officer in a greek organization"});
            }
            greekOrg.officers.push(officer._id);
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
    }
};

const removeGreekOrgOfficers = async (req, res) => {
    try {
        const greekOrg = await GreekOrg.findOne({ _id: req.body.greekOrgName });
        if (!greekOrg) return res.status(404).send('Greek Organization not found');

        const officers = await User.find({ username: { $in: req.body.officers } });
        if (!officers) return res.status(404).send('User not found');

        const officerIdsToRemove = new Set(officers.map(officer => officer._id.toString()));

        greekOrg.officers = greekOrg.officers.filter(officerId => !officerIdsToRemove.has(officerId.toString()));

        const updateOfficerPromises = officers.map(officer => {
            officer.greekOrgRole = "member";
            return officer.save();
        });

        await Promise.all(updateOfficerPromises);
        await greekOrg.save();

        res.status(200).send('Officers removed successfully');
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