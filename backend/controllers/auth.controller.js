const User = require('../models/user.model');
const generateToken = require('../utils/generateToken');

const cookieOpts = () => ({
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
    maxAge: 7 * 24 * 60 * 60 * 1000
});

exports.register = async (req, res, next) => {
    try {
        const { fullName, email, password, phone, role, subjects, location, bio, hourlyRate } = req.body;
        if (!fullName || !email || !password || !phone) {
            return res.status(400).json({ success: false, message: 'All required fields must be filled' });
        }
        if (password.length < 6) {
            return res.status(400).json({ success: false, message: 'Password must be at least 6 characters' });
        }
        const existing = await User.findOne({ email });
        if (existing) return res.status(409).json({ success: false, message: 'Email already registered' });

        const user = await User.create({
            fullName, email, password, phone,
            role: role === 'tutor' ? 'tutor' : 'student',
            subjects: Array.isArray(subjects) ? subjects : [],
            location: location || '',
            bio: bio || '',
            hourlyRate: Number(hourlyRate) || 0
        });

        const token = generateToken(user._id);
        res.cookie('token', token, cookieOpts());
        res.status(201).json({ success: true, message: 'Registered successfully', user: { _id: user._id, fullName: user.fullName, email: user.email, phone: user.phone, role: user.role } });
    } catch (err) {
        if (err.name === 'ValidationError') return res.status(400).json({ success: false, message: Object.values(err.errors).map(e => e.message).join(', ') });
        next(err);
    }
};

exports.login = async (req, res, next) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) return res.status(400).json({ success: false, message: 'Email and password are required' });
        const user = await User.findOne({ email }).select('+password');
        if (!user) return res.status(401).json({ success: false, message: 'Invalid credentials' });
        const match = await user.comparePassword(password);
        if (!match) return res.status(401).json({ success: false, message: 'Invalid credentials' });
        const token = generateToken(user._id);
        res.cookie('token', token, cookieOpts());
        res.status(200).json({ success: true, message: 'Login successful' });
    } catch (err) { next(err); }
};

exports.me = async (req, res) => res.status(200).json(req.user);
exports.updateProfile = async (req, res, next) => {
    try {
        const { subjects, location, bio, hourlyRate, age, education } = req.body;
        const user = await User.findById(req.user._id);

        if (!user) return res.status(404).json({ success: false, message: 'User not found' });

        if (user.role === 'tutor') {
            if (subjects) user.subjects = subjects;
            if (location) user.location = location;
            if (bio) user.bio = bio;
            if (hourlyRate) user.hourlyRate = Number(hourlyRate);
            if (age) user.age = Number(age);
            if (education) user.education = education;
        } else {
            if (bio) user.bio = bio; // Students can also have a bio
        }

        await user.save();
        res.status(200).json({ success: true, message: 'Profile updated successfully', user });
    } catch (err) { next(err); }
};
exports.logout = async (req, res) => {
    res.cookie('token', '', { ...cookieOpts(), expires: new Date(0) });
    res.status(200).json({ success: true, message: 'Logged out' });
};