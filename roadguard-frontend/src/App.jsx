import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import HazardMap from './pages/HazardMap';
import ReportHazard from './pages/ReportHazard';
import Profile from './pages/Profile';
import Leaderboard from './pages/Leaderboard';
import AdminDashboard from './pages/AdminDashboard';
import Login from './pages/Login';
import Signup from './pages/Signup';
import ProfileCreate from './pages/ProfileCreate';
import './App.css';

function App() {
  return (
    <Router>
      <AuthProvider>
        <div className="app-container">
          <Navbar />
          <main className="main-content">
            <Routes>
              {/* Public Auth Routes */}
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />

              {/* Protected Profile Setup Route */}
              <Route element={<ProtectedRoute isProfilePage={true} />}>
                <Route path="/create-profile" element={<ProfileCreate />} />
              </Route>

              {/* Fully Protected Main Layout */}
              <Route element={<ProtectedRoute />}>
                <Route path="/" element={<Home />} />
                <Route path="/map" element={<HazardMap />} />
                <Route path="/report" element={<ReportHazard />} />
                <Route path="/profile/:id?" element={<Profile />} />
                <Route path="/leaderboard" element={<Leaderboard />} />

                {/* Admin Only Route */}
                <Route element={<ProtectedRoute adminRequired={true} />}>
                  <Route path="/admin" element={<AdminDashboard />} />
                </Route>
              </Route>

              {/* Fallback */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </main>
        </div>
      </AuthProvider>
    </Router>
  );
}

export default App;
