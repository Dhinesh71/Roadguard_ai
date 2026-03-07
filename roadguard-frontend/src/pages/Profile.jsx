import React, { useEffect, useState } from 'react';
import { supabase } from '../supabaseClient';
import { Camera, MapPin, Award, CheckCircle, Navigation, MessageSquare } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useParams } from 'react-router-dom';

const Profile = () => {
    const { profile: currentUserProfile, user } = useAuth();
    const { id } = useParams();

    const [displayProfile, setDisplayProfile] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // If viewing own profile
        if (!id || id === currentUserProfile?.id) {
            setDisplayProfile(currentUserProfile);
            setLoading(false);
            return;
        }

        // Fetch public profile by ID
        const fetchPublicProfile = async () => {
            try {
                const { data, error } = await supabase
                    .from('profiles')
                    .select('*')
                    .eq('id', id)
                    .single();

                if (data) setDisplayProfile(data);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchPublicProfile();
    }, [id, currentUserProfile]);

    if (loading) return <div style={{ textAlign: 'center', padding: '4rem' }}>Loading Profile...</div>;
    if (!displayProfile) return <div style={{ textAlign: 'center', padding: '4rem' }}>Profile not found</div>;

    return (
        <div className="card animate-slide-up" style={{ maxWidth: '600px', margin: '2rem auto' }}>
            <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
                <div style={{
                    width: '120px', height: '120px',
                    background: 'var(--primary-blue)',
                    color: 'white',
                    borderRadius: '50%',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: '3rem', margin: '0 auto 1rem',
                    boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
                    overflow: 'hidden'
                }}>
                    {displayProfile.profile_photo ? (
                        <img src={displayProfile.profile_photo} alt="Profile" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    ) : (
                        displayProfile.name.charAt(0)
                    )}
                </div>
                <h2 style={{ color: 'var(--text-dark)' }}>{displayProfile.name}</h2>
                <p style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.25rem', color: 'var(--text-muted)' }}>
                    <MapPin size={16} /> {displayProfile.city}{displayProfile.district ? `, ${displayProfile.district}` : ''}
                </p>

                {displayProfile.bio && (
                    <p style={{ marginTop: '1rem', fontStyle: 'italic', color: 'var(--secondary-blue)' }}>
                        "{displayProfile.bio}"
                    </p>
                )}
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1.5rem', marginBottom: '2rem' }}>
                <div className="card" style={{ background: '#F8FAFC', textAlign: 'center', padding: '1.5rem' }}>
                    <Award size={32} style={{ color: 'var(--accent-orange)', margin: '0 auto 0.5rem' }} />
                    <h3 style={{ fontSize: '2rem', color: 'var(--primary-blue)' }}>{displayProfile.total_points || 0}</h3>
                    <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Total Points</p>
                </div>
                <div className="card" style={{ background: '#F8FAFC', textAlign: 'center', padding: '1.5rem' }}>
                    <CheckCircle size={32} style={{ color: 'var(--success)', margin: '0 auto 0.5rem' }} />
                    <h3 style={{ fontSize: '2rem', color: 'var(--primary-blue)' }}>{displayProfile.verified_reports || 0}</h3>
                    <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Verified Reports</p>
                </div>
            </div>

            <div style={{ background: '#FFF7ED', border: '1px solid #FFEDD5', borderRadius: '8px', padding: '1.5rem', textAlign: 'center' }}>
                <h4 style={{ color: '#C2410C', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
                    <Camera size={20} /> Current State Contributor
                </h4>
                <p style={{ color: '#9A3412', marginTop: '0.5rem', fontSize: '0.9rem' }}>
                    Total Hazards Reported: <strong>{displayProfile.total_reports || 0}</strong>
                </p>
            </div>
        </div>
    );
};

export default Profile;
