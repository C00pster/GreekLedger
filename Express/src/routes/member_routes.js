const express = require('express');
const router = express.Router();
const memberController = require('../controllers/member_controller');
const { body, validationResult } = require('express-validator');

router.post('/register', 
    [
        body('email', 'Invalid email address').isEmail(),
        body('password', 'Password must be at least 8 characters').isLength({ min: 8 })
    ],
    (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(422).send({ errors: errors.array() });
        }

        memberController.registerMember(req, res);
    }
);


module.exports = router;