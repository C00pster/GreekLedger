const express = require('express');
const router = express.Router();
const { adminAuth } = require('../middleware/auth_middleware');
const { createGreekOrg, getGreekOrg, addGreekOrgPresident } = require('../controllers/greek_org_controller');

router.post('', adminAuth, createGreekOrg);
router.get('', adminAuth, getGreekOrg); //Need to update the auth later

router.post('/president', adminAuth, addGreekOrgPresident);

module.exports = router;