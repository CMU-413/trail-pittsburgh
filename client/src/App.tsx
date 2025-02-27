// src/App.tsx
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { Layout } from './components/layout/Layout';

// Import all pages from the index file
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

export const App: React.FC = () => {
    return (
        <Routes>
            <Route path="/" element={<Layout />}>
                {/* Home and Dashboard */}
                <Route index element={<HomePage />} />
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
                
                {/* Issues */}
                <Route path="issues">
                    <Route index element={<IssueListPage />} />
                    <Route path="report" element={<IssueReportPage />} />
                    <Route path=":issueId" element={<IssueDetailPage />} />
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
