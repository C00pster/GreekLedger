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

        if (greekOrg.president) {
            const oldPresident = await User.findById(greekOrg.president);
            oldPresident.greekOrg = null;
            await oldPresident.save();
        }

        const president = await User.findOne({ username: req.body.president });
        if (!president) return res.status(404).send('User not found');

        greekOrg.president = president._id;
        await greekOrg.save();

        president.greekOrg = greekOrg._id;
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

        for (const officer of officers) {
            greekOrg.officers.push(officer._id);

            officer.greekOrg = greekOrg._id;
            await officer.save();
        }
        await greekOrg.save();

        res.json(greekOrg);
    } catch (err) {
        res.status(500).send(err);
    }
};

const removeGreekOrgOfficers = async (req, res) => {
    try {
        const greekOrg = await GreekOrg.findOne({ name: req.body.greekOrgName });
        if (!greekOrg) return res.status(404).send('Greek Organization not found');

        const officers = await User.find({ username: req.body.officers });
        if (!officers) return res.status(404).send('User not found');

        for (const officer of officers) {
            greekOrg.officers.pop(officer._id);
        }
        await greekOrg.save();
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