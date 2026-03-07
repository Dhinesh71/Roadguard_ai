import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const ProtectedRoute = ({ isProfilePage = false, adminRequired = false }) => {
    const { user, profile, loading } = useAuth();

    if (loading) {
        return (
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', flexDirection: 'column', gap: '1rem', color: 'var(--primary-blue)' }}>
                <div style={{ width: '40px', height: '40px', borderRadius: '50%', border: '4px solid #E5E7EB', borderTopColor: 'var(--accent-orange)', animation: 'spin 1s linear infinite' }}></div>
                <p>Authenticating...</p>
                <style>{`
          @keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
        `}</style>
            </div>
        );
    }

    // If no user, send to login
    if (!user) {
        return <Navigate to="/login" replace />;
    }

    // If user exists but no profile, send to profile setup. Except if we're ALREADY on the profile setup page.
    if (user && !profile && !isProfilePage) {
        return <Navigate to="/create-profile" replace />;
    }

    // If user HAS profile but tries to access Profile Create, redirect to home
    if (user && profile && isProfilePage) {
        return <Navigate to="/" replace />;
    }

    // If admin is required, check role
    if (adminRequired && profile && !['Moderator', 'Municipal Officer', 'Super Admin'].includes(profile.role)) {
        return <Navigate to="/" replace />;
    }

    return <Outlet />;
};

export default ProtectedRoute;
