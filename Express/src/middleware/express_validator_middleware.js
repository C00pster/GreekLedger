const { body, validationResult } = require('express-validator')

const validateUserRegistration = [
    body('username', 'Username must be at least 6 characters').isLength({ min: 6 }),
    body('name', 'Name is required').not().isEmpty(),
    body('email', 'Invalid email address').isEmail(),
    body('password', 'Password must be at least 8 characters').isLength({ min: 8 }),
    body('phone', 'Phone number invalid').isMobilePhone(),
];

const handleErrors = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422).send({ errors: errors.array() });
    }
    next();
};

module.exports = {
    validateUserRegistration,
    handleErrors,
}