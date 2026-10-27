const User = require('../models/user.model');
const Slot = require('../models/slot.model');

exports.searchTutors = async (req, res, next) => {
    try {
        const { subject, location, maxPrice, mode } = req.query;
        const filter = { role: 'tutor' };

        if (subject && subject.trim()) filter.subjects = { $in: [new RegExp(subject, 'i')] };
        if (location && location.trim()) filter.location = location;
        if (maxPrice) filter.hourlyRate = { $lte: Number(maxPrice) };
        
        if (mode) {
            if (mode === 'Online') filter.teachingMode = { $in: ['Online', 'Both'] };
            else if (mode === 'Offline') filter.teachingMode = { $in: ['Offline', 'Both'] };
        }

        const tutors = await User.find(filter).select('fullName subjects location bio hourlyRate email phone age education teachingMode');
        res.status(200).json({ success: true, count: tutors.length, tutors });
    } catch (err) { next(err); }
};

exports.getTutorById = async (req, res, next) => {
    try {
        const tutor = await User.findOne({ _id: req.params.id, role: 'tutor' })
            .select('fullName subjects location bio hourlyRate email phone age education teachingMode');
        if (!tutor) return res.status(404).json({ success: false, message: 'Tutor not found' });
        res.status(200).json({ success: true, tutor });
    } catch (err) { next(err); }
};

exports.getTutorSlots = async (req, res, next) => {
    try {
        const slots = await Slot.find({ tutorId: req.params.id }).sort({ date: 1, startTime: 1 });
        res.status(200).json({ success: true, slots });
    } catch (err) { next(err); }
};

exports.addSlot = async (req, res, next) => {
    try {
        const { date, startTime, endTime } = req.body;
        if (!date || !startTime || !endTime) {
            return res.status(400).json({ success: false, message: 'date, startTime, endTime required' });
        }
        if (startTime >= endTime) {
            return res.status(400).json({ success: false, message: 'End time must be after start time' });
        }

        const today = new Date().toISOString().split('T')[0];
        if (date < today) {
            return res.status(400).json({ success: false, message: 'Cannot add a slot in the past' });
        }

        const overlap = await Slot.findOne({
            tutorId: req.user._id, date,
            $or: [{ startTime: { $lt: endTime }, endTime: { $gt: startTime } }]
        });
        if (overlap) return res.status(409).json({ success: false, message: 'This time overlaps an existing slot' });

        const slot = await Slot.create({ tutorId: req.user._id, date, startTime, endTime });
        res.status(201).json({ success: true, slot });
    } catch (err) {
        if (err.code === 11000) return res.status(409).json({ success: false, message: 'This slot already exists' });
        next(err);
    }
};

exports.deleteSlot = async (req, res, next) => {
    try {
        const slot = await Slot.findById(req.params.slotId);
        if (!slot) return res.status(404).json({ success: false, message: 'Slot not found' });
        if (slot.tutorId.toString() !== req.user._id.toString()) {
            return res.status(403).json({ success: false, message: 'Not your slot' });
        }
        if (slot.isBooked) return res.status(400).json({ success: false, message: 'Cannot delete a booked slot' });
        
        await slot.deleteOne();
        res.status(200).json({ success: true, message: 'Slot deleted' });
    } catch (err) { next(err); }
};