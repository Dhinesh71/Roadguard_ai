import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { ShieldAlert, BarChart3, TrendingUp } from 'lucide-react';
import { supabase } from '../supabaseClient';

const API_URL = (import.meta.env.VITE_API_URL || 'http://localhost:8000').replace(/\/$/, '');

const AdminDashboard = () => {
    const [hazards, setHazards] = useState([]);
    const [predictions, setPredictions] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                const [hazardRes, riskRes] = await Promise.all([
                    supabase.from('hazard_reports').select('*').order('created_at', { ascending: false }),
                    axios.get(`${API_URL}/api/predict/risk`).catch(async () => {
                        console.warn("AI backend unreachable, falling back to static DB scores");
                        return await supabase.from('road_health_scores').select('*').limit(10);
                    }),
                ]);
                setHazards(Array.isArray(hazardRes.data) ? hazardRes.data : []);
                setPredictions(Array.isArray(riskRes.data) ? riskRes.data : []);
            } catch (err) {
                console.error('Error fetching admin data:', err);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    // Compute real stats from live data
    const highPriority = hazards.filter(h => h.severity_level === 'High').length;
    const pendingInspection = hazards.filter(h => h.status === 'Pending' || h.status === 'Inspection').length;
    const resolved = hazards.filter(h => h.status === 'Resolved' || h.status === 'Repair Scheduled').length;

    return (
        <div>
            <h2 style={{ color: 'var(--primary-blue)', display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '2rem' }}>
                <ShieldAlert size={28} /> Government & Contractor Panel
            </h2>

            {/* Real Stats computed from DB */}
            <div className="dashboard-stats" style={{ marginBottom: '3rem' }}>
                <div className="card" style={{ borderLeft: '4px solid #EF4444' }}>
                    <h4 style={{ color: '#EF4444', marginBottom: '0.5rem' }}>High Priority</h4>
                    <p style={{ fontSize: '2rem', fontWeight: 'bold' }}>{loading ? '...' : highPriority}</p>
                    <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>Require immediate repair</p>
                </div>
                <div className="card" style={{ borderLeft: '4px solid #F59E0B' }}>
                    <h4 style={{ color: '#F59E0B', marginBottom: '0.5rem' }}>Pending Inspection</h4>
                    <p style={{ fontSize: '2rem', fontWeight: 'bold' }}>{loading ? '...' : pendingInspection}</p>
                    <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>To be verified by officers</p>
                </div>
                <div className="card" style={{ borderLeft: '4px solid #10B981' }}>
                    <h4 style={{ color: '#10B981', marginBottom: '0.5rem' }}>Resolved</h4>
                    <p style={{ fontSize: '2rem', fontWeight: 'bold' }}>{loading ? '...' : resolved}</p>
                    <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>Community verified repairs</p>
                </div>
            </div>

            <div className="dashboard-grid">
                {/* Live Hazard Reports Table */}
                <div className="card">
                    <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.5rem', color: 'var(--primary-blue)' }}>
                        <BarChart3 size={20} /> Active Hazard Reports
                        <span style={{ marginLeft: 'auto', fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: 400 }}>
                            {hazards.length} total report{hazards.length !== 1 ? 's' : ''}
                        </span>
                    </h3>
                    {loading ? (
                        <p style={{ textAlign: 'center', color: 'var(--text-muted)', padding: '2rem' }}>Loading reports...</p>
                    ) : hazards.length === 0 ? (
                        <p style={{ textAlign: 'center', color: 'var(--text-muted)', padding: '2rem' }}>
                            No hazard reports yet. Citizens can submit reports using the "Report Hazard" button.
                        </p>
                    ) : (
                        <div className="table-container">
                            <table style={{ minWidth: '800px', width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                                <thead>
                                    <tr style={{ borderBottom: '2px solid #E5E7EB', color: 'var(--text-muted)' }}>
                                        <th style={{ padding: '1rem', fontWeight: 600 }}>Image</th>
                                        <th style={{ padding: '1rem', fontWeight: 600 }}>Type</th>
                                        <th style={{ padding: '1rem', fontWeight: 600 }}>Severity</th>
                                        <th style={{ padding: '1rem', fontWeight: 600 }}>Status</th>
                                        <th style={{ padding: '1rem', fontWeight: 600 }}>Est. Cost</th>
                                        <th style={{ padding: '1rem', fontWeight: 600 }}>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {hazards.map((h, i) => (
                                        <tr key={h.id || i} style={{ borderBottom: '1px solid #F3F4F6' }}>
                                            <td style={{ padding: '1rem' }}>
                                                <div style={{ width: '48px', height: '48px', borderRadius: '8px', overflow: 'hidden', background: '#E2E8F0' }}>
                                                    {h.image_url ? (
                                                        <img src={h.image_url} alt={h.hazard_type} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                                    ) : (
                                                        <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '10px', color: '#64748B' }}>No IMG</div>
                                                    )}
                                                </div>
                                            </td>
                                            <td style={{ padding: '1rem' }}>{h.hazard_type}</td>
                                            <td style={{ padding: '1rem' }}>
                                                <span className={`badge badge-${(h.severity_level || 'low').toLowerCase()}`}>
                                                    {h.severity_level} {h.severity_score ? `(${h.severity_score}/10)` : ''}
                                                </span>
                                            </td>
                                            <td style={{ padding: '1rem' }}>
                                                <span style={{ fontSize: '0.9rem', fontWeight: 500, color: h.status === 'Resolved' ? '#10B981' : h.status === 'Pending' ? '#F59E0B' : 'var(--text-muted)' }}>
                                                    {h.status}
                                                </span>
                                            </td>
                                            <td style={{ padding: '1rem' }}>₹{h.estimated_cost ? h.estimated_cost.toLocaleString() : '—'}</td>
                                            <td style={{ padding: '1rem' }}>
                                                <select
                                                    className="input-field"
                                                    style={{ padding: '0.25rem 0.5rem', fontSize: '0.85rem', width: 'auto', display: 'inline-block' }}
                                                    value={h.status}
                                                    onChange={async (e) => {
                                                        const newStatus = e.target.value;
                                                        try {
                                                            const updateRes = await supabase.from('hazard_reports').update({ status: newStatus }).eq('id', h.id).select();

                                                            // If marked resolved, update user verified count
                                                            if (newStatus === 'Resolved' && updateRes.data && updateRes.data[0]?.reporter_id) {
                                                                const reporterId = updateRes.data[0].reporter_id;
                                                                const pRes = await supabase.from('profiles').select('verified_reports').eq('id', reporterId).single();
                                                                if (pRes.data) {
                                                                    await supabase.from('profiles').update({ verified_reports: (pRes.data.verified_reports || 0) + 1 }).eq('id', reporterId);
                                                                }
                                                            }

                                                            // Update local state without refreshing map
                                                            setHazards(prev => prev.map(item => item.id === h.id ? { ...item, status: newStatus } : item));
                                                        } catch (err) {
                                                            console.error("Failed to update status", err);
                                                            alert("Error updating status");
                                                        }
                                                    }}
                                                >
                                                    <option value="Pending">Pending</option>
                                                    <option value="Inspection">Inspection</option>
                                                    <option value="Repair Scheduled">Repair Scheduled</option>
                                                    <option value="Resolved">Resolved</option>
                                                </select>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>

                {/* Predictive Risk Panel */}
                <div className="card" style={{ background: '#0F172A', color: 'white' }}>
                    <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.5rem', color: '#38BDF8' }}>
                        <TrendingUp size={20} /> Predictive Risk Map
                    </h3>
                    <p style={{ fontSize: '0.9rem', color: '#94A3B8', marginBottom: '1rem' }}>
                        AI-generated risk predictions based on road health scores.
                    </p>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        {loading ? (
                            <p style={{ color: '#64748B', textAlign: 'center' }}>Loading predictions...</p>
                        ) : predictions.length === 0 ? (
                            <p style={{ color: '#64748B', textAlign: 'center', padding: '1rem' }}>
                                No road health scores yet. Add data to the <code style={{ color: '#38BDF8' }}>road_health_scores</code> table in Supabase.
                            </p>
                        ) : (
                            predictions.map((p, i) => {
                                const level = p.risk_level || p.category || 'Low';
                                const color = (level === 'High' || level === 'Poor') ? '#EF4444' : (level === 'Medium' || level === 'Moderate') ? '#F59E0B' : '#10B981';
                                const scoreText = p.confidence_pct ? `${p.confidence_pct}% Confidence` : `Score: ${p.health_score}`;

                                return (
                                    <div key={p.id || i} style={{ padding: '1rem', background: 'rgba(255,255,255,0.05)', borderRadius: '8px', borderLeft: `3px solid ${color}`, marginBottom: '0.5rem' }}>
                                        <h4 style={{ margin: '0 0 0.5rem 0', display: 'flex', justifyContent: 'space-between' }}>
                                            {p.road_name}
                                            <span style={{ fontSize: '0.8rem', color: color, padding: '2px 8px', background: `${color}20`, borderRadius: '12px' }}>
                                                {level} — {scoreText}
                                            </span>
                                        </h4>
                                        {p.reason && (
                                            <p style={{ margin: 0, fontSize: '0.85rem', color: '#94A3B8' }}>{p.reason}</p>
                                        )}
                                        {p.risk_breakdown && (
                                            <div style={{ display: 'flex', gap: '1rem', marginTop: '0.5rem', fontSize: '0.8rem' }}>
                                                <span style={{ color: p.risk_breakdown.High > 50 ? '#EF4444' : '#64748B' }}>High: {p.risk_breakdown.High}%</span>
                                                <span style={{ color: p.risk_breakdown.Medium > 50 ? '#F59E0B' : '#64748B' }}>Med: {p.risk_breakdown.Medium}%</span>
                                            </div>
                                        )}
                                    </div>
                                );
                            })
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;
