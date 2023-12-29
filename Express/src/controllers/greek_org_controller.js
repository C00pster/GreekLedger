const GreekOrg = require('../schemas/GreekOrg');
const User = require('../schemas/User');

const createGreekOrg = async (req, res) => {
    try {
        const greekOrg = new GreekOrg({
            name: req.query.name
        });

        const savedGreekOrg = await greekOrg.save();
        res.status(201).send({ greekOrg: savedGreekOrg._id });
    } catch (err) {
        res.status(400).send(err);
    }
};

const getGreekOrg = async (req, res) => {
    try {
        const greekOrg = await GreekOrg.find(req.body.name);
        if (!greekOrg) return res.status(404).send('Greek Organization not found');
        res.json(greekOrg);
    } catch (err) {
        res.status(500).send(err);
    }
};

const addGreekOrgPresident = async (req, res) => {
    try {
        console.log(req.body)
        const greekOrg = await GreekOrg.findOne({ name: req.body.greekOrgName });
        if (!greekOrg) return res.status(404).send('Greek Organization not found');

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

module.exports = {
    createGreekOrg,
    getGreekOrg,
    addGreekOrgPresident
};