// src/pages/auth/SettingsPage.tsx
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../providers/AuthProvider';
import { PageHeader } from '../../components/layout/PageHeader';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Alert } from '../../components/ui/Alert';
import { Switch } from '../../components/ui/Switch';

// Note: We would need a backend to save these settings
// For now, we'll simulate it on the frontend

export const SettingsPage: React.FC = () => {
    const { user, logout } = useAuth();
    const [saveSuccess, setSaveSuccess] = useState(false);
    const [saveError, setSaveError] = useState<string | null>(null);
    const [emailNotifications, setEmailNotifications] = useState(true);
    const [issueNotifications, setIssueNotifications] = useState(true);
    const [trailUpdates, setTrailUpdates] = useState(true);

    // Handle save settings
    const handleSaveSettings = () => {
        try {
            // eslint-disable-next-line no-console
            console.log('Saved settings:', {
                emailNotifications,
                issueNotifications,
                trailUpdates
            });

            setSaveSuccess(true);
            setSaveError(null);

            // Clear success message after 3 seconds
            setTimeout(() => {
                setSaveSuccess(false);
            }, 3000);
        } catch (error) {
            // eslint-disable-next-line no-console
            console.error('Settings save error:', error);
            setSaveError('Failed to save settings. Please try again.');
            setSaveSuccess(false);
        }
    };

    if (!user) {
        return <div>Loading...</div>;
    }

    return (
        <div>
            <PageHeader
                title="Account Settings"
                subtitle="Configure your account preferences"
                action={
                    <Link to="/profile">
                        <Button variant="secondary">View Profile</Button>
                    </Link>
                }
            />

            {saveSuccess && (
                <Alert variant="success" className="mb-6" onDismiss={() => setSaveSuccess(false)}>
                    Your settings have been saved successfully.
                </Alert>
            )}

            {saveError && (
                <Alert variant="danger" className="mb-6" onDismiss={() => setSaveError(null)}>
                    {saveError}
                </Alert>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-1 flex">
                    <Card title="Account" className="w-full flex flex-col">
                        <div className="flex items-center mb-6">
                            <img
                                src={user.picture || `https://ui-avatars.com/api/?background=random&color=fff&size=400&name=${encodeURIComponent(user.name || 'User')}`}
                                alt={user.name || 'User profile'}
                                className="h-16 w-16 rounded-full object-cover border-2 border-white shadow-sm mr-4"
                                onError={(e) => {
                                    e.currentTarget.src = `https://ui-avatars.com/api/?background=random&color=fff&size=400&name=${encodeURIComponent(user.name || 'User')}`;
                                }}
                            />
                            <div>
                                <h3 className="text-lg font-semibold text-gray-900">{user.name}</h3>
                                <p className="text-sm text-gray-500">{user.email}</p>
                            </div>
                        </div>

                        <p className="text-sm text-gray-500 mb-4 flex-grow">
                            Your profile information is managed by Google. To update your name or profile picture,
                            please visit your Google account settings.
                        </p>

                        <div className="mt-auto flex flex-col space-y-2">
                            <Button
                                variant="danger"
                                onClick={logout}
                                fullWidth
                            >
                                Sign Out
                            </Button>
                        </div>
                    </Card>
                </div>

                <div className="lg:col-span-2 flex">
                    <Card title="Notification Settings" className="w-full flex flex-col">
                        <div className="bg-blue-50 border-l-4 border-blue-400 p-4 mb-6 rounded-sm">
                            <p className="text-sm text-blue-700">
                                Note: Notification functionality is not currently implemented due to time constraints. 
                                These settings are in place for future development.
                            </p>
                        </div>
                        <div className="space-y-6 flex-grow">
                            <div className="flex items-center justify-between">
                                <div>
                                    <h3 className="text-sm font-medium text-gray-900">Email Notifications</h3>
                                    <p className="text-sm text-gray-500">Receive emails about account activity</p>
                                </div>
                                <Switch
                                    checked={emailNotifications}
                                    onChange={setEmailNotifications}
                                />
                            </div>

                            <div className="flex items-center justify-between">
                                <div>
                                    <h3 className="text-sm font-medium text-gray-900">Issue Updates</h3>
                                    <p className="text-sm text-gray-500">Get notified when issues are updated or resolved</p>
                                </div>
                                <Switch
                                    checked={issueNotifications}
                                    onChange={setIssueNotifications}
                                />
                            </div>

                            <div className="flex items-center justify-between">
                                <div>
                                    <h3 className="text-sm font-medium text-gray-900">Trail Alerts</h3>
                                    <p className="text-sm text-gray-500">Receive updates about trail closures and maintenance</p>
                                </div>
                                <Switch
                                    checked={trailUpdates}
                                    onChange={setTrailUpdates}
                                />
                            </div>
                        </div>

                        <div className="mt-auto flex justify-end">
                            <Button
                                variant="primary"
                                size="md"
                                onClick={handleSaveSettings}
                            >
                                Save Settings
                            </Button>
                        </div>
                    </Card>
                </div>
            </div>
        </div>
    );
};
