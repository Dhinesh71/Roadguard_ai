import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Trophy, ShieldCheck, MapPin } from 'lucide-react';

const Leaderboard = () => {
    const [leaders, setLeaders] = useState([]);

    useEffect(() => {
        axios.get('http://localhost:8000/api/leaderboard')
            .then(res => setLeaders(res.data))
            .catch(err => console.error(err));
    }, []);

    return (
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
            <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
                <Trophy size={64} style={{ color: 'var(--accent-orange)' }} />
                <h2 style={{ color: 'var(--primary-blue)', marginTop: '1rem', fontSize: '2.5rem' }}>Top Civic Contributors</h2>
                <p style={{ color: 'var(--text-muted)' }}>The Tamil Nadu Road Safety Championship</p>
            </div>

            <ul className="leaderboard-list card" style={{ padding: 0 }}>
                {leaders.map((user, idx) => (
                    <li key={user.id} className="leaderboard-item">
                        <span className={`rank rank-${user.rank}`}>#{user.rank}</span>
                        <div className="user-info">
                            <div className="avatar">{user.name.charAt(0)}</div>
                            <div>
                                <h4 style={{ margin: 0 }}>{user.name}</h4>
                                <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                                    <MapPin size={12} /> {user.city}
                                </span>
                            </div>
                        </div>
                        <div style={{ textAlign: 'right', display: 'flex', gap: '1rem', alignItems: 'center' }}>
                            <div style={{ fontSize: '0.85rem', color: 'var(--success)', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                                <ShieldCheck size={16} /> {user.verified_reports} Verified
                            </div>
                            <div className="points-badge">
                                {user.total_points} PTS
                            </div>
                        </div>
                    </li>
                ))}
                {leaders.length === 0 && <li style={{ padding: '2rem', textAlign: 'center' }}>Loading Leaderboard...</li>}
            </ul>
        </div>
    );
};

export default Leaderboard;
