const express = require('express');
const router = express.Router();
const { adminAuth } = require('../middleware/auth_middleware');
const { 
    createGreekChapter, 
    getGreekChapter, 
    deleteGreekChapter, 
    addGreekChapterPresident,
    addGreekChapterOfficers,
    removeGreekChapterOfficers,
} = require('../controllers/greek_chapter_controller');

router.post('', adminAuth, createGreekChapter);
router.get('', adminAuth, getGreekChapter); //Need to update the auth later
router.delete('', adminAuth, deleteGreekChapter);

router.post('/president', adminAuth, addGreekChapterPresident);

router.post('/officers', adminAuth, addGreekChapterOfficers);
router.delete('/officers', adminAuth, removeGreekChapterOfficers);

module.exports = router;