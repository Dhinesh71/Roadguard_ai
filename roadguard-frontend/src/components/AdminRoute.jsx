import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { ADMIN_SESSION_KEY } from '../pages/AdminLogin';

// Protects admin routes — checks sessionStorage for admin session key
const AdminRoute = () => {
    const isAdmin = sessionStorage.getItem(ADMIN_SESSION_KEY) === 'true';
    return isAdmin ? <Outlet /> : <Navigate to="/tnrg-control-panel" replace />;
};

export default AdminRoute;
