const Joi = require('joi');

const validateMeetingCreate = (req, res, next) => {
    const schema = Joi.object({
        title: Joi.string().min(1).required(),
        description: Joi.string().min(1).required(),
        start: Joi.date().required(),
        end: Joi.date().required(),
        greekChapter: Joi.string().min(1).required(),
    });

    const { error } = schema.validate(req.body);

    if (error) {
        res.status(400).send(error.details[0].message);
    } else {
        next();
    }
};

const validateMeetingUpdate = (req, res, next) => {
    const schema = Joi.object({
        eventId: Joi.string().min(1).required(),
        title: Joi.string().min(1).required(),
        description: Joi.string().min(1).required(),
        start: Joi.date().required(),
        end: Joi.date().required(),
    });

    const { error } = schema.validate(req.body);

    if (error) {
        res.status(400).send(error.details[0].message);
    } else {
        next();
    }
};

const validateMeetingDelete = (req, res, next) => {
    const schema = Joi.object({
        eventId: Joi.string().min(1).required(),
    });

    const { error } = schema.validate(req.body);

    if (error) {
        res.status(400).send(error.details[0].message);
    } else {
        next();
    }
};

const validateMeetingAttendance = (req, res, next) => {
    const schema = Joi.object({
        eventId: Joi.string().min(1).required(),
        present: Joi.array().items(Joi.string().min(1)).required(),
        absent_excused: Joi.array().items(Joi.string().min(1)).required(),
        absent_unexcused: Joi.array().items(Joi.string().min(1)).required(),
    });

    const { error } = schema.validate(req.body);

    if (error) {
        res.status(400).send(error.details[0].message);
    } else {
        next();
    }
};

module.exports = {
    validateMeetingCreate,
    validateMeetingUpdate,
    validateMeetingDelete,
    validateMeetingAttendance,
};