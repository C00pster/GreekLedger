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
        res.status(500).send("An error occurred");
        console.log(err);
    }
};

const getGreekChapter = async (req, res) => {
    try {
        const greekChapter = await GreekChapter.findById(req.query.greekChapter);
        if (!greekChapter) return res.status(404).send('Greek Chapter not found');

        res.json(greekChapter);
    } catch (err) {
        res.status(500).send("An error occurred");
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
        res.status(204);
    } catch (err) {
        res.status(500).send("An error occurred");
        console.log(err);
    }
};

const addGreekChapterPresident = async (req, res) => {
    try {
        const greekChapter = await GreekChapter.findById(req.body.greekChapter);
        if (!greekChapter) res.status(404).send('Greek Chapter not found');

        const president = await User.findOne({ username: req.body.president });
        if (!president) res.status(404).send('User not found');

        if (president.greekChapter !== greekChapter._id) return res.status(400).json({ message: president.name + " is not a member of this chapter"});
        if (president.greekChapterRole !== "member") return res.status(400).json({ message: president.name + " is not a standard member of this chapter"});

        if (greekChapter.president._id) {
            const oldPresident = await User.findById(greekChapter.president._id);
            oldPresident.greekChapterRole = "member";
            await oldPresident.save();
        }

        greekChapter.president._id = president._id;
        greekChapter.president.name = president.name;
        await greekChapter.save();

        president.greekChapter = greekChapter._id;
        president.greekChapterRole = "president";
        president.greekOrg = greekChapter.greekOrg;
        president.greekOrgRole = "member";
        await president.save();

        res.json(greekChapter);
    } catch (err) {
        res.status(500).send("An error occurred");
    }
};

const addGreekChapterOfficers = async (req, res) => {
    try {
        const greekChapter = await GreekChapter.findById(req.body.greekChapter);
        if (!greekChapter) return res.status(404).send('Greek Chapter not found');

        const officers = await User.find({ username: req.body.officers });
        if (officers.length == 0) return res.status(404).send('No user found');

        for (const officer of officers) {
            if (officer.greekChapter !== greekChapter._id) return res.status(400).json({ message: officer.name + " is not a member of this chapter"});
            if (officer.greekChapterRole !== "member") return res.status(400).json({ message: officer.name + " is not a standard member of this chapter"});
            if (officer.greekOrgRole !== "member") return res.status(400).json({ message: officer.name + " is already an officer of an organization"});

            greekChapter.officers.push({ _id: officer._id, name: officer.name });

            officer.greekChapter = greekChapter._id;
            officer.greekChapterRole = "officer";
            officer.greekOrg = greekChapter.greekOrg;
            officer.greekOrgRole = "member";
            await officer.save();
        }
        const savedGreekChapter = await greekChapter.save();

        res.json(savedGreekChapter);
    } catch (err) {
        res.status(500).send("An error occurred");
    }
};

const removeGreekChapterOfficers = async (req, res) => {
    try {
        const greekChapter = await GreekChapter.findById(req.body.greekChapter);
        if (!greekChapter) return res.status(404).send('Greek Chapter not found');

        const officers = await User.find({ username: req.body.officers });
        if (officers.length == 0) return res.status(404).send('No User found');

        const officerIdsToRemove = new Set(officers.map(officer => officer._id.toString()));

        const removedOfficers = new Set()

        greekChapter.officers = greekChapter.officers.filter(officer => {
            if (officerIdsToRemove.has(officer._id.toString())) {
                removedOfficers.add(officer);
                return false;
            } else return true;
        });

        const updateOfficerPromises = Array.from(removedOfficers).map(officer => {
            officer.greekChapterRole = "member";
            return officer.save();
        });

        await Promise.all(updateOfficerPromises);
        await greekChapter.save();

        res.status(204);
    } catch (err) {
        res.status(500).send("An error occurred");
    }
};

const addGreekChapterMembers = async (req, res) => {
    try {
        const greekChapter = await GreekChapter.findById(req.body.greekChapter);
        if (!greekChapter) return res.status(404).send('Greek Chapter not found');

        const members = await User.find({ username: req.body.members });
        if (members.length == 0) return res.status(404).send('No user found');

        for (const member of members) {
            if (member.greekChapter || member.greekChapterRole || member.greekOrg || member.greekOrgRole) 
                return res.status(400).json({ message: member.name + " is already a member of a chapter or organization"});
            greekChapter.members.push({ _id: member._id, name: member.name });

            member.greekChapter = greekChapter._id;
            member.greekChapterRole = "member";
            member.greekOrg = greekChapter.greekOrg;
            member.greekOrgRole = "member";
            await member.save();
        }
        const savedGreekChapter = await greekChapter.save();

        res.json(savedGreekChapter);
    } catch (err) {
        res.status(500).send("An error occurred");
    }
};

const removeGreekChapterMembers = async (req, res) => {
    try {
        const greekChapter = await GreekChapter.findById(req.body.greekChapter);
        if (!greekChapter) return res.status(404).send('Greek Chapter not found');

        const members = await User.find({ username: req.body.members });
        if (members.length == 0) return res.status(404).send('No User found');

        const memberIdsToRemove = new Set(members.map(member => member._id.toString()));

        const removedMembers = new Set()

        greekChapter.members = greekChapter.members.filter(member =>  {
            if (memberIdsToRemove.has(member._id.toString())) {
                removedMembers.add(member)
                return false;
            } else return true;
        });

        const updateMemberPromises = Array.from(removedMembers).map(member => {
            member.greekChapter = null;
            member.greekChapterRole = null;
            return member.save();
        });

        await Promise.all(updateMemberPromises);
        await greekChapter.save();

        res.status(204);
    } catch (err) {
        res.status(500).send("An error occurred");
    }
};

module.exports = {
    createGreekChapter,
    getGreekChapter,
    deleteGreekChapter,
    addGreekChapterPresident,
    addGreekChapterOfficers,
    removeGreekChapterOfficers,
    addGreekChapterMembers,
    removeGreekChapterMembers,
};