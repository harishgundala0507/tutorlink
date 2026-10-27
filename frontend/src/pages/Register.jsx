import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { registerUser, getMe } from '../api';

export default function Register({ setUser }) {
    const [form, setForm] = useState({ fullName: '', email: '', password: '', phone: '', role: 'student' });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true); setError('');
        try {
            await registerUser(form);
            const res = await getMe();
            setUser(res.data);
            navigate('/');
        } catch (err) {
            setError(err.response?.data?.message || 'Registration failed');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container" style={{ maxWidth: '400px', marginTop: '50px' }}>
            <div className="card">
                <h2 style={{ marginBottom: '20px' }}>Create an Account</h2>
                {error && <div style={{ color: 'red', marginBottom: '10px' }}>{error}</div>}
                <form onSubmit={handleSubmit}>
                    <input className="input" placeholder="Full Name" value={form.fullName} onChange={e => setForm({...form, fullName: e.target.value})} required />
                    <input className="input" type="email" placeholder="Email" value={form.email} onChange={e => setForm({...form, email: e.target.value})} required />
                    <input className="input" type="password" placeholder="Password (min 6 chars)" value={form.password} onChange={e => setForm({...form, password: e.target.value})} required />
                    <input className="input" placeholder="Phone Number" value={form.phone} onChange={e => setForm({...form, phone: e.target.value})} required />
                    
                    <div style={{ marginBottom: '15px' }}>
                        <label style={{ marginRight: '15px' }}><input type="radio" name="role" value="student" checked={form.role === 'student'} onChange={e => setForm({...form, role: e.target.value})} /> Student</label>
                        <label><input type="radio" name="role" value="tutor" checked={form.role === 'tutor'} onChange={e => setForm({...form, role: e.target.value})} /> Tutor</label>
                    </div>

                    <button className="btn" style={{ width: '100%' }} disabled={loading}>{loading ? 'Registering...' : 'Register'}</button>
                </form>
                <p style={{ marginTop: '15px', fontSize: '14px' }}>Already have an account? <Link to="/login">Login here</Link></p>
            </div>
        </div>
    );
}