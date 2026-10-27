const Booking = require('../models/booking.model');
const Slot = require('../models/slot.model');

exports.createBooking = async (req, res, next) => {
    try {
        const { slotId, subject } = req.body;
        if (!slotId || !subject) {
            return res.status(400).json({ success: false, message: 'slotId and subject are required' });
        }

        // ATOMIC LOCK
        const slot = await Slot.findOneAndUpdate(
            { _id: slotId, isBooked: false },
            { $set: { isBooked: true } },
            { new: true }
        );

        if (!slot) {
            const exists = await Slot.findById(slotId);
            if (!exists) return res.status(404).json({ success: false, message: 'Slot not found' });
            return res.status(409).json({ success: false, message: 'Slot was just booked by someone else' });
        }

        if (slot.tutorId.toString() === req.user._id.toString()) {
            await Slot.findByIdAndUpdate(slotId, { $set: { isBooked: false } });
            return res.status(400).json({ success: false, message: 'You cannot book your own slot' });
        }

        try {
            const booking = await Booking.create({
                studentId: req.user._id,
                tutorId: slot.tutorId,
                slotId: slot._id,
                subject,
                status: 'pending'
            });
            res.status(201).json({ success: true, booking });
        } catch (innerErr) {
            await Slot.findByIdAndUpdate(slotId, { $set: { isBooked: false } });
            if (innerErr.code === 11000) {
                return res.status(409).json({ success: false, message: 'Slot already booked' });
            }
            throw innerErr;
        }
    } catch (err) { next(err); }
};

exports.myBookings = async (req, res, next) => {
    try {
        const bookings = await Booking.find({ studentId: req.user._id })
            .populate('tutorId', 'fullName email phone subjects location')
            .populate('slotId', 'date startTime endTime')
            .sort({ createdAt: -1 });
        res.status(200).json({ success: true, bookings });
    } catch (err) { next(err); }
};

exports.incomingBookings = async (req, res, next) => {
    try {
        const bookings = await Booking.find({ tutorId: req.user._id })
            .populate('studentId', 'fullName email phone')
            .populate('slotId', 'date startTime endTime')
            .sort({ createdAt: -1 });
        res.status(200).json({ success: true, bookings });
    } catch (err) { next(err); }
};

exports.updateStatus = async (req, res, next) => {
    try {
        const { status, meetingLink } = req.body;
        if (!['confirmed', 'declined'].includes(status)) {
            return res.status(400).json({ success: false, message: 'Status must be confirmed or declined' });
        }

        const booking = await Booking.findById(req.params.id);
        if (!booking) return res.status(404).json({ success: false, message: 'Booking not found' });
        if (booking.tutorId.toString() !== req.user._id.toString()) {
            return res.status(403).json({ success: false, message: 'Not your booking' });
        }
        if (booking.status !== 'pending') {
            return res.status(400).json({ success: false, message: `Cannot change a ${booking.status} booking` });
        }

        booking.status = status;
        if (meetingLink) booking.meetingLink = meetingLink;
        await booking.save();

        if (status === 'declined') {
            await Slot.findByIdAndUpdate(booking.slotId, { $set: { isBooked: false } });
        }

        res.status(200).json({ success: true, booking });
    } catch (err) { next(err); }
};