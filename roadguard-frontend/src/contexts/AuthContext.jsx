// @refresh reset
import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '../supabaseClient';

const AuthContext = createContext({});

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);
    const [profileLoading, setProfileLoading] = useState(false);
    const currentUserId = React.useRef(null);

    const fetchProfile = async (userId) => {
        setProfileLoading(true);
        try {
            const { data, error } = await supabase
                .from('profiles')
                .select('*')
                .eq('id', userId)
                .single();

            if (error && error.code !== 'PGRST116') {
                console.error('Error fetching profile:', error);
            }

            setProfile(data || null);
        } catch (err) {
            console.error(err);
        } finally {
            setProfileLoading(false);
        }
    };

    useEffect(() => {
        let isMounted = true;

        // Safety timeout: force UI render if Supabase network hangs
        const timeout = setTimeout(() => {
            if (isMounted) setLoading(false);
        }, 4000);

        const initSession = async () => {
            try {
                const { data: { session }, error } = await supabase.auth.getSession();
                if (session?.user && isMounted) {
                    currentUserId.current = session.user.id;
                    setUser(session.user);
                    // Don't await profile fetch here so UI unblocks instantly
                    fetchProfile(session.user.id);
                }
            } catch (err) {
                console.error("Auth init error:", err);
            } finally {
                if (isMounted) {
                    clearTimeout(timeout);
                    setLoading(false);
                }
            }
        };

        // Initialize synchronously on mount
        initSession();

        // Listen for subsequent changes (login/logout from other tabs/events)
        const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, session) => {
            if (!isMounted) return;

            if (session?.user) {
                if (session.user.id !== currentUserId.current) {
                    currentUserId.current = session.user.id;
                    setUser(session.user);
                    fetchProfile(session.user.id);
                }
            } else {
                currentUserId.current = null;
                setUser(null);
                setProfile(null);
            }
            // If it was already loaded, this ensures it stays false
            setLoading(false);
        });

        return () => {
            isMounted = false;
            clearTimeout(timeout);
            subscription?.unsubscribe();
        };
    }, []);

    const value = {
        user,
        profile,
        loading,
        profileLoading,
        setProfile, // useful for updating profile state after creation
        signOut: () => supabase.auth.signOut(),
    };

    if (loading) {
        return (
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', flexDirection: 'column', gap: '1rem', background: '#F8FAFC' }}>
                <div style={{ width: '48px', height: '48px', borderRadius: '50%', border: '4px solid #E5E7EB', borderTopColor: '#F97316', animation: 'spin 0.8s linear infinite' }}></div>
                <p style={{ color: '#64748B', fontFamily: 'Inter, sans-serif', fontSize: '0.95rem' }}>Loading RoadGuard AI...</p>
                <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
            </div>
        );
    }

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
    return useContext(AuthContext);
};
