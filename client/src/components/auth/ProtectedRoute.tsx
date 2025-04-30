// src/components/auth/ProtectedRoute.tsx
import React, { useEffect } from 'react';
import {
    Navigate, Outlet, useLocation
} from 'react-router-dom';
import { useAuth } from '../../providers/AuthProvider';
import { LoadingSpinner } from '../layout/LoadingSpinner';
import { UserRoleEnum } from '../../types';

interface ProtectedRouteProps {
    isUser?: boolean;
    isAdmin?: boolean;
    isSuperAdmin?: boolean;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
    isUser = false,
    isAdmin = false,
    isSuperAdmin = false
}) => {
    const { isAuthenticated, loading, login, userRole } = useAuth();
    const location = useLocation();

    useEffect(() => {
        if (!isAuthenticated && !loading) {
            login();
        }
    }, [isAuthenticated, loading, login]);

    // Show loading spinner while authentication state is being determined
    if (loading) {
        return <LoadingSpinner message="Checking authentication..." />;
    }

    // If not authenticated, show loading spinner while redirecting
    if (!isAuthenticated) {
        return <LoadingSpinner message="Redirecting to login..." />;
    }

    // Check if user has the required role
    const hasRequiredRole = () => {
        if (isSuperAdmin && userRole !== UserRoleEnum.ROLE_SUPERADMIN) {
            return false;
        }
        if (isAdmin && userRole !== UserRoleEnum.ROLE_ADMIN && userRole !== UserRoleEnum.ROLE_SUPERADMIN) {
            return false;
        }
        if (isUser && userRole !== UserRoleEnum.ROLE_USER && userRole !== UserRoleEnum.ROLE_ADMIN && userRole !== UserRoleEnum.ROLE_SUPERADMIN) {
            return false;
        }
        return true;
    };

    // If user doesn't have the required role
    if (!hasRequiredRole()) {
        return <Navigate to="/unauthorized" state={{ from: location }} replace />;
    }

    // User is authenticated and has the required role, render the protected content
    return <Outlet />;
};

// Public route - accessible to everyone
export const PublicRoute: React.FC = () => {
    return <Outlet />;
};
