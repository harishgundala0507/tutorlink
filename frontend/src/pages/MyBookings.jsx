import { useState, useEffect } from 'react';
import { getMyBookings } from '../api';

export default function MyBookings() {
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        getMyBookings()
            .then(res => setBookings(res.data.bookings))
            .catch(err => console.error(err))
            .finally(() => setLoading(false));
    }, []);

    if (loading) return <div className="container">Loading...</div>;

    return (
        <div className="container">
            <h1 style={{ marginBottom: '20px' }}>My Bookings</h1>
            {bookings.length === 0 ? (
                <p>You haven't booked any sessions yet.</p>
            ) : (
                <div className="grid">
                    {bookings.map(b => (
                        <div key={b._id} className="card">
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
                                <h3>Tutor: {b.tutorId?.fullName}</h3>
                                <span className={`badge badge-${b.status}`}>{b.status.toUpperCase()}</span>
                            </div>
                            <p style={{ fontSize: '14px', marginBottom: '5px' }}>Subject: {b.subject}</p>
                            <p style={{ fontSize: '14px', marginBottom: '5px' }}>Date: {b.slotId?.date}</p>
                            <p style={{ fontSize: '14px', marginBottom: '10px' }}>Time: {b.slotId?.startTime} - {b.slotId?.endTime}</p>
                            
                            {b.status === 'confirmed' && b.meetingLink && (
                                <div style={{ marginTop: '15px', paddingTop: '15px', borderTop: '1px solid #e5e7eb' }}>
                                    <p style={{ fontSize: '12px', color: '#64748b', marginBottom: '8px' }}>Online Class Link:</p>
                                    <a href={b.meetingLink} target="_blank" rel="noreferrer" className="btn" style={{ display: 'block', textAlign: 'center', background: '#10b981' }}>
                                        Join Zoom/Meet Class
                                    </a>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}