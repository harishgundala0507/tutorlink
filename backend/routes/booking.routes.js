const express = require('express');
const router = express.Router();
const { protect, requireRole } = require('../middlewares/auth.middleware');
const {
    createBooking, myBookings, incomingBookings, updateStatus
} = require('../controllers/booking.controller');

router.post('/', protect, requireRole('student'), createBooking);
router.get('/my', protect, requireRole('student'), myBookings);
router.get('/incoming', protect, requireRole('tutor'), incomingBookings);
router.patch('/:id/status', protect, requireRole('tutor'), updateStatus);

module.exports = router;