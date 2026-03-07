import React, { useState, useRef } from 'react';
import axios from 'axios';
import { Camera, MapPin, Upload } from 'lucide-react';

const ReportHazard = () => {
    const [file, setFile] = useState(null);
    const [previewUrl, setPreviewUrl] = useState(null);
    const [location, setLocation] = useState({ lat: null, lng: null });
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState(null);
    const fileInputRef = useRef(null);

    const handleFileChange = (e) => {
        const selected = e.target.files[0];
        if (selected) {
            setFile(selected);
            setPreviewUrl(URL.createObjectURL(selected));
        }
    };

    const getLocation = () => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    setLocation({
                        lat: position.coords.latitude,
                        lng: position.coords.longitude
                    });
                },
                (error) => {
                    alert('Error getting location - please enable GPS');
                }
            );
        } else {
            alert('Geolocation is not supported by this browser.');
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!file) return alert('Please upload a photo of the hazard');
        if (!location.lat) return alert('Please get GPS location first');

        setLoading(true);

        const formData = new FormData();
        formData.append('file', file);
        formData.append('latitude', location.lat);
        formData.append('longitude', location.lng);
        formData.append('reporter_id', 'user1'); // Mock ID
        formData.append('road_type', 'local');

        try {
            const response = await axios.post('http://localhost:8000/api/hazard/report', formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            console.log(response.data);
            setResult(response.data);
        } catch (error) {
            console.error(error);
            alert('Failed to submit report');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="card" style={{ maxWidth: '600px', margin: '0 auto' }}>
            <h2 style={{ marginBottom: '1.5rem', color: 'var(--primary-blue)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Camera size={24} /> Report Road Hazard
            </h2>

            {!result ? (
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label className="form-label">Upload Evidence (Photo)</label>
                        <div
                            style={{ border: '2px dashed var(--primary-blue)', padding: '2rem', textAlign: 'center', borderRadius: '8px', cursor: 'pointer', background: '#F8F9FA' }}
                            onClick={() => fileInputRef.current.click()}
                        >
                            <Upload size={32} style={{ color: 'var(--primary-blue)', marginBottom: '1rem' }} />
                            <p>Click to browse or drag and drop</p>
                            <input type="file" ref={fileInputRef} hidden accept="image/*" onChange={handleFileChange} />
                        </div>
                        {previewUrl && <img src={previewUrl} alt="Preview" className="image-preview" />}
                    </div>

                    <div className="form-group">
                        <label className="form-label">Location (GPS coordinates)</label>
                        <div style={{ display: 'flex', gap: '1rem' }}>
                            <input
                                type="text"
                                className="input-field"
                                readOnly
                                value={location.lat ? `${location.lat}, ${location.lng}` : 'Location mandatory'}
                            />
                            <button type="button" className="btn btn-outline" onClick={getLocation}>
                                <MapPin size={18} /> Get GPS
                            </button>
                        </div>
                    </div>

                    <button type="submit" className="btn btn-primary" style={{ width: '100%', padding: '1rem', fontSize: '1.1rem' }} disabled={loading}>
                        {loading ? 'Analyzing with AI...' : 'Submit Hazard Details'}
                    </button>
                </form>
            ) : (
                <div style={{ textAlign: 'center', padding: '2rem' }}>
                    <div style={{ display: 'inline-block', padding: '1rem', background: '#D1FAE5', color: '#065F46', borderRadius: '50%', marginBottom: '1rem' }}>
                        <MapPin size={48} />
                    </div>
                    <h3 style={{ marginBottom: '1rem' }}>Report Successfully Submitted</h3>
                    <div className="card" style={{ background: '#F8F9FA', textAlign: 'left', marginBottom: '1rem' }}>
                        <h4 style={{ marginBottom: '0.5rem', color: 'var(--primary-blue)' }}>AI Analysis Results</h4>
                        {Object.entries(result.ai_analysis).map(([key, value]) => (
                            <p key={key}><strong>{key}:</strong> {value}</p>
                        ))}
                    </div>
                    <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem' }}>+10 points added to your civic profile.</p>
                    <button className="btn btn-primary" onClick={() => { setResult(null); setFile(null); setPreviewUrl(null); }}>
                        Report Another Hazard
                    </button>
                </div>
            )}
        </div>
    );
};

export default ReportHazard;
