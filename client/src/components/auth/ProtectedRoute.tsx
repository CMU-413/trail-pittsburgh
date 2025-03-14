// src/components/auth/ProtectedRoute.tsx
import React from 'react';
import {
    Navigate, Outlet, useLocation
} from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { LoadingSpinner } from '../layout/LoadingSpinner';

interface ProtectedRouteProps {
    requirePermission?: boolean; // If true, checks for organization email
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
    requirePermission = true
}) => {
    const { isAuthenticated, hasPermission, isLoading } = useAuth();
    const location = useLocation();

    // Show loading spinner while authentication state is being determined
    if (isLoading) {
        return <LoadingSpinner message="Checking authentication..." />;
    }

    // If not authenticated, redirect to login
    if (!isAuthenticated) {
        return <Navigate to="/login" state={{ from: location }} replace />;
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
