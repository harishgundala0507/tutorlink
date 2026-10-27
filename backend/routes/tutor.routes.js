const express = require('express');
const router = express.Router();
const { protect, requireRole } = require('../middlewares/auth.middleware');
const {
    searchTutors, getTutorById, getTutorSlots, addSlot, deleteSlot
} = require('../controllers/tutor.controller');

router.get('/', searchTutors);
router.get('/:id', getTutorById);
router.get('/:id/slots', getTutorSlots);

// Tutor-only
router.post('/slots', protect, requireRole('tutor'), addSlot);
router.delete('/slots/:slotId', protect, requireRole('tutor'), deleteSlot);

module.exports = router;