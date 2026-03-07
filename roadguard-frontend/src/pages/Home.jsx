import React from 'react';
import { Link } from 'react-router-dom';
import { Camera, MapPin, Award, ArrowRight } from 'lucide-react';

const Home = () => {
    return (
        <div className="animate-slide-up">
            <section className="hero-section">
                <h1 className="hero-title">Smart Road Hazard <span>Intelligence System</span></h1>
                <p className="hero-subtitle">
                    Join the Tamil Nadu community in making our roads safer. Use AI to report potholes, track repairs, and ensure contractor accountability.
                </p>
                <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
                    <Link to="/report" className="btn btn-accent" style={{ fontSize: '1.25rem' }}>
                        Report a Hazard <ArrowRight size={20} />
                    </Link>
                    <Link to="/map" className="btn btn-outline" style={{ background: 'rgba(255,255,255,0.1)', borderColor: 'white', color: 'white', fontSize: '1.25rem' }}>
                        View Hazard Map
                    </Link>
                </div>
            </section>

            <section>
                <h2 style={{ textAlign: 'center', marginBottom: '2rem', color: 'var(--primary-blue)' }}>How It Works</h2>
                <div className="features-grid">
                    <div className="card feature-card">
                        <Camera size={48} className="feature-icon" />
                        <h3>1. Snap & Upload</h3>
                        <p>Take a picture of a pothole or road damage. Our YOLOv8 AI detects the hazard and calculates severity instantly.</p>
                    </div>
                    <div className="card feature-card">
                        <MapPin size={48} className="feature-icon" />
                        <h3>2. Map & Monitor</h3>
                        <p>Hazards are mapped out publicly. Authorities use predictive analytics to prioritize high-risk zones.</p>
                    </div>
                    <div className="card feature-card">
                        <Award size={48} className="feature-icon" />
                        <h3>3. Verify & Earn</h3>
                        <p>Verify completed repairs in your area to earn points. Gain ranks and become a Tamil Nadu Road Safety Champion.</p>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default Home;
