const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema({
    fullName: { type: String, required: true, trim: true },
    email: {
        type: String, required: true, unique: true, lowercase: true, trim: true,
        match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Invalid email']
    },
    password: { type: String, required: true, minlength: 6, select: false },
    phone: { type: String, required: true, trim: true },
    role: { type: String, enum: ['student', 'tutor'], default: 'student' },
    subjects: { type: [String], default: [] },
    location: { type: String, enum: ['Mumbai', 'Delhi', 'Bangalore', 'Pune', 'Hyderabad', 'Chennai', ''], default: '' },
    teachingMode: { type: String, enum: ['Online', 'Offline', 'Both'], default: 'Both' },
    bio: { type: String, default: '', maxlength: 500 },
    hourlyRate: { type: Number, default: 0, min: 0 },
    age: { type: Number, default: 0 },
    education: { type: String, default: '' }
}, { timestamps: true });

userSchema.pre('save', async function () {
    if (!this.isModified('password')) return;
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
});

userSchema.methods.comparePassword = function (entered) {
    return bcrypt.compare(entered, this.password);
};

module.exports = mongoose.model('User', userSchema);