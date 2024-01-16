const express = require('express');
const router = express.Router();
const { checkAccess, checkAccessExplicit } = require('../middleware/auth_middleware');
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
    createChapterMeeting,
    takeAttendance,
    getChapterMeeting,
    updateChapterMeeting,
    deleteChapterMeeting,
} = require('../controllers/calendar_event_controller');

// Greek Chapter Operations
router.post('', (req, res, next) => {
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
router.delete('', (req, res, next) => {
        req.check = { greekOrg: null, greekChapter: req.body.greekChapter };
        next();
    },
    checkAccess('greekOrgOfficer'), 
    deleteGreekChapter);

// Greek Chapter Officer Operations
router.post('/president', (req, res, next) => {
        req.check = { greekOrg: null, greekChapter: req.body.greekChapter };
        next();
    },
    checkAccess('greekChapterPresident'), 
    addGreekChapterPresident);
router.post('/officers', (req, res, next) => {
        req.check = { greekOrg: null, greekChapter: req.body.greekChapter };
        next();
    },
    checkAccess('greekChapterPresident'), 
    addGreekChapterOfficers);
router.delete('/officers', (req, res, next) => {
        req.check = { greekOrg: null, greekChapter: req.body.greekChapter };
    },
    checkAccess('greekChapterPresident'), 
    removeGreekChapterOfficers);

// Greek Chapter Member Operations
router.post('/members', (req, res, next) => {
        req.check = { greekOrg: null, greekChapter: req.body.greekChapter };
        next();
    },
    checkAccess('greekChapterOfficer'), 
    addGreekChapterMembers);
router.delete('/members', (req, res, next) => {
        req.check = { greekOrg: null, greekChapter: req.body.greekChapter };
        next();
    },
    checkAccess('greekChapterOfficer'), 
    removeGreekChapterMembers);

// Chapter Meeting Operations
router.post('/meeting', (req, res, next) => {
        req.check = { greekOrg: null, greekChapter: req.body.greekChapter };
        next();
    },
    checkAccessExplicit(['greekChapterOfficer', 'greekChapterPresident']), 
    createChapterMeeting);
router.get('/meeting', (req, res, next) => {
        req.check = { greekOrg: null, greekChapter: req.query.greekChapter };
        next();
    },
    // auth handled in getChapterMeeting
    getChapterMeeting);
router.put('/meeting', (req, res, next) => {
        req.check = { greekOrg: null, greekChapter: req.body.greekChapter };
        next();
    },
    checkAccessExplicit(['greekChapterOfficer', 'greekChapterPresident']), 
    updateChapterMeeting);
router.delete('/meeting', (req, res, next) => {
        req.check = { greekOrg: null, greekChapter: req.body.greekChapter };
        next();
    },
    // auth handled in deleteChapterMeeting 
    deleteChapterMeeting);

// Chapter Meeting Attendance Operations
router.post('/meeting/attendance', (req, res, next) => {
        req.check = { greekOrg: null, greekChapter: req.body.greekChapter };
        next();
    },
    checkAccessExplicit(['greekChapterOfficer', 'greekChapterPresident']), 
    takeAttendance);

module.exports = router;