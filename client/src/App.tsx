// src/App.tsx
import React from 'react';
import {
    Routes, Route,
    useLocation,
    useNavigate,
    useParams
} from 'react-router-dom';

import { Layout } from './components/layout/Layout';
import { AuthProvider } from './providers/AuthProvider';
import { ProtectedRoute, PublicRoute } from './components/auth/ProtectedRoute';

// Auth pages
import { UnauthorizedPage } from './pages/auth/UnauthorizedPage';
import { ProfilePage } from './pages/auth/ProfilePage';
import { SettingsPage } from './pages/auth/SettingsPage';

// Public and protected pages
import {
    HomePage,
    ParkListPage,
    ParkDetailPage,
    ParkCreatePage,
    ParkEditPage,
    IssueMapPage,
    IssueReportPage,
    UserDetailPage,
    IssueDetailCard,
} from './pages';

const IssueDetailCardWrapper: React.FC = () => {
    const { issueId } = useParams<{ issueId: string }>();
    const navigate = useNavigate();

    if (!issueId) {return null;}

    return (
        <IssueDetailCard
            issueId={Number(issueId)}
            onClose={() => navigate(-1)}   // go back to previous page
            onUpdated={() => {}}           // optional: hook refresh if needed
        />
    );
};

const AppContent: React.FC = () => {
    const location = useLocation();
    const state = location.state as { backgroundLocation?: Location };

    return (
        <>
            <Routes location={state?.backgroundLocation || location}>
                <Route path="/" element={<Layout />}>
                    {/* Public Routes - accessible to everyone */}
                    <Route element={<PublicRoute />}>
                        <Route index element={<HomePage />} />
                        <Route path="unauthorized" element={<UnauthorizedPage />} />
                        <Route path="issues" element={<IssueMapPage />} />
                        <Route path="issues/card/:issueId" element={<IssueMapPage />} />
                        <Route path="issues/report" element={<IssueReportPage />} />
                    </Route>

                    {/* Protected Routes - require authentication */}
                    <Route element={<ProtectedRoute />}>
                        {/* User Routes - available to all authenticated users */}
                        <Route path="profile" element={<ProfilePage />} />
                        <Route path="settings" element={<SettingsPage />} />

                        {/* Admin Routes - require admin role */}
                        <Route element={<ProtectedRoute isAdmin={true} />}>
                            {/* Parks */}
                            <Route path="parks">
                                <Route index element={<ParkListPage />} />
                                <Route path="create" element={<ParkCreatePage />} />
                                <Route path=":parkId" element={<ParkDetailPage />} />
                                <Route path=":parkId/edit" element={<ParkEditPage />} />
                            </Route>
                        </Route>

                        {/* Super Admin Routes - require super admin role */}
                        <Route element={<ProtectedRoute isSuperAdmin={true} />}>
                            {/* Users */}
                            <Route path="users" element={<UserDetailPage />} />
                        </Route>
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
            {/* Modal route for issue details */}
            {state?.backgroundLocation && (
                <Routes>
                    <Route
                        path="/issues/card/:issueId"
                        element={<IssueDetailCardWrapper />}
                    />
                </Routes>
            )}
        </>
    );
};

export const App: React.FC = () => {
    return (
        <AuthProvider>
            <AppContent />
        </AuthProvider>
    );
};
