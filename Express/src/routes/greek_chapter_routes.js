// Set up router
const express = require('express');
const router = express.Router();

// Import middleware
const { checkAccess, checkAccessExplicit } = require('../middleware/auth_middleware');
const {
    validateGreekChapterCreate,
    validateGreekChapterDelete,
    validateGreekChapterPresident,
    validateGreekChapterMembers,
} = require('../middleware/request_validation/greek_chapter_validation');
const {
    validateMeetingCreate,
    validateMeetingUpdate,
    validateMeetingDelete,
    validateMeetingAttendance,
} = require('../middleware/request_validation/meeting_validation');

//Import controllers
const { 
    createGreekChapter, 
    getGreekChapter, 
    deleteGreekChapter, 
    addGreekChapterPresident,
    addGreekChapterOfficers,
    removeGreekChapterOfficers,
    addGreekChapterMembers,
    removeGreekChapterMembers,
} = require('../controllers/greek_chapter_controller');
const {
    createMeeting,
    takeAttendance,
    getMeeting,
    updateMeeting,
    deleteMeeting,
} = require('../controllers/meeting_controller');

// Greek Chapter Operations
router.post('', validateGreekChapterCreate, (req, res, next) => {
        req.check = { greekOrg: req.body.greekOrg, greekChapter: null };
        next();
    },
    checkAccess('greekOrgOfficer'), 
    createGreekChapter);
router.get('', (req, res, next) => {
        req.check = { greekOrg: null, greekChapter: req.query.greekChapter };
        next();
    },
    checkAccess('greekChapterOfficer'), 
    getGreekChapter);
router.delete('', validateGreekChapterDelete, (req, res, next) => {
        req.check = { greekOrg: null, greekChapter: req.body.greekChapter };
        next();
    },
    checkAccess('greekOrgOfficer'), 
    deleteGreekChapter);

// Greek Chapter Officer Operations
router.post('/president', validateGreekChapterPresident, (req, res, next) => {
        req.check = { greekOrg: null, greekChapter: req.body.greekChapter };
        next();
    },
    checkAccess('greekChapterPresident'), 
    addGreekChapterPresident);
router.post('/officers', validateGreekChapterMembers, (req, res, next) => {
        req.check = { greekOrg: null, greekChapter: req.body.greekChapter };
        next();
    },
    checkAccess('greekChapterPresident'), 
    addGreekChapterOfficers);
router.delete('/officers', validateGreekChapterMembers, (req, res, next) => {
        req.check = { greekOrg: null, greekChapter: req.body.greekChapter };
        next();
    },
    checkAccess('greekChapterPresident'), 
    removeGreekChapterOfficers);

// Greek Chapter Member Operations
router.post('/members', validateGreekChapterMembers, (req, res, next) => {
        req.check = { greekOrg: null, greekChapter: req.body.greekChapter };
        next();
    },
    checkAccess('greekChapterOfficer'), 
    addGreekChapterMembers);
router.delete('/members', validateGreekChapterMembers, (req, res, next) => {
        req.check = { greekOrg: null, greekChapter: req.body.greekChapter };
        next();
    },
    checkAccess('greekChapterOfficer'), 
    removeGreekChapterMembers);

// Chapter Meeting Operations
router.post('/meeting', validateMeetingCreate, (req, res, next) => {
        req.check = { greekOrg: null, greekChapter: req.body.greekChapter };
        next();
    },
    checkAccessExplicit(['greekChapterOfficer', 'greekChapterPresident']), 
    createMeeting);
router.get('/meeting', (req, res, next) => {
        req.check = { greekOrg: null, greekChapter: req.query.greekChapter };
        next();
    },
    // auth handled in getMeeting
    getMeeting);
router.put('/meeting', validateMeetingUpdate, (req, res, next) => {
        req.check = { greekOrg: null, greekChapter: req.body.greekChapter };
        next();
    },
    checkAccessExplicit(['greekChapterOfficer', 'greekChapterPresident']), 
    updateMeeting);
router.delete('/meeting', validateMeetingDelete, (req, res, next) => {
        req.check = { greekOrg: null, greekChapter: req.body.greekChapter };
        next();
    },
    // auth handled in deleteMeeting 
    deleteMeeting);

// Chapter Meeting Attendance Operations
router.post('/meeting/attendance', validateMeetingAttendance, (req, res, next) => {
        req.check = { greekOrg: null, greekChapter: req.body.greekChapter };
        next();
    },
    checkAccessExplicit(['greekChapterOfficer', 'greekChapterPresident']), 
    takeAttendance);

module.exports = router;