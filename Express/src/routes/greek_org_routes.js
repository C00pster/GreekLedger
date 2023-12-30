const express = require('express');
const router = express.Router();
const { adminAuth } = require('../middleware/auth_middleware');
const { 
    createGreekOrg,
    getGreekOrg,
    addGreekOrgPresident,
    addGreekOrgOfficers,
    removeGreekOrgOfficers,
 } = require('../controllers/greek_org_controller');

router.post('', adminAuth, createGreekOrg);
router.get('', adminAuth, getGreekOrg); //Need to update the auth later

router.post('/president', adminAuth, addGreekOrgPresident);

router.post('/officers', adminAuth, addGreekOrgOfficers);
router.delete('/officers', adminAuth, removeGreekOrgOfficers);

module.exports = router;