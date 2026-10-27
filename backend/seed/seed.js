const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');
dotenv.config({ path: path.join(__dirname, '..', '.env') });

const User = require('../models/user.model');
const Slot = require('../models/slot.model');

const tutors = [
    { fullName: 'Aarav Mehta', email: 'aarav@tutorlink.dev', phone: '9800000001', subjects: ['Mathematics', 'Physics'], location: 'Mumbai', teachingMode: 'Both', bio: 'IIT-B grad with 5 years of JEE coaching experience.', hourlyRate: 600, age: 26, education: 'B.Tech, IIT Bombay' },
    { fullName: 'Priya Sharma', email: 'priya@tutorlink.dev', phone: '9800000002', subjects: ['English'], location: 'Delhi', teachingMode: 'Online', bio: 'IELTS trainer, 8.5 band. 200+ students.', hourlyRate: 400, age: 29, education: 'M.A. English, Delhi University' },
    { fullName: 'Rahul Iyer', email: 'rahul@tutorlink.dev', phone: '9800000003', subjects: ['Coding'], location: 'Bangalore', teachingMode: 'Online', bio: 'Ex-Google SWE. Teaches Python, DSA, and web dev.', hourlyRate: 1200, age: 32, education: 'B.Tech, NIT Trichy' },
    { fullName: 'Sneha Kulkarni', email: 'sneha@tutorlink.dev', phone: '9800000004', subjects: ['Guitar'], location: 'Pune', teachingMode: 'Offline', bio: 'Grade 8 Trinity certified. Acoustic & electric.', hourlyRate: 500, age: 24, education: 'Trinity College London' },
    { fullName: 'Vikram Reddy', email: 'vikram@tutorlink.dev', phone: '9800000005', subjects: ['Mathematics'], location: 'Hyderabad', teachingMode: 'Both', bio: 'CBSE & State board specialist. 10 years experience.', hourlyRate: 350, age: 38, education: 'M.Sc Mathematics, Osmania University' },
    { fullName: 'Ananya Nair', email: 'ananya@tutorlink.dev', phone: '9800000006', subjects: ['Physics', 'Coding'], location: 'Chennai', teachingMode: 'Both', bio: 'BITS Pilani. Physics olympiad mentor + Python basics.', hourlyRate: 700, age: 27, education: 'M.Sc Physics, BITS Pilani' }
];

function nextDates(n) {
    const out = [];
    for (let i = 1; i <= n; i++) {
        const d = new Date(); d.setDate(d.getDate() + i);
        out.push(d.toISOString().split('T')[0]);
    }
    return out;
}

async function run() {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected. Wiping tutors & slots...');

    const emails = tutors.map(t => t.email);
    const existing = await User.find({ email: { $in: emails } });
    const ids = existing.map(u => u._id);
    if (ids.length > 0) {
        await Slot.deleteMany({ tutorId: { $in: ids } });
    }
    await User.deleteMany({ email: { $in: emails } });

    const dates = nextDates(3);
    const times = [['10:00', '11:00'], ['14:00', '15:00'], ['18:00', '19:00']];

    for (const t of tutors) {
        const created = await User.create({ ...t, password: 'tutor123', role: 'tutor' });
        for (const d of dates) {
            for (const [s, e] of times) {
                await Slot.create({ tutorId: created._id, date: d, startTime: s, endTime: e });
            }
        }
        console.log(`Seeded ${t.fullName} (${t.subjects.join(', ')})`);
    }

    console.log('\n✅ Done. Tutor login: any aarav/priya/...@tutorlink.dev, password: tutor123');
    await mongoose.disconnect();
    process.exit(0);
}

run().catch(err => { console.error(err); process.exit(1); });