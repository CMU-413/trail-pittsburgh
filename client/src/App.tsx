// src/App.tsx
import React, { useEffect } from 'react';
import { Routes, Route, useLocation, useNavigate } from 'react-router-dom';
import { CredentialResponse, GoogleOAuthProvider } from '@react-oauth/google';
import { Layout } from './components/layout/Layout';
import { AuthProvider } from './providers/AuthProvider';
import { ProtectedRoute, PublicRoute } from './components/auth/ProtectedRoute';
import { jwtDecode } from 'jwt-decode';
import { useAuth } from './hooks/useAuth';

// Auth pages
// import { LoginPage } from './pages/auth/LoginPage';
import { UnauthorizedPage } from './pages/auth/UnauthorizedPage';
import { ProfilePage } from './pages/auth/ProfilePage';
import { SettingsPage } from './pages/auth/SettingsPage';

// Public and protected pages
import {
    HomePage,
    DashboardPage,
    ParkListPage,
    ParkDetailPage,
    ParkCreatePage,
    ParkEditPage,
    TrailDetailPage,
    TrailCreatePage,
    TrailEditPage,
    IssueListPage,
    IssueDetailPage,
    IssueReportPage
} from './pages';

const AppContent: React.FC = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { login } = useAuth();

    useEffect(() => {
        const params = new URLSearchParams(location.search);
        const token = params.get('token');
        
        if (token) {
            // Store token
            localStorage.setItem('auth_token', token);
            
            // Remove token from URL
            const cleanUrl = location.pathname;
            navigate(cleanUrl, { replace: true });
            
            // Update auth context
            const userData = jwtDecode<{
                email: string;
                name: string;
                picture: string;
            }>(token) as CredentialResponse;
            login(userData);
        }
    }, [location, navigate, login]);

    return (
        <Routes>
            <Route path="/" element={<Layout />}>
                {/* Public Routes - accessible to everyone */}
                <Route element={<PublicRoute />}>
                    <Route index element={<HomePage />} />
                    {/* <Route path="login" element={<LoginPage />} /> */}
                    <Route path="unauthorized" element={<UnauthorizedPage />} />
                    <Route path="issues/report" element={<IssueReportPage />} />
                </Route>

                {/* Protected Routes - require authentication and organization email */}
                <Route element={<ProtectedRoute requirePermission={true} />}>
                    <Route path="dashboard" element={<DashboardPage />} />

                    {/* Parks */}
                    <Route path="parks">
                        <Route index element={<ParkListPage />} />
                        <Route path="create" element={<ParkCreatePage />} />
                        <Route path=":parkId" element={<ParkDetailPage />} />
                        <Route path=":parkId/edit" element={<ParkEditPage />} />

                        {/* Trails (nested under parks) */}
                        <Route path=":parkId/trails">
                            <Route path="create" element={<TrailCreatePage />} />
                            <Route path=":trailId" element={<TrailDetailPage />} />
                            <Route path=":trailId/edit" element={<TrailEditPage />} />
                        </Route>
                    </Route>

                    {/* Issues - except report page which is public */}
                    <Route path="issues">
                        <Route index element={<IssueListPage />} />
                        <Route path=":issueId" element={<IssueDetailPage />} />
                    </Route>

                    {/* User Account */}
                    <Route path="profile" element={<ProfilePage />} />
                    <Route path="settings" element={<SettingsPage />} />
                </Route>

                {/* Fallback for 404 */}
                <Route path="*" element={
                    <div className="flex flex-col items-center justify-center py-20">
                        <h1 className="text-4xl font-bold text-gray-900 mb-4">Page Not Found</h1>
                        <p className="text-lg text-gray-600 mb-8">The page you are looking for doesn't exist or has been moved.</p>
                        <a href="/" className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-md">
                            Go to Home
                        </a>
                    </div>
                } />
            </Route>
        </Routes>
    );
};

export const App: React.FC = () => {
    // Get Google Client ID from environment variables
    const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;

    return (
        <GoogleOAuthProvider clientId={clientId}>
            <AuthProvider>
                <AppContent />
            </AuthProvider>
        </GoogleOAuthProvider>
    );
};
