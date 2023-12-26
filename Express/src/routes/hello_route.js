const express = require('express');
const router = express.Router();
const memberController = require('../controllers/member_controller');

router.get('', (req, res) => {
    res.send('Hello World');
});


module.exports = router;