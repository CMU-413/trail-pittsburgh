// src/pages/issues/IssueReportPage.tsx
import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Issue } from '../../types';
import { PageHeader } from '../../components/layout/PageHeader';
import { IssueReportForm } from '../../components/issues/IssueReportForm';
import { Alert } from '../../components/ui/Alert';
import { mockApi } from '../../services/mockData';

export const IssueReportPage: React.FC = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const [locationPermissionDenied, setLocationPermissionDenied] = useState(false);

    // Get park and trail IDs from query parameters, if available
    const parkId = queryParams.get('parkId') ? parseInt(queryParams.get('parkId')!, 10) : undefined;
    const trailId = queryParams.get('trailId') ? parseInt(queryParams.get('trailId')!, 10) : undefined;

    const handleSubmit = async (data: Omit<Issue, 'issue_id'>) => {
        try {
            const newIssue = await mockApi.createIssue(data);
            navigate(`/issues/${newIssue.issue_id}`);
        } catch (err) {
            // eslint-disable-next-line no-console
            console.error('Error creating issue:', err);
            throw err;
        }
    };

    // Check if geolocation is supported
    const isGeolocationSupported = 'geolocation' in navigator;

    return (
        <div>
            <PageHeader
                title="Report Trail Issue"
                subtitle="Help us keep our trails in great condition by reporting issues you encounter"
            />

            {!isGeolocationSupported && (
                <Alert variant="warning" className="mb-6">
                    Your device or browser doesn't support location services. You can still submit the report, but we won't be able to automatically detect the issue location.
                </Alert>
            )}

            {locationPermissionDenied && (
                <Alert variant="info" className="mb-6" onDismiss={() => setLocationPermissionDenied(false)}>
                    <div className="flex items-start">
                        <svg className="h-5 w-5 text-blue-400 mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <div>
                            <p className="font-medium">Location access was denied</p>
                            <p className="text-sm mt-1">You can still submit your report, but precise location information helps us find and fix the issue more quickly.</p>
                        </div>
                    </div>
                </Alert>
            )}

            <IssueReportForm
                onSubmit={handleSubmit}
                initialParkId={parkId}
                initialTrailId={trailId}
            />

            <div className="mt-10 max-w-3xl mx-auto bg-gray-50 p-4 rounded-lg border border-gray-100">
                <h3 className="text-sm font-medium text-gray-700 mb-2">About Location Data Privacy</h3>
                <p className="text-xs text-gray-600">
                    When you share your location, we only use this information to pinpoint the trail issue on our maps.
                    Your location data is only stored in the context of this specific issue report and is not used for
                    marketing, analytics, or shared with third parties. You can choose not to share your location
                    and still submit a report. For more information, please see our Privacy Policy.
                </p>
            </div>
        </div>
    );
};
