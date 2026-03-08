import React, { useState } from 'react';
import { supabase } from '../supabaseClient';
import { Link, useNavigate } from 'react-router-dom';
import { User, Mail, Lock, CheckCircle } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

const Signup = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [otpSent, setOtpSent] = useState(false);
    const [otp, setOtp] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const navigate = useNavigate();
    const { user } = useAuth(); // Import useAuth hook

    useEffect(() => {
        if (user) {
            navigate('/');
        }
    }, [user, navigate]);

    const handleSignup = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        const { error } = await supabase.auth.signUp({
            email,
            password,
            options: {
                data: { name }
            }
        });

        if (error) {
            setError(error.message);
        } else {
            setOtpSent(true);
            setError(null);
        }
        setLoading(false);
    };

    const handleVerifyOtp = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        const { error } = await supabase.auth.verifyOtp({
            email,
            token: otp,
            type: 'signup', // Used for verifying signup OTP
        });

        if (error) {
            setError(error.message);
        } else {
            // Create session successful, redirect to profile setup
            navigate('/create-profile');
        }
        setLoading(false);
    };

    return (
        <div className="auth-container animate-slide-up card" style={{ padding: '2.5rem' }}>
            <h2 style={{ color: 'var(--primary-blue)', marginBottom: '1.5rem', textAlign: 'center' }}>
                Create an Account
            </h2>

            {error && <div className="badge badge-high" style={{ padding: '0.75rem', marginBottom: '1rem', display: 'block', textAlign: 'center' }}>{error}</div>}

            {!otpSent ? (
                <form onSubmit={handleSignup}>
                    <div className="form-group">
                        <label className="form-label">Full Name</label>
                        <div style={{ position: 'relative' }}>
                            <User size={18} style={{ position: 'absolute', top: '12px', left: '12px', color: 'var(--text-muted)' }} />
                            <input type="text" className="input-field" style={{ paddingLeft: '2.5rem' }} value={name} onChange={(e) => setName(e.target.value)} required />
                        </div>
                    </div>
                    <div className="form-group">
                        <label className="form-label">Email Address</label>
                        <div style={{ position: 'relative' }}>
                            <Mail size={18} style={{ position: 'absolute', top: '12px', left: '12px', color: 'var(--text-muted)' }} />
                            <input type="email" className="input-field" style={{ paddingLeft: '2.5rem' }} value={email} onChange={(e) => setEmail(e.target.value)} required />
                        </div>
                    </div>
                    <div className="form-group">
                        <label className="form-label">Password</label>
                        <div style={{ position: 'relative' }}>
                            <Lock size={18} style={{ position: 'absolute', top: '12px', left: '12px', color: 'var(--text-muted)' }} />
                            <input type="password" className="input-field" style={{ paddingLeft: '2.5rem' }} value={password} onChange={(e) => setPassword(e.target.value)} required minLength="6" />
                        </div>
                    </div>

                    <button type="submit" className="btn btn-primary" style={{ width: '100%', padding: '0.85rem', marginBottom: '1rem' }} disabled={loading}>
                        {loading ? 'Creating Profile...' : 'Sign Up'}
                    </button>
                </form>
            ) : (
                <form onSubmit={handleVerifyOtp}>
                    <div className="badge badge-medium" style={{ padding: '0.85rem', textAlign: 'center', marginBottom: '1.5rem', display: 'block' }}>
                        We've sent a 6-digit confirmation code to {email}.
                    </div>
                    <div className="form-group">
                        <label className="form-label">Enter OTP</label>
                        <div style={{ position: 'relative' }}>
                            <CheckCircle size={18} style={{ position: 'absolute', top: '12px', left: '12px', color: 'var(--text-muted)' }} />
                            <input type="text" className="input-field" style={{ paddingLeft: '2.5rem' }} value={otp} onChange={(e) => setOtp(e.target.value)} required />
                        </div>
                    </div>

                    <button type="submit" className="btn btn-primary" style={{ width: '100%', padding: '0.85rem', marginBottom: '1rem' }} disabled={loading}>
                        {loading ? 'Verifying...' : 'Verify Email'}
                    </button>
                </form>
            )}

            <p style={{ textAlign: 'center', fontSize: '0.9rem', color: 'var(--text-muted)', marginTop: '1rem' }}>
                Already a user? <Link to="/login" style={{ color: 'var(--accent-orange)', fontWeight: 600 }}>Log In Here</Link>
            </p>
        </div>
    );
};

export default Signup;
