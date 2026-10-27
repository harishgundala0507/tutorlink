import { useState, useEffect } from 'react';
import { getIncomingBookings, updateBookingStatus, addSlot, deleteSlot, getMe, updateProfile } from '../api';

const SUBJECTS = ['Mathematics', 'Physics', 'English', 'Guitar', 'Coding'];
const CITIES = ['Mumbai', 'Delhi', 'Bangalore', 'Pune', 'Hyderabad', 'Chennai'];

export default function TutorDashboard() {
    const [bookings, setBookings] = useState([]);
    const [slots, setSlots] = useState([]);
    const [newSlot, setNewSlot] = useState({ date: '', startTime: '', endTime: '' });
    const [error, setError] = useState('');
    const [meetingLinks, setMeetingLinks] = useState({});
    
    const [profile, setProfile] = useState({ bio: '', age: '', education: '', hourlyRate: '', location: '', subjects: [], teachingMode: 'Both' });
    const [profileMsg, setProfileMsg] = useState('');

    const loadData = async () => {
        try {
            const bRes = await getIncomingBookings();
            setBookings(bRes.data.bookings);
            
            const userRes = await getMe();
            setProfile({
                bio: userRes.data.bio || '',
                age: userRes.data.age || '',
                education: userRes.data.education || '',
                hourlyRate: userRes.data.hourlyRate || '',
                location: userRes.data.location || '',
                subjects: userRes.data.subjects || [],
                teachingMode: userRes.data.teachingMode || 'Both'
            });

            const sRes = await fetch(`http://localhost:5000/api/tutors/${userRes.data._id}/slots`, { credentials: 'include' });
            const sData = await sRes.json();
            setSlots(sData.slots);
        } catch (err) {
            console.error(err);
        }
    };

    useEffect(() => { loadData(); }, []);

    const handleProfileUpdate = async (e) => {
        e.preventDefault();
        setProfileMsg('');
        try {
            await updateProfile(profile);
            setProfileMsg('Profile updated successfully!');
            setTimeout(() => setProfileMsg(''), 3000);
        } catch (err) {
            setError('Failed to update profile');
        }
    };

    const handleSubjectToggle = (sub) => {
        setProfile(prev => ({
            ...prev,
            subjects: prev.subjects.includes(sub) 
                ? prev.subjects.filter(s => s !== sub)
                : [...prev.subjects, sub]
        }));
    };

    const handleStatus = async (id, status) => {
        try {
            await updateBookingStatus(id, status, meetingLinks[id] || '');
            loadData();
        } catch (err) {
            alert(err.response?.data?.message || 'Failed to update');
        }
    };

    const handleAddSlot = async (e) => {
        e.preventDefault();
        setError('');
        try {
            await addSlot(newSlot);
            setNewSlot({ date: '', startTime: '', endTime: '' });
            loadData();
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to add slot');
        }
    };

    const handleDeleteSlot = async (id) => {
        if (!window.confirm('Delete this slot?')) return;
        try {
            await deleteSlot(id);
            loadData();
        } catch (err) {
            alert(err.response?.data?.message || 'Failed to delete');
        }
    };

    return (
        <div className="container">
            <h1 style={{ marginBottom: '20px' }}>Tutor Dashboard</h1>

            <div className="card">
                <h2 style={{ marginBottom: '15px' }}>Complete Your Profile</h2>
                <p style={{ color: '#64748b', marginBottom: '15px', fontSize: '14px' }}>Fill out your details so students can learn more about you.</p>
                
                {profileMsg && <div style={{ background: '#bbf7d0', color: '#166534', padding: '10px', borderRadius: '6px', marginBottom: '15px' }}>{profileMsg}</div>}
                
                <form onSubmit={handleProfileUpdate} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
                    <div style={{ gridColumn: 'span 2' }}>
                        <label style={{ fontSize: '14px', fontWeight: '600' }}>Bio (About Me)</label>
                        <textarea className="input" rows="3" value={profile.bio} onChange={e => setProfile({...profile, bio: e.target.value})} placeholder="Tell students about your teaching style..." />
                    </div>
                    
                    <div>
                        <label style={{ fontSize: '14px', fontWeight: '600' }}>Age</label>
                        <input className="input" type="number" value={profile.age} onChange={e => setProfile({...profile, age: e.target.value})} placeholder="e.g. 26" />
                    </div>
                    
                    <div>
                        <label style={{ fontSize: '14px', fontWeight: '600' }}>Education</label>
                        <input className="input" type="text" value={profile.education} onChange={e => setProfile({...profile, education: e.target.value})} placeholder="e.g. B.Tech, IIT Bombay" />
                    </div>
                    
                    <div>
                        <label style={{ fontSize: '14px', fontWeight: '600' }}>Hourly Rate (₹)</label>
                        <input className="input" type="number" value={profile.hourlyRate} onChange={e => setProfile({...profile, hourlyRate: e.target.value})} placeholder="e.g. 500" />
                    </div>

                    <div>
                        <label style={{ fontSize: '14px', fontWeight: '600' }}>Location</label>
                        <select className="input" value={profile.location} onChange={e => setProfile({...profile, location: e.target.value})}>
                            <option value="">Select City</option>
                            {CITIES.map(c => <option key={c} value={c}>{c}</option>)}
                        </select>
                    </div>

                    <div>
                        <label style={{ fontSize: '14px', fontWeight: '600' }}>Teaching Mode</label>
                        <select className="input" value={profile.teachingMode} onChange={e => setProfile({...profile, teachingMode: e.target.value})}>
                            <option value="Both">Both (Online & Offline)</option>
                            <option value="Online">Online Only</option>
                            <option value="Offline">Offline Only</option>
                        </select>
                    </div>

                    <div style={{ gridColumn: 'span 2' }}>
                        <label style={{ fontSize: '14px', fontWeight: '600', display: 'block', marginBottom: '8px' }}>Subjects you teach</label>
                        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                            {SUBJECTS.map(sub => (
                                <button 
                                    type="button" 
                                    key={sub} 
                                    onClick={() => handleSubjectToggle(sub)}
                                    className="btn" 
                                    style={{ background: profile.subjects.includes(sub) ? '#4f46e5' : '#e2e8f0', color: profile.subjects.includes(sub) ? 'white' : '#475569' }}
                                >
                                    {sub}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div style={{ gridColumn: 'span 2', marginTop: '10px' }}>
                        <button type="submit" className="btn">Save Profile</button>
                    </div>
                </form>
            </div>

            <div className="card">
                <h2>Incoming Bookings</h2>
                {bookings.length === 0 ? <p>No bookings yet.</p> : (
                    <div className="grid" style={{ marginTop: '15px' }}>
                        {bookings.map(b => (
                            <div key={b._id} style={{ border: '1px solid #e5e7eb', padding: '15px', borderRadius: '8px' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
                                    <strong>{b.studentId?.fullName}</strong>
                                    <span className={`badge badge-${b.status}`}>{b.status.toUpperCase()}</span>
                                </div>
                                <p style={{ fontSize: '14px' }}>{b.slotId?.date} | {b.slotId?.startTime} - {b.slotId?.endTime}</p>
                                <p style={{ fontSize: '14px', marginBottom: '10px' }}>Subject: {b.subject}</p>
                                
                                {b.status === 'pending' && (
                                    <div style={{ marginTop: '10px' }}>
                                        <input 
                                            className="input" 
                                            placeholder="Paste Zoom/Meet link here (optional)" 
                                            value={meetingLinks[b._id] || ''}
                                            onChange={(e) => setMeetingLinks({ ...meetingLinks, [b._id]: e.target.value })}
                                            style={{ marginBottom: '10px', fontSize: '12px', padding: '8px' }}
                                        />
                                        <div style={{ display: 'flex', gap: '10px' }}>
                                            <button className="btn" onClick={() => handleStatus(b._id, 'confirmed')}>Accept & Send Link</button>
                                            <button className="btn btn-danger" onClick={() => handleStatus(b._id, 'declined')}>Decline</button>
                                        </div>
                                    </div>
                                )}
                                {b.status === 'confirmed' && b.meetingLink && (
                                    <a href={b.meetingLink} target="_blank" rel="noreferrer" className="btn" style={{ display: 'block', textAlign: 'center', marginTop: '10px', background: '#10b981' }}>
                                        Join Online Class
                                    </a>
                                )}
                            </div>
                        ))}
                    </div>
                )}
            </div>

            <div className="card">
                <h2>Manage Availability</h2>
                {error && <p style={{ color: 'red' }}>{error}</p>}
                <form onSubmit={handleAddSlot} style={{ display: 'flex', gap: '10px', marginBottom: '20px', flexWrap: 'wrap' }}>
                    <input className="input" type="date" value={newSlot.date} onChange={e => setNewSlot({...newSlot, date: e.target.value})} required style={{ width: 'auto' }} />
                    <input className="input" type="time" value={newSlot.startTime} onChange={e => setNewSlot({...newSlot, startTime: e.target.value})} required style={{ width: 'auto' }} />
                    <input className="input" type="time" value={newSlot.endTime} onChange={e => setNewSlot({...newSlot, endTime: e.target.value})} required style={{ width: 'auto' }} />
                    <button className="btn" type="submit">Add Slot</button>
                </form>

                <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                    {slots.map(slot => (
                        <div key={slot._id} style={{ border: '1px solid #d1d5db', padding: '10px', borderRadius: '6px', background: slot.isBooked ? '#f3f4f6' : 'white' }}>
                            <p style={{ fontSize: '14px', fontWeight: 'bold' }}>{slot.date}</p>
                            <p style={{ fontSize: '12px', marginBottom: '5px' }}>{slot.startTime} - {slot.endTime}</p>
                            {slot.isBooked ? (
                                <span style={{ fontSize: '12px', color: 'green' }}>Booked</span>
                            ) : (
                                <button onClick={() => handleDeleteSlot(slot._id)} style={{ color: 'red', background: 'none', border: 'none', cursor: 'pointer', fontSize: '12px' }}>Delete</button>
                            )}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}