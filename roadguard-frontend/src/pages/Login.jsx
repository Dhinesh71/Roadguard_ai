import React, { useState } from 'react';
import { supabase } from '../supabaseClient';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, CheckCircle } from 'lucide-react';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [isOtpMode, setIsOtpMode] = useState(false);
    const [otpSent, setOtpSent] = useState(false);
    const [otp, setOtp] = useState('');
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        let authError = null;

        if (isOtpMode) {
            if (otpSent) {
                // Verify OTP
                const { error } = await supabase.auth.verifyOtp({
                    email,
                    token: otp,
                    type: 'magiclink',
                });
                authError = error;
            } else {
                // Send OTP
                const { error } = await supabase.auth.signInWithOtp({ email });
                if (!error) {
                    setOtpSent(true);
                    setLoading(false);
                    return;
                }
                authError = error;
            }
        } else {
            // Normal Password Login
            const { error } = await supabase.auth.signInWithPassword({ email, password });
            authError = error;
        }

        if (authError) {
            setError(authError.message);
        } else if (!isOtpMode || (isOtpMode && otpSent)) {
            navigate('/');
        }
        setLoading(false);
    };

    const handleGoogleLogin = async () => {
        setLoading(true);
        const { error } = await supabase.auth.signInWithOAuth({
            provider: 'google',
            options: { redirectTo: window.location.origin }
        });
        if (error) setError(error.message);
        setLoading(false);
    };

    return (
        <div className="auth-container animate-slide-up card" style={{ padding: '2.5rem' }}>
            <h2 style={{ color: 'var(--primary-blue)', marginBottom: '1.5rem', textAlign: 'center' }}>
                Welcome Back
            </h2>

            {error && <div className="badge badge-high" style={{ padding: '0.75rem', marginBottom: '1rem', display: 'block', textAlign: 'center' }}>{error}</div>}

            <form onSubmit={handleLogin}>
                <div className="form-group">
                    <label className="form-label">Email Address</label>
                    <div style={{ position: 'relative' }}>
                        <Mail size={18} style={{ position: 'absolute', top: '12px', left: '12px', color: 'var(--text-muted)' }} />
                        <input
                            type="email"
                            className="input-field"
                            style={{ paddingLeft: '2.5rem' }}
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>
                </div>

                {!isOtpMode && (
                    <div className="form-group">
                        <label className="form-label">Password</label>
                        <div style={{ position: 'relative' }}>
                            <Lock size={18} style={{ position: 'absolute', top: '12px', left: '12px', color: 'var(--text-muted)' }} />
                            <input
                                type="password"
                                className="input-field"
                                style={{ paddingLeft: '2.5rem' }}
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                        </div>
                    </div>
                )}

                {isOtpMode && otpSent && (
                    <div className="form-group">
                        <label className="form-label">6-Digit OTP</label>
                        <div style={{ position: 'relative' }}>
                            <CheckCircle size={18} style={{ position: 'absolute', top: '12px', left: '12px', color: 'var(--text-muted)' }} />
                            <input
                                type="text"
                                className="input-field"
                                style={{ paddingLeft: '2.5rem' }}
                                value={otp}
                                onChange={(e) => setOtp(e.target.value)}
                                required
                                placeholder="Enter OTP from email"
                            />
                        </div>
                    </div>
                )}

                <button type="submit" className="btn btn-primary" style={{ width: '100%', padding: '0.85rem', marginBottom: '1rem' }} disabled={loading}>
                    {loading ? 'Please wait...' : (!isOtpMode ? 'Sign In' : (otpSent ? 'Verify OTP' : 'Send OTP'))}
                </button>
            </form>

            <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', marginBottom: '1.5rem', fontSize: '0.9rem' }}>
                <button className="btn-outline" style={{ border: 'none', background: 'transparent', padding: 0 }} onClick={() => { setIsOtpMode(!isOtpMode); setOtpSent(false); setError(null); }}>
                    {isOtpMode ? 'Use Password' : 'Use Email OTP'}
                </button>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', margin: '1rem 0' }}>
                <div style={{ flex: 1, height: '1px', background: '#E5E7EB' }}></div>
                <span style={{ padding: '0 1rem', color: 'var(--text-muted)', fontSize: '0.85rem' }}>OR</span>
                <div style={{ flex: 1, height: '1px', background: '#E5E7EB' }}></div>
            </div>

            <button onClick={handleGoogleLogin} className="btn" style={{ width: '100%', background: 'white', color: '#333', border: '1px solid #CBD5E1', marginBottom: '1.5rem', fontWeight: 500 }} disabled={loading}>
                <img src="https://www.google.com/favicon.ico" alt="Google" style={{ width: 18, marginRight: '0.5rem' }} />
                Continue with Google
            </button>

            <p style={{ textAlign: 'center', fontSize: '0.9rem', color: 'var(--text-muted)' }}>
                Don't have an account? <Link to="/signup" style={{ color: 'var(--accent-orange)', fontWeight: 600 }}>Create Profile</Link>
            </p>
        </div>
    );
};

export default Login;
