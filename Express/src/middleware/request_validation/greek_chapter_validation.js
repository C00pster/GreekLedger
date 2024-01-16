const Joi = require('joi');

const validateGreekChapterCreate = (req, res, next) => {
    const schema = Joi.object({
        greekOrg: Joi.string().min(1).required(),
        greekChapter: Joi.string().min(1).required(),
    });

    const { error } = schema.validate(req.body);

    if (error) {
        res.status(400).send(error.details[0].message);
    } else {
        next();
    }
};

const validateGreekChapterDelete = (req, res, next) => {
    const schema = Joi.object({
        greekChapter: Joi.string().min(1).required(),
    });

    const { error } = schema.validate(req.body);

    if (error) {
        res.status(400).send(error.details[0].message);
    } else {
        next();
    }
};

const validateGreekChapterPresident = (req, res, next) => {
    const schema = Joi.object({
        greekChapter: Joi.string().min(1).required(),
        president: Joi.string().min(1).required(),
    });

    const { error } = schema.validate(req.body);

    if (error) {
        res.status(400).send(error.details[0].message);
    } else {
        next();
    }
};

const validateGreekChapterMembers = (req, res, next) => {
    const schema = Joi.object({
        greekChapter: Joi.string().min(1).required(),
        members: Joi.array().items(Joi.string().min(1)).required(),
    });

    const { error } = schema.validate(req.body);

    if (error) {
        res.status(400).send(error.details[0].message);
    } else {
        next();
    }
};

module.exports = {
    validateGreekChapterCreate,
    validateGreekChapterDelete,
    validateGreekChapterPresident,
    validateGreekChapterMembers,
};