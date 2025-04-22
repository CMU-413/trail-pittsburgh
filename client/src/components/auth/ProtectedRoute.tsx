// src/components/auth/ProtectedRoute.tsx
import React, { useEffect } from 'react';
import {
    Navigate, Outlet, useLocation
} from 'react-router-dom';
import { useAuth } from '../../providers/AuthProvider';
import { LoadingSpinner } from '../layout/LoadingSpinner';

interface ProtectedRouteProps {
    requirePermission?: boolean; // If true, checks for organization email
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
    requirePermission = true
}) => {
    const { isAuthenticated, hasPermission, loading, login } = useAuth();
    const location = useLocation();

    // Show loading spinner while authentication state is being determined
    if (loading) {
        return <LoadingSpinner message="Checking authentication..." />;
    }

    // If not authenticated, trigger login directly
    if (!isAuthenticated) {
        // We need to use useEffect because login() triggers navigation
        useEffect(() => {
            login();
        }, [login]);
        
        return <LoadingSpinner message="Redirecting to login..." />;
    }

    // If we require organization permission and user doesn't have it
    if (requirePermission && !hasPermission) {
        return <Navigate to="/unauthorized" state={{ from: location }} replace />;
    }

    // User is authenticated and has permission, render the protected content
    return <Outlet />;
};

// Public route - accessible to everyone
export const PublicRoute: React.FC = () => {
    return <Outlet />;
};
