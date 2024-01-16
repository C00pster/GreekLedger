const Joi = require('joi');

const validateOrgCreate = (req, res, next) => {
    const schema = Joi.object({
        name: Joi.string().min(1).required(),
    });

    const { error } = schema.validate(req.body);

    if (error) {
        res.status(400).send(error.details[0].message);
    } else {
        next();
    }
};

const validateOrgPresident = (req, res, next) => {
    const schema = Joi.object({
        greekOrg: Joi.string().min(1).required(),
        president: Joi.string().min(1).required(),
    });

    const { error } = schema.validate(req.body);

    if (error) {
        res.status(400).send(error.details[0].message);
    } else {
        next();
    }
};

const validateOrgOfficer = (req, res, next) => {
    const schema = Joi.object({
        greekOrg: Joi.string().min(1).required(),
        officer: Joi.string().min(1).required(),
    });

    const { error } = schema.validate(req.body);

    if (error) {
        res.status(400).send(error.details[0].message);
    } else {
        next();
    }
};

module.exports = {
    validateOrgCreate,
    validateOrgPresident,
    validateOrgOfficer
};