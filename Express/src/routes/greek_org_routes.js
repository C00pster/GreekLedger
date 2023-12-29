const express = require('express');
const router = express.Router();
const { adminAuth } = require('../middleware/auth_middleware');
const { createGreekOrg, getGreekOrg } = require('../controllers/greek_org_controller');

router.post('', adminAuth, createGreekOrg);
router.get('', adminAuth, getGreekOrg); //Need to update the auth later

module.exports = router;