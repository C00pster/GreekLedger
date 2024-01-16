// Set up router
const express = require('express');
const router = express.Router();

// Import middleware
const { checkAccess } = require('../middleware/auth_middleware');
const {
    validateOrgCreate,
    validateOrgPresident,
    validateOrgOfficer
} = require('../middleware/request_validation/greek_org_validation');

//Import controllers
const { 
    createGreekOrg,
    getGreekOrg,
    addGreekOrgPresident,
    addGreekOrgOfficers,
    removeGreekOrgOfficers,
} = require('../controllers/greek_org_controller');


// Greek Org Operations
router.post('', validateOrgCreate, checkAccess('admin'), createGreekOrg);

router.get('', (req, res, next) => {
        req.check = { greekOrg: req.query.greekOrg, greekChapter: null, };
        next()
    },
    checkAccess('greekOrgOfficer'), 
    getGreekOrg);

// Greek Org Officer Operations
router.post('/president', validateOrgPresident, checkAccess('admin'), addGreekOrgPresident);
router.post('/officers', validateOrgOfficer, (req, res, next) => {
        req.check = { greekOrg: req.body.greekOrg, greekChapter: null };
        next();
    },
    checkAccess('greekOrgPresident'), 
    addGreekOrgOfficers);
router.delete('/officers', validateOrgOfficer, (req, res, next) => {
        req.check = { greekOrg: req.body.greekOrg, greekChapter: null };
        next();
    },
    checkAccess('greekOrgPresident'), 
    removeGreekOrgOfficers);

module.exports = router;