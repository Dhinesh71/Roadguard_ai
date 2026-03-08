import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import HazardMap from './pages/HazardMap';
import ReportHazard from './pages/ReportHazard';
import Profile from './pages/Profile';
import Leaderboard from './pages/Leaderboard';
import AdminDashboard from './pages/AdminDashboard';
import AdminLogin from './pages/AdminLogin';
import Login from './pages/Login';
import Signup from './pages/Signup';
import ProfileCreate from './pages/ProfileCreate';
import { ADMIN_SESSION_KEY } from './pages/AdminLogin';
import './App.css';

// Admin guard as a simple wrapper (no Outlet, no AuthProvider needed)
const AdminGuard = ({ children }) => {
  const isAdmin = sessionStorage.getItem(ADMIN_SESSION_KEY) === 'true';
  return isAdmin ? children : <Navigate to="/tnrg-control-panel" replace />;
};

// Regular app wrapped in AuthProvider with Navbar
const RegularApp = () => (
  <AuthProvider>
    <div className="app-container">
      <Navbar />
      <main className="main-content">
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />

          <Route element={<ProtectedRoute isProfilePage={true} />}>
            <Route path="/create-profile" element={<ProfileCreate />} />
          </Route>

          <Route element={<ProtectedRoute />}>
            <Route path="/" element={<Home />} />
            <Route path="/map" element={<HazardMap />} />
            <Route path="/report" element={<ReportHazard />} />
            <Route path="/profile/:id?" element={<Profile />} />
            <Route path="/leaderboard" element={<Leaderboard />} />
          </Route>

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
    </div>
  </AuthProvider>
);

function App() {
  return (
    <Router>
      <Routes>
        {/* ── Secret Admin Routes (no AuthProvider, no Navbar) ── */}
        <Route path="/tnrg-control-panel" element={<AdminLogin />} />
        <Route
          path="/tnrg-control-panel/dashboard"
          element={
            <AdminGuard>
              <div style={{ padding: '2rem' }}>
                <AdminDashboard />
              </div>
            </AdminGuard>
          }
        />

        {/* ── All Regular App Routes ── */}
        <Route path="/*" element={<RegularApp />} />
      </Routes>
    </Router>
  );
}

export default App;
