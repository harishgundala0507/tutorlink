import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { searchTutors } from '../api';

const SUBJECTS = ['Mathematics', 'Physics', 'English', 'Guitar', 'Coding'];
const CITIES = ['Mumbai', 'Delhi', 'Bangalore', 'Pune', 'Hyderabad', 'Chennai'];

export default function Home({ user }) {
    const [tutors, setTutors] = useState([]);
    const [loading, setLoading] = useState(true);
    
    const [subject, setSubject] = useState('');
    const [location, setLocation] = useState('');
    const [maxPrice, setMaxPrice] = useState('');
    const [mode, setMode] = useState('');
    
    const navigate = useNavigate();

    const quotes = [
        "The beautiful thing about learning is that no one can take it away from you.",
        "Education is the most powerful weapon which you can use to change the world.",
        "Live as if you were to die tomorrow. Learn as if you were to live forever.",
        "The expert in anything was once a beginner."
    ];
    const randomQuote = quotes[Math.floor(Math.random() * quotes.length)];

    useEffect(() => {
        const fetchTutors = async () => {
            setLoading(true);
            try {
                const params = new URLSearchParams();
                if (subject) params.append('subject', subject);
                if (location) params.append('location', location);
                if (maxPrice) params.append('maxPrice', maxPrice);
                if (mode) params.append('mode', mode);

                const res = await searchTutors(params.toString());
                setTutors(res.data.tutors);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        
        const timeoutId = setTimeout(() => { fetchTutors(); }, 300);
        return () => clearTimeout(timeoutId);
    }, [subject, location, maxPrice, mode]);

    return (
        <div className="container">
            <div className="hero">
                <h1>{user ? `Welcome back, ${user.fullName.split(' ')[0]}! 👋` : 'Find Your Perfect Tutor Today 🎓'}</h1>
                <p>"{randomQuote}"</p>
            </div>

            <div className="card" style={{ display: 'flex', gap: '15px', flexWrap: 'wrap', alignItems: 'center', padding: '20px' }}>
                <h3 style={{ marginRight: '10px' }}>Filters:</h3>
                
                <select className="input" style={{ width: '180px', marginBottom: 0 }} value={subject} onChange={e => setSubject(e.target.value)}>
                    <option value="">All Subjects</option>
                    {SUBJECTS.map(s => <option key={s} value={s}>{s}</option>)}
                </select>

                <select className="input" style={{ width: '180px', marginBottom: 0 }} value={location} onChange={e => setLocation(e.target.value)}>
                    <option value="">All Locations</option>
                    {CITIES.map(c => <option key={c} value={c}>{c}</option>)}
                </select>

                <select className="input" style={{ width: '180px', marginBottom: 0 }} value={maxPrice} onChange={e => setMaxPrice(e.target.value)}>
                    <option value="">Any Price</option>
                    <option value="400">Under ₹400/hr</option>
                    <option value="600">Under ₹600/hr</option>
                    <option value="800">Under ₹800/hr</option>
                    <option value="1000">Under ₹1000/hr</option>
                </select>

                <select className="input" style={{ width: '180px', marginBottom: 0 }} value={mode} onChange={e => setMode(e.target.value)}>
                    <option value="">All Modes</option>
                    <option value="Online">Online Only</option>
                    <option value="Offline">Offline Only</option>
                </select>
                
                {(subject || location || maxPrice || mode) && (
                    <button className="btn" style={{ background: '#64748b' }} onClick={() => { setSubject(''); setLocation(''); setMaxPrice(''); setMode(''); }}>
                        Clear Filters
                    </button>
                )}
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', marginTop: '30px' }}>
                <h2 style={{ fontSize: '24px', fontWeight: '700' }}>Available Tutors ({tutors.length})</h2>
            </div>

            {loading ? (
                <p style={{ textAlign: 'center', marginTop: '40px', color: '#64748b' }}>Loading amazing tutors...</p>
            ) : tutors.length === 0 ? (
                <div className="card" style={{ textAlign: 'center', padding: '50px' }}>
                    <h3 style={{ color: '#64748b' }}>No tutors found</h3>
                    <p style={{ color: '#94a3b8', marginTop: '10px' }}>Try adjusting your filters to see more results.</p>
                </div>
            ) : (
                <div className="grid">
                    {tutors.map(tutor => (
                        <div 
                            key={tutor._id} 
                            className="card" 
                            onClick={() => navigate(`/tutors/${tutor._id}`)}
                            style={{ display: 'flex', flexDirection: 'column', padding: '24px', cursor: 'pointer' }}
                        >
                            <div className="avatar">
                                {tutor.fullName.charAt(0).toUpperCase()}
                            </div>
                            
                            <h3 style={{ fontSize: '20px', fontWeight: '700', marginBottom: '5px' }}>{tutor.fullName}</h3>
                            <p style={{ color: '#64748b', fontSize: '14px', marginBottom: '15px', display: 'flex', alignItems: 'center', gap: '5px' }}>
                                📍 {tutor.location || 'Online'}
                            </p>
                            
                            <div style={{ marginBottom: '15px', display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                                {tutor.subjects.length > 0 ? tutor.subjects.map(sub => (
                                    <span key={sub} style={{ background: '#f1f5f9', color: '#475569', padding: '4px 10px', borderRadius: '6px', fontSize: '12px', fontWeight: '600' }}>
                                        {sub}
                                    </span>
                                )) : (
                                    <span style={{ background: '#f1f5f9', color: '#475569', padding: '4px 10px', borderRadius: '6px', fontSize: '12px' }}>General</span>
                                )}
                                <span style={{ background: '#e0e7ff', color: '#4338ca', padding: '4px 10px', borderRadius: '6px', fontSize: '12px', fontWeight: '600' }}>
                                    💻 {tutor.teachingMode || 'Both'}
                                </span>
                            </div>

                            <p style={{ fontSize: '13px', color: '#64748b', marginBottom: '20px', fontStyle: 'italic', flexGrow: 1 }}>
                                "{tutor.bio || 'Ready to help you learn and grow!'}"
                            </p>

                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid #f1f5f9', paddingTop: '15px' }}>
                                <div>
                                    <span style={{ fontSize: '20px', fontWeight: '800', color: '#1e293b' }}>₹{tutor.hourlyRate}</span>
                                    <span style={{ fontSize: '12px', color: '#64748b' }}>/hr</span>
                                </div>
                                <button className="btn" style={{ padding: '8px 16px', fontSize: '13px' }}>Book Now</button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}