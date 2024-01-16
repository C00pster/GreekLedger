const express = require('express');
const router = express.Router();
const {
    registerUser,
    loginUser,
    getProfile,
    updateProfile,
} = require('../controllers/user_controller');
const {
    validateUserRegistration,
    validateUserLogin,
    validateUserUpdate,
} = require('../middleware/request_validation/user_request_validation');

router.post('/register', validateUserRegistration, registerUser);

router.post('/login', validateUserLogin, loginUser);
router.get('/profile', getProfile);
router.put('/profile', validateUserUpdate, updateProfile);

module.exports = router;