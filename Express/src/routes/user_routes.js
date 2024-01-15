const express = require('express');
const router = express.Router();
const {
    registerUser,
    loginUser,
    getProfile,
    updateProfile,
} = require('../controllers/user_controller');
const { checkAccess } = require('../middleware/auth_middleware');
const { validateUserRegistration, handleErrors } = require('../middleware/express_validator_middleware');

router.post('/register', validateUserRegistration, handleErrors, registerUser);

router.post('/login', loginUser);
router.get('/profile', getProfile);
router.put('/profile', updateProfile);

module.exports = router;