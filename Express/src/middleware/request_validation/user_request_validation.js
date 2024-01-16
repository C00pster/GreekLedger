const Joi = require('joi');

const validateUserRegistration = (req, res, next) => {
    const schema = Joi.object({
        username: Joi.string().min(6).required(),
        name: Joi.string().min(1).required(),
        email: Joi.string().min(6).required().email(),
        password: Joi.string().min(8).required(),
        phone: Joi.string().min(10).required(),
        greekOrg: Joi.string().min(1),
        greekChapter: Joi.string().min(1),
    });

    const { error } = schema.validate(req.body);

    if (error) {
        res.status(400).send(error.details[0].message);
    } else {
        next();
    }
};

const validateUserLogin = (req, res, next) => {
    const schema = Joi.object({
        email: Joi.string().required().email(),
        password: Joi.string().required(),
    });

    const { error } = schema.validate(req.body);

    if (error) {
        res.status(400).send(error.details[0].message);
    } else {
        next();
    }
};

const validateUserUpdate = (req, res, next) => {
    const schema = Joi.object({
        username: Joi.string().min(6),
        name: Joi.string().min(1),
        email: Joi.string().min(6).email(),
        password: Joi.string().min(8),
        phone: Joi.string().min(10),
        greekOrg: Joi.string().min(1),
        greekChapter: Joi.string().min(1),
    });

    const { error } = schema.validate(req.body);

    if (error) {
        res.status(400).send(error.details[0].message);
    } else {
        next();
    }
};

module.exports = {
    validateUserRegistration,
    validateUserLogin,
    validateUserUpdate,
};