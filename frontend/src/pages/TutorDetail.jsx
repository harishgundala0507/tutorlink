import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getTutor, getTutorSlots, createBooking } from '../api';

export default function TutorDetail() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [tutor, setTutor] = useState(null);
    const [slots, setSlots] = useState([]);
    const [selectedSlot, setSelectedSlot] = useState(null);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const tRes = await getTutor(id);
                const sRes = await getTutorSlots(id);
                setTutor(tRes.data.tutor);
                setSlots(sRes.data.slots);
            } catch (err) {
                setError('Tutor not found');
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [id]);

    const handleBook = async () => {
        if (!selectedSlot) return;
        setError('');
        try {
            await createBooking({ slotId: selectedSlot, subject: tutor.subjects[0] || 'General Session' });
            alert('Booking successful! Please wait for the tutor to confirm.');
            navigate('/my-bookings');
        } catch (err) {
            setError(err.response?.data?.message || 'Booking failed');
            // Refresh slots
            const sRes = await getTutorSlots(id);
            setSlots(sRes.data.slots);
        }
    };

    if (loading) return <div className="container">Loading...</div>;
    if (error && !tutor) return <div className="container">{error}</div>;

    return (
        <div className="container" style={{ maxWidth: '800px' }}>
            
            {/* Tutor Profile Card */}
            <div className="card" style={{ display: 'flex', gap: '30px', alignItems: 'flex-start', padding: '40px' }}>
                <div className="avatar" style={{ width: '100px', height: '100px', fontSize: '40px', flexShrink: 0 }}>
                    {tutor.fullName.charAt(0).toUpperCase()}
                </div>
                
                <div style={{ flexGrow: 1 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                        <h1 style={{ fontSize: '32px', fontWeight: '800' }}>{tutor.fullName}</h1>
                        <div style={{ fontSize: '24px', fontWeight: '800', color: '#4f46e5' }}>
                            ₹{tutor.hourlyRate}<span style={{ fontSize: '14px', color: '#64748b', fontWeight: '500' }}>/hr</span>
                        </div>
                    </div>
                    
                    <p style={{ color: '#64748b', fontSize: '16px', marginBottom: '15px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                        📍 {tutor.location || 'Online'} <br/>
                        ✉️ {tutor.email}
                    </p>

                    <div style={{ marginBottom: '20px', display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
                        {tutor.subjects.length > 0 ? tutor.subjects.map(sub => (
                            <span key={sub} style={{ background: '#e0e7ff', color: '#4338ca', padding: '6px 14px', borderRadius: '20px', fontSize: '14px', fontWeight: '600' }}>
                                {sub}
                            </span>
                        )) : (
                            <span style={{ background: '#f1f5f9', color: '#475569', padding: '6px 14px', borderRadius: '20px', fontSize: '14px' }}>General</span>
                        )}
                    </div>

                    {/* NEW: Education and Age */}
                    <div style={{ display: 'flex', gap: '20px', marginBottom: '20px' }}>
                        <div style={{ background: '#f1f5f9', padding: '10px 15px', borderRadius: '8px', flex: 1 }}>
                            <span style={{ fontSize: '12px', color: '#64748b', display: 'block', textTransform: 'uppercase', fontWeight: 'bold', marginBottom: '4px' }}>Education</span>
                            <span style={{ fontWeight: '600', color: '#1e293b' }}>{tutor.education || 'Not specified'}</span>
                        </div>
                        <div style={{ background: '#f1f5f9', padding: '10px 15px', borderRadius: '8px', flex: 1 }}>
                            <span style={{ fontSize: '12px', color: '#64748b', display: 'block', textTransform: 'uppercase', fontWeight: 'bold', marginBottom: '4px' }}>Age</span>
                            <span style={{ fontWeight: '600', color: '#1e293b' }}>{tutor.age ? `${tutor.age} years old` : 'N/A'}</span>
                        </div>
                    </div>

                    <div style={{ background: '#f8fafc', padding: '20px', borderRadius: '8px', borderLeft: '4px solid #4f46e5' }}>
                        <h3 style={{ fontSize: '14px', textTransform: 'uppercase', letterSpacing: '1px', color: '#64748b', marginBottom: '10px' }}>About Me</h3>
                        <p style={{ fontSize: '16px', lineHeight: '1.6', color: '#334155' }}>
                            {tutor.bio || 'This tutor has not written a bio yet, but is ready to help you learn!'}
                        </p>
                    </div>
                </div>
            </div>

            {/* Booking Section */}
            <div className="card">
                <h2 style={{ marginBottom: '20px', fontSize: '22px', fontWeight: '700' }}>Select an Available Slot</h2>
                {error && <div style={{ background: '#fecaca', color: '#991b1b', padding: '12px', borderRadius: '8px', marginBottom: '20px', fontWeight: '500' }}>{error}</div>}
                
                {slots.length === 0 ? (
                    <p style={{ color: '#64748b' }}>No slots available right now. Please check back later.</p>
                ) : (
                    <div style={{ display: 'flex', gap: '15px', flexWrap: 'wrap', marginBottom: '30px' }}>
                        {slots.map(slot => (
                            <button 
                                key={slot._id} 
                                onClick={() => setSelectedSlot(slot._id)}
                                disabled={slot.isBooked}
                                style={{
                                    padding: '15px', border: '2px solid', borderRadius: '10px', cursor: slot.isBooked ? 'not-allowed' : 'pointer',
                                    borderColor: slot.isBooked ? '#e2e8f0' : selectedSlot === slot._id ? '#4f46e5' : '#cbd5e1',
                                    background: slot.isBooked ? '#f8fafc' : selectedSlot === slot._id ? '#e0e7ff' : 'white',
                                    color: slot.isBooked ? '#94a3b8' : selectedSlot === slot._id ? '#4338ca' : '#1e293b',
                                    transition: 'all 0.2s', textAlign: 'left', minWidth: '150px'
                                }}
                            >
                                <div style={{ fontWeight: '700', marginBottom: '4px' }}>{slot.date}</div>
                                <div style={{ fontSize: '14px' }}>{slot.startTime} - {slot.endTime}</div>
                                {slot.isBooked && <div style={{ fontSize: '12px', marginTop: '5px', color: '#ef4444' }}>Booked</div>}
                            </button>
                        ))}
                    </div>
                )}

                <button className="btn" onClick={handleBook} disabled={!selectedSlot || slots.length === 0} style={{ width: '100%', padding: '16px', fontSize: '16px' }}>
                    Confirm Booking
                </button>
            </div>
        </div>
    );
}