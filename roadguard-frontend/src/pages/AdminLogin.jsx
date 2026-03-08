import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ShieldAlert, Lock, User } from 'lucide-react';

// These are stored only in the built bundle — not in DB, good for internal-only access
const ADMIN_USERNAME = 'tnroadguard';
const ADMIN_PASSWORD = 'tnroadguard';
const ADMIN_SESSION_KEY = 'tnrg_admin_session';

const AdminLogin = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleLogin = (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        // Simulate a brief check delay
        setTimeout(() => {
            if (username === ADMIN_USERNAME && password === ADMIN_PASSWORD) {
                sessionStorage.setItem(ADMIN_SESSION_KEY, 'true');
                navigate('/tnrg-control-panel/dashboard');
            } else {
                setError('Invalid credentials. Access denied.');
            }
            setLoading(false);
        }, 600);
    };

    return (
        <div style={{
            minHeight: '100vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: '#0A0F1E',
            padding: '1rem'
        }}>
            <div style={{
                background: '#0F172A',
                border: '1px solid #1E293B',
                borderRadius: '16px',
                padding: '2.5rem',
                width: '100%',
                maxWidth: '420px',
                boxShadow: '0 25px 50px rgba(0,0,0,0.5)'
            }}>
                <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
                    <div style={{
                        width: '60px', height: '60px', borderRadius: '50%',
                        background: 'rgba(249,115,22,0.15)', display: 'flex',
                        alignItems: 'center', justifyContent: 'center',
                        margin: '0 auto 1rem'
                    }}>
                        <ShieldAlert size={30} color="#F97316" />
                    </div>
                    <h2 style={{ color: '#F8FAFC', margin: 0, fontSize: '1.4rem' }}>
                        Government Control Panel
                    </h2>
                    <p style={{ color: '#64748B', fontSize: '0.85rem', marginTop: '0.5rem' }}>
                        Authorized personnel only
                    </p>
                </div>

                {error && (
                    <div style={{
                        background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)',
                        borderRadius: '8px', padding: '0.75rem', color: '#EF4444',
                        fontSize: '0.9rem', textAlign: 'center', marginBottom: '1.5rem'
                    }}>
                        {error}
                    </div>
                )}

                <form onSubmit={handleLogin}>
                    <div style={{ marginBottom: '1.25rem' }}>
                        <label style={{ display: 'block', color: '#94A3B8', fontSize: '0.85rem', marginBottom: '0.5rem' }}>
                            Username
                        </label>
                        <div style={{ position: 'relative' }}>
                            <User size={16} style={{ position: 'absolute', top: '50%', left: '12px', transform: 'translateY(-50%)', color: '#475569' }} />
                            <input
                                type="text"
                                value={username}
                                onChange={e => setUsername(e.target.value)}
                                required
                                autoComplete="off"
                                style={{
                                    width: '100%', padding: '0.75rem 0.75rem 0.75rem 2.5rem',
                                    background: '#1E293B', border: '1px solid #334155',
                                    borderRadius: '8px', color: '#F8FAFC', fontSize: '0.95rem',
                                    outline: 'none', boxSizing: 'border-box'
                                }}
                            />
                        </div>
                    </div>

                    <div style={{ marginBottom: '1.75rem' }}>
                        <label style={{ display: 'block', color: '#94A3B8', fontSize: '0.85rem', marginBottom: '0.5rem' }}>
                            Password
                        </label>
                        <div style={{ position: 'relative' }}>
                            <Lock size={16} style={{ position: 'absolute', top: '50%', left: '12px', transform: 'translateY(-50%)', color: '#475569' }} />
                            <input
                                type="password"
                                value={password}
                                onChange={e => setPassword(e.target.value)}
                                required
                                style={{
                                    width: '100%', padding: '0.75rem 0.75rem 0.75rem 2.5rem',
                                    background: '#1E293B', border: '1px solid #334155',
                                    borderRadius: '8px', color: '#F8FAFC', fontSize: '0.95rem',
                                    outline: 'none', boxSizing: 'border-box'
                                }}
                            />
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        style={{
                            width: '100%', padding: '0.85rem',
                            background: loading ? '#374151' : 'linear-gradient(135deg, #F97316, #EA580C)',
                            color: 'white', border: 'none', borderRadius: '8px',
                            fontWeight: 600, fontSize: '1rem', cursor: loading ? 'not-allowed' : 'pointer',
                            transition: 'opacity 0.2s'
                        }}
                    >
                        {loading ? 'Verifying...' : 'Access Control Panel'}
                    </button>
                </form>
            </div>
        </div>
    );
};

export { ADMIN_SESSION_KEY };
export default AdminLogin;
