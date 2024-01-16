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
router.post('', checkAccess('admin'), createGreekOrg);

router.get('', (req, res, next) => {
        req.check = {
            greekOrg: req.query.greekOrg,
            greekChapter: null,
        };
        next()
    },
    checkAccess('greekOrgOfficer'), 
    getGreekOrg);

// Greek Org Officer Operations
router.post('/president', checkAccess('admin'), addGreekOrgPresident);
router.post('/officers', (req, res, next) => {
        req.check = {
            greekOrg: req.body.greekOrg,
            greekChapter: null,
        };
        next();
    },
    checkAccess('greekOrgPresident'), 
    addGreekOrgOfficers);
router.delete('/officers', (req, res, next) => {
        req.check = {
            greekOrg: req.body.greekOrg,
            greekChapter: null,
        };
        next();
    },
    checkAccess('greekOrgPresident'), 
    removeGreekOrgOfficers);

module.exports = router;