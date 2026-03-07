import React, { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';
import { useNavigate } from 'react-router-dom';
import { User, MapPin, Navigation, Edit3, Image as ImageIcon } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

const ProfileCreate = () => {
    const { user, profile, setProfile } = useAuth();
    const navigate = useNavigate();

    const [name, setName] = useState('');
    const [city, setCity] = useState('');
    const [district, setDistrict] = useState('');
    const [bio, setBio] = useState('');
    const [imageFile, setImageFile] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        // If we're an existing profile and somehow ended up here, or unauth, redirect appropriately
        if (!user) {
            navigate('/login');
        } else if (profile) {
            navigate('/');
        } else if (user.user_metadata?.name) {
            // Pre-fill from Google OAuth
            setName(user.user_metadata.name);
        }
    }, [user, profile, navigate]);

    const handleCreateProfile = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            let profile_photo_url = user?.user_metadata?.avatar_url || null;

            // 1. Upload Profile Image
            if (imageFile) {
                const fileExt = imageFile.name.split('.').pop();
                const fileName = `${user.id}-${Math.random()}.${fileExt}`;
                const filePath = `avatars/${fileName}`;

                const { error: uploadError } = await supabase.storage
                    .from('profiles')
                    .upload(filePath, imageFile);

                if (uploadError) throw uploadError;

                const { data } = supabase.storage.from('profiles').getPublicUrl(filePath);
                profile_photo_url = data.publicUrl;
            }

            // 2. Save Profile Data
            const profileData = {
                id: user.id,
                email: user.email,
                name: name,
                city: city || 'Chennai',
                district: district || null,
                bio: bio || null,
                profile_photo: profile_photo_url,
                total_reports: 0,
                verified_reports: 0,
                total_points: 0,
                role: 'Citizen',
                created_at: new Date()
            };

            const { error: dbError } = await supabase.from('profiles').insert([profileData]);

            if (dbError) {
                if (dbError.message && (dbError.message.includes('bio') || dbError.message.includes('district') || dbError.message.includes('column'))) {
                    // Fallback: If hackathon user forgot to run the new schema SQL, auto-drop the columns
                    const fallbackData = { ...profileData };
                    delete fallbackData.district;
                    delete fallbackData.bio;

                    const { error: fallbackError } = await supabase.from('profiles').insert([fallbackData]);
                    if (fallbackError) throw fallbackError;

                    profileData.district = null;
                    profileData.bio = null;
                } else {
                    throw dbError;
                }
            }

            // Update Global State
            setProfile(profileData);

            // Redirect to Main Dashboard
            navigate('/');

        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="card animate-slide-up" style={{ maxWidth: '600px', margin: '2rem auto', padding: '2.5rem' }}>
            <h2 style={{ color: 'var(--primary-blue)', marginBottom: '1.5rem', textAlign: 'center', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
                <User size={28} /> Complete Your Civic Profile
            </h2>
            <p style={{ textAlign: 'center', color: 'var(--text-muted)', marginBottom: '2rem' }}>
                Before you can report hazards and earn points, we need a few details.
            </p>

            {error && <div className="badge badge-high" style={{ padding: '0.75rem', marginBottom: '1.5rem', display: 'block', textAlign: 'center' }}>{error}</div>}

            <form onSubmit={handleCreateProfile}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>

                    <div className="form-group" style={{ gridColumn: 'span 2' }}>
                        <label className="form-label">Full Name</label>
                        <div style={{ position: 'relative' }}>
                            <User size={18} style={{ position: 'absolute', top: '12px', left: '12px', color: 'var(--text-muted)' }} />
                            <input type="text" className="input-field" style={{ paddingLeft: '2.5rem' }} value={name} onChange={(e) => setName(e.target.value)} required placeholder="Pradeep Kumar" />
                        </div>
                    </div>

                    <div className="form-group">
                        <label className="form-label">City</label>
                        <div style={{ position: 'relative' }}>
                            <MapPin size={18} style={{ position: 'absolute', top: '12px', left: '12px', color: 'var(--text-muted)' }} />
                            <input type="text" className="input-field" style={{ paddingLeft: '2.5rem' }} value={city} onChange={(e) => setCity(e.target.value)} required placeholder="e.g. Chennai" />
                        </div>
                    </div>

                    <div className="form-group">
                        <label className="form-label">District</label>
                        <div style={{ position: 'relative' }}>
                            <Navigation size={18} style={{ position: 'absolute', top: '12px', left: '12px', color: 'var(--text-muted)' }} />
                            <input type="text" className="input-field" style={{ paddingLeft: '2.5rem' }} value={district} onChange={(e) => setDistrict(e.target.value)} required placeholder="e.g. Kanchipuram" />
                        </div>
                    </div>

                    <div className="form-group" style={{ gridColumn: 'span 2' }}>
                        <label className="form-label">Short Bio (Optional)</label>
                        <div style={{ position: 'relative' }}>
                            <Edit3 size={18} style={{ position: 'absolute', top: '12px', left: '12px', color: 'var(--text-muted)' }} />
                            <input type="text" className="input-field" style={{ paddingLeft: '2.5rem' }} value={bio} onChange={(e) => setBio(e.target.value)} placeholder="Passionate about road safety..." />
                        </div>
                    </div>

                    <div className="form-group" style={{ gridColumn: 'span 2' }}>
                        <label className="form-label">Profile Image (Optional)</label>
                        <div style={{ position: 'relative' }}>
                            <ImageIcon size={18} style={{ position: 'absolute', top: '12px', left: '12px', color: 'var(--text-muted)' }} />
                            <input type="file" accept="image/*" className="input-field" style={{ paddingLeft: '2.5rem', paddingTop: '0.5rem', paddingBottom: '0.5rem' }} onChange={(e) => setImageFile(e.target.files[0])} />
                        </div>
                    </div>

                </div>

                <button type="submit" className="btn btn-primary" style={{ width: '100%', padding: '1rem', marginTop: '1rem', fontSize: '1.1rem' }} disabled={loading}>
                    {loading ? 'Setting up Profile...' : 'Save Profile & Enter Platform'}
                </button>
            </form>
        </div>
    );
};

export default ProfileCreate;
