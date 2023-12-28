const express = require('express');
const router = express.Router();
const userController = require('../controllers/user_controller');
const { body, validationResult } = require('express-validator');

router.post('/register', 
    [
        body('username', 'Username must be at least 6 characters').isLength({ min: 6 }),
        body('name', 'Name is required').not().isEmpty(),
        body('email', 'Invalid email address').isEmail(),
        body('password', 'Password must be at least 8 characters').isLength({ min: 8 }),
        body('phone', 'Phone number invalid').isMobilePhone(),
    ],
    (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(422).send({ errors: errors.array() });
        }

        userController.registerUser(req, res);
    }
);

router.post('/login', userController.loginUser);
router.get('/profile', userController.getProfile);
router.put('/profile', userController.updateProfile);

module.exports = router;