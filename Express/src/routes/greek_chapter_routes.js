const express = require('express');
const router = express.Router();
const { checkAccess } = require('../middleware/auth_middleware');
const { 
    createGreekChapter, 
    getGreekChapter, 
    deleteGreekChapter, 
    addGreekChapterPresident,
    addGreekChapterOfficers,
    removeGreekChapterOfficers,
} = require('../controllers/greek_chapter_controller');
const {
    createCalendarEvent,
    takeAttendance,
    getCalendarEvent,
    updateCalendarEvent,
    deleteCalendarEvent,
} = require('../controllers/calendar_event_controller');

// Greek Chapter Operations
router.post('', checkAccess('greekOrgOfficer', 
    (req) => [req.body.greekOrg, null]), createGreekChapter);
router.get('', checkAccess('greekChapterOfficer', 
    (req) => [null, req.query.greekChapter]), getGreekChapter);
router.delete('', checkAccess('greekOrgOfficer', 
    (req) => [null, req.body.greekChapter]), deleteGreekChapter);

// Greek Chapter Officer Operations
router.post('/president', checkAccess('greekOrgOfficer', 
    (req) => [null, req.body.greekChapter]), addGreekChapterPresident);
router.post('/officers', checkAccess('greekChapterPresident', 
    (req) => [null, req.body.greekChapter]), addGreekChapterOfficers);
router.delete('/officers', checkAccess('greekChapterPresident', 
    (req) => [null, req.body.greekChapter]), removeGreekChapterOfficers);

// Calendar Event Operations
router.post('/calendarEvent', checkAccess('greekOrgOfficer', 
    (req) => [null, req.body.greekChapter]), createCalendarEvent);
router.get('/calendarEvent', checkAccess('greekOrgOfficer', 
    (req) => [null, req.body.greekChapter]), getCalendarEvent);
router.put('/calendarEvent', checkAccess('greekOrgOfficer', 
    (req) => [null, req.body.greekChapter]), updateCalendarEvent);
router.delete('/calendarEvent', checkAccess('greekOrgOfficer', 
    (req) => [null, req.body.greekChapter]), deleteCalendarEvent);

// Calendar Event Attendance Operations
router.post('/calendarEvent/attendance', checkAccess('greekOrgOfficer', 
    (req) => [null, req.body.greekChapter]), takeAttendance);

module.exports = router;