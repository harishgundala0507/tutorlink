const express = require('express');
const router = express.Router();
const { protect } = require('../middlewares/auth.middleware');
const { register, login, me, logout, updateProfile } = require('../controllers/auth.controller');

router.post('/register', register);
router.post('/login', login);
router.get('/me', protect, me);
router.put('/profile', protect, updateProfile); // <-- This is the new route
router.post('/logout', protect, logout);

module.exports = router;