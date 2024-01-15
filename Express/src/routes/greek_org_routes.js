const express = require('express');
const router = express.Router();
const { checkAccess } = require('../middleware/auth_middleware');
const { 
    createGreekOrg,
    getGreekOrg,
    addGreekOrgPresident,
    addGreekOrgOfficers,
    removeGreekOrgOfficers,
} = require('../controllers/greek_org_controller');


// Greek Org Operations
router.post('', checkAccess('admin', null, null), createGreekOrg);
router.get('', checkAccess('greekOrgOfficer', 
    (req, res) => [req.body.greekOrg, null]), 
    getGreekOrg);

// Greek Org Officer Operations
router.post('/president', checkAccess('admin', null, null), addGreekOrgPresident);
router.post('/officers', checkAccess('greekOrgPresident', 
    (req, res) => [req.body.greekOrg, null]), 
    addGreekOrgOfficers);
router.delete('/officers', checkAccess('greekOrgPresident', 
    (req, res) => [req.body.greekOrg, null]), 
    removeGreekOrgOfficers);

module.exports = router;