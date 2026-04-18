// src/pages/issues/IssueReportPage.tsx
import React, { useState } from 'react';
import { IssueParams } from '../../types';
import { PageHeader } from '../../components/layout/PageHeader';
import { IssueReportForm } from '../../components/issues/IssueReportForm';
import { Alert } from '../../components/ui/Alert';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { issueApi } from '../../services/api';

export const IssueReportPage: React.FC = () => {
    const [locationPermissionDenied, setLocationPermissionDenied] = useState(false);
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [errorMessage, setErrorMessage] = useState<string>('');

    const handleSubmit = async (data: IssueParams) => {
        try {
            const errorMsg = await issueApi.createIssue(data);
            if (errorMsg) {
                setErrorMessage(errorMsg);
                setIsSubmitted(true);
                window.scrollTo({ top: 0, behavior: 'smooth' });
                return;
            }

            setErrorMessage('');
            // Set submission state to true to hide the form
            setIsSubmitted(true);
            // Scroll to top for better UX
            window.scrollTo({ top: 0, behavior: 'smooth' });
        } catch (err) {
            setErrorMessage('Something went wrong while submitting the issue.');
            // eslint-disable-next-line no-console
            console.error('Error creating issue:', err);
            throw err;
        }
    };

    const handleSubmitAnother = () => {
        setErrorMessage('');
        setIsSubmitted(false);
    };

    // Check if geolocation is supported
    const isGeolocationSupported = 'geolocation' in navigator;

    return (
        <div>
            <PageHeader
                title="Report Trail Issue"
                subtitle="Help us keep our trails in great condition by reporting issues you encounter"
            />

            <div className="mt-10 max-w-3xl mx-auto bg-blue-50 p-4 rounded-lg border border-blue-200">
                <h3 className="text-sm font-semibold text-blue-600 mb-1">
					Sign in or opt-in email notification to edit this report later.
                </h3>
                <p className="text-sm italic text-blue-600">
					Otherwise, you won’t be able to make changes to this report.
                </p>
            </div>

            {!isGeolocationSupported && !isSubmitted && (
                <Alert variant="warning" className="mb-6">
                    Your device or browser doesn't support location services. You can still submit the report, but we won't be able to automatically detect the issue location.
                </Alert>
            )}

            {locationPermissionDenied && !isSubmitted && (
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

            {isSubmitted ? (
                errorMessage ? (
                    <Card className="max-w-3xl mx-auto">
                        <div className="flex flex-col items-center py-12 text-center">
                            <div className="mx-auto flex items-center justify-center h-24 w-24 rounded-full bg-red-100 mb-6">
                                <svg
                                    className="h-16 w-16 text-red-600"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="2"
                                        d="M12 8v4m0 4h.01M12 2a10 10 0 100 20 10 10 0 000-20z"
                                    />
                                </svg>
                            </div>

                            <h2 className="text-3xl font-bold text-gray-900 mb-4">
                                Submission Failed
                            </h2>

                            <p className="text-lg text-gray-600 max-w-lg mb-4">
                                We couldn't submit your issue report.
                            </p>

                            {errorMessage && (
                                <p className="text-sm text-red-600 max-w-lg mb-8">
                                    {errorMessage}
                                </p>
                            )}

                            <Button variant="primary" onClick={handleSubmitAnother}>
                                Try Again
                            </Button>
                        </div>
                    </Card>
                ) : (
                    <Card className="max-w-3xl mx-auto">
                        <div className="flex flex-col items-center py-12 text-center">
                            <div className="mx-auto flex items-center justify-center h-24 w-24 rounded-full bg-green-100 mb-6">
                                <svg
                                    className="h-16 w-16 text-green-600"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="2"
                                        d="M5 13l4 4L19 7"
                                    />
                                </svg>
                            </div>

                            <h2 className="text-3xl font-bold text-gray-900 mb-4">
                                Thank You!
                            </h2>

                            <p className="text-lg text-gray-600 max-w-lg mb-8">
                                The issue has been successfully reported.
                            </p>
                            <p className="text-lg italic text-gray-600 max-w-lg mb-8">
								You can view reported issue on either Issues or Profile page.
                            </p>

                            <Button variant="primary" onClick={handleSubmitAnother}>
                                Report Another Issue
                            </Button>
                        </div>
                    </Card>
                )
            ) : (
                <>
                    <IssueReportForm
                        onSubmit={handleSubmit}
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
                </>
            )}
        </div>
    );
};
