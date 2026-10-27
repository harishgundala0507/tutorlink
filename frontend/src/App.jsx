import { BrowserRouter, Routes, Route, Navigate, Link, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { getMe, logoutUser } from './api';

import Login from './pages/Login';
import Register from './pages/Register';
import Home from './pages/Home';
import TutorDetail from './pages/TutorDetail';
import MyBookings from './pages/MyBookings';
import TutorDashboard from './pages/TutorDashboard';

function App() {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        getMe().then(res => setUser(res.data)).catch(() => setUser(null)).finally(() => setLoading(false));
    }, []);

    const handleLogout = async () => {
        await logoutUser();
        setUser(null);
        navigate('/login');
    };

    if (loading) return <div style={{ textAlign: 'center', marginTop: '50px' }}>Loading...</div>;

    return (
        <div>
            <nav className="nav">
                <Link to="/" style={{ fontSize: '20px', fontWeight: 'bold' }}>🎓 TutorLink</Link>
                <div>
                    {user ? (
                        <>
                            <span style={{ marginRight: '15px' }}>Hi, {user.fullName} ({user.role})</span>
                            {user.role === 'student' && <Link to="/my-bookings">My Bookings</Link>}
                            {user.role === 'tutor' && <Link to="/dashboard">Tutor Dashboard</Link>}
                            <button onClick={handleLogout} className="btn btn-danger" style={{ marginLeft: '15px' }}>Logout</button>
                        </>
                    ) : (
                        <>
                            <Link to="/login">Login</Link>
                            <Link to="/register" className="btn">Register</Link>
                        </>
                    )}
                </div>
            </nav>

            <Routes>
                <Route path="/" element={<Home user={user} />} />
                <Route path="/login" element={!user ? <Login setUser={setUser} /> : <Navigate to="/" />} />
                <Route path="/register" element={!user ? <Register setUser={setUser} /> : <Navigate to="/" />} />
                
                <Route path="/tutors/:id" element={user?.role === 'student' ? <TutorDetail /> : <Navigate to="/" />} />
                <Route path="/my-bookings" element={user?.role === 'student' ? <MyBookings /> : <Navigate to="/" />} />
                <Route path="/dashboard" element={user?.role === 'tutor' ? <TutorDashboard /> : <Navigate to="/" />} />
            </Routes>
        </div>
    );
}

export default function AppWrapper() {
    return (
        <BrowserRouter>
            <App />
        </BrowserRouter>
    );
}