import React from 'react';
import { Link } from 'react-router-dom';
import { Map, AlertTriangle, User, Trophy, Shield, LogOut } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

const Navbar = () => {
    const { user, profile, signOut } = useAuth();

    return (
        <nav className="navbar">
            <Link to="/" className="nav-brand">
                <Shield size={28} />
                RoadGuard <span>AI</span>
            </Link>

            <div className="nav-links">
                {profile ? (
                    <>
                        <Link to="/map" className="nav-link" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <Map size={18} /> Hazard Map
                        </Link>
                        <Link to="/leaderboard" className="nav-link" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <Trophy size={18} /> Leaderboard
                        </Link>


                        <Link to="/report" className="btn btn-accent">
                            <AlertTriangle size={18} /> Report Hazard
                        </Link>

                        <Link to="/profile" className="btn btn-outline" style={{ background: 'transparent', borderColor: '#FFFFFF', color: '#FFFFFF', padding: '0.5rem 1rem' }}>
                            {profile?.profile_photo ? (
                                <img src={profile.profile_photo} alt="Profile" style={{ width: 24, height: 24, borderRadius: '50%', objectFit: 'cover' }} />
                            ) : (
                                <User size={18} />
                            )}
                            {profile?.name ? profile.name.split(' ')[0] : 'User'}
                        </Link>

                        <button onClick={signOut} className="btn" style={{ background: 'transparent', color: 'var(--text-muted)', padding: '0.25rem' }}>
                            <LogOut size={20} />
                        </button>
                    </>
                ) : (
                    <>
                        {!user ? (
                            <>
                                <Link to="/login" className="nav-link">Log In</Link>
                                <Link to="/signup" className="btn btn-accent">Sign Up for Free</Link>
                            </>
                        ) : (
                            // User exists but no profile yet (in profile creation phase)
                            <button onClick={signOut} className="btn" style={{ background: 'transparent', color: 'var(--text-muted)', padding: '0.25rem' }}>
                                <LogOut size={20} /> Logout
                            </button>
                        )}
                    </>
                )}
            </div>
        </nav>
    );
};

export default Navbar;
