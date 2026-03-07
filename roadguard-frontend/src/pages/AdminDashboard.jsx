import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Eye, Edit3, ShieldAlert, BarChart3, TrendingUp } from 'lucide-react';

const AdminDashboard = () => {
    const [hazards, setHazards] = useState([]);
    const [predictions, setPredictions] = useState([]);

    useEffect(() => {
        axios.get('http://localhost:8000/api/hazards')
            .then(res => setHazards(res.data))
            .catch(err => console.error(err));

        axios.get('http://localhost:8000/api/predict/risk')
            .then(res => setPredictions(res.data))
            .catch(err => console.error(err));
    }, []);

    return (
        <div>
            <h2 style={{ color: 'var(--primary-blue)', display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '2rem' }}>
                <ShieldAlert size={28} /> Government & Contractor Panel
            </h2>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1.5rem', marginBottom: '3rem' }}>
                <div className="card" style={{ borderLeft: '4px solid #EF4444' }}>
                    <h4 style={{ color: '#EF4444', marginBottom: '0.5rem' }}>High Priority</h4>
                    <p style={{ fontSize: '2rem', fontWeight: 'bold' }}>24</p>
                    <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>Require immediate repair</p>
                </div>
                <div className="card" style={{ borderLeft: '4px solid #F59E0B' }}>
                    <h4 style={{ color: '#F59E0B', marginBottom: '0.5rem' }}>Pending Inspection</h4>
                    <p style={{ fontSize: '2rem', fontWeight: 'bold' }}>18</p>
                    <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>To be verified by officers</p>
                </div>
                <div className="card" style={{ borderLeft: '4px solid #10B981' }}>
                    <h4 style={{ color: '#10B981', marginBottom: '0.5rem' }}>Resolved</h4>
                    <p style={{ fontSize: '2rem', fontWeight: 'bold' }}>150+</p>
                    <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>Community verified repairs</p>
                </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '2rem' }}>
                <div className="card">
                    <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.5rem', color: 'var(--primary-blue)' }}>
                        <BarChart3 size={20} /> Active Hazard Reports
                    </h3>
                    <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                        <thead>
                            <tr style={{ borderBottom: '2px solid #E5E7EB', color: 'var(--text-muted)' }}>
                                <th style={{ padding: '1rem', fontWeight: 600 }}>Type</th>
                                <th style={{ padding: '1rem', fontWeight: 600 }}>Severity</th>
                                <th style={{ padding: '1rem', fontWeight: 600 }}>Status</th>
                                <th style={{ padding: '1rem', fontWeight: 600 }}>Est. Cost</th>
                                <th style={{ padding: '1rem', fontWeight: 600 }}>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {hazards.map((h, i) => (
                                <tr key={i} style={{ borderBottom: '1px solid #F3F4F6' }}>
                                    <td style={{ padding: '1rem' }}>{h.hazard_type}</td>
                                    <td style={{ padding: '1rem' }}>
                                        <span className={`badge badge-${h.severity_level.toLowerCase()}`}>{h.severity_level} (Score: {h.severity_score})</span>
                                    </td>
                                    <td style={{ padding: '1rem' }}>{h.status}</td>
                                    <td style={{ padding: '1rem' }}>₹{h.estimated_cost || 3500}</td>
                                    <td style={{ padding: '1rem' }}>
                                        <button className="btn btn-outline" style={{ padding: '0.25rem 0.5rem', fontSize: '0.85rem' }}>
                                            Update Status
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                <div className="card" style={{ background: '#0F172A', color: 'white' }}>
                    <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.5rem', color: '#38BDF8' }}>
                        <TrendingUp size={20} /> Predictive Risk Map
                    </h3>
                    <p style={{ fontSize: '0.9rem', color: '#94A3B8', marginBottom: '1rem' }}>
                        AI-generated predictions for hazards in the next 30 days based on traffic and weather models.
                    </p>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        {predictions.map((p, i) => (
                            <div key={i} style={{ padding: '1rem', background: 'rgba(255,255,255,0.05)', borderRadius: '8px', borderLeft: `3px solid ${p.risk_level === 'High' ? '#EF4444' : '#F59E0B'}` }}>
                                <h4 style={{ margin: '0 0 0.5rem 0', display: 'flex', justifyContent: 'space-between' }}>
                                    {p.road_name}
                                    <span style={{ fontSize: '0.8rem', color: p.risk_level === 'High' ? '#EF4444' : '#F59E0B' }}>
                                        {p.risk_level} Risk
                                    </span>
                                </h4>
                                <p style={{ margin: 0, fontSize: '0.85rem', color: '#CBD5E1' }}>{p.reason}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;
