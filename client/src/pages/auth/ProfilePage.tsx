// src/pages/auth/ProfilePage.tsx
import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { PageHeader } from '../../components/layout/PageHeader';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { ORGANIZATION_DOMAIN } from '../../constants/config';

export const ProfilePage: React.FC = () => {
    const { user, logout } = useAuth();

    if (!user) {
        return <div>Loading...</div>;
    }

    return (
        <div>
            <PageHeader
                title="Your Profile"
                subtitle="Manage your account details and preferences"
                action={
                    <Link to="/settings">
                        <Button variant="secondary">Edit Profile</Button>
                    </Link>
                }
            />

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-1">
                    <Card className="overflow-hidden">
                        <div className="flex flex-col items-center py-6">
                            <div className="relative mb-4">
                                <img
                                    src={user.picture}
                                    alt={user.name}
                                    className="h-32 w-32 rounded-full object-cover border-4 border-white shadow-md"
                                />
                            </div>
                            <h2 className="text-xl font-bold text-gray-900">{user.name}</h2>
                            <p className="text-sm text-gray-500 mb-4">{user.email}</p>

                            {user.hd && (
                                <Badge variant="primary" className="mb-4">
                                    {user.hd}
                                </Badge>
                            )}

                            <div className="mt-4 flex flex-col space-y-2 w-full px-4">
                                <Link to="/settings" className="w-full">
                                    <Button variant="secondary" fullWidth>
                                        Account Settings
                                    </Button>
                                </Link>
                                <Button variant="danger" onClick={logout} fullWidth>
                                    Sign Out
                                </Button>
                            </div>
                        </div>
                    </Card>
                </div>

                <div className="lg:col-span-2">
                    <Card title="Account Information" className="mb-6">
                        <div className="space-y-4">
                            <div>
                                <h3 className="text-sm font-medium text-gray-500">Name</h3>
                                <p className="mt-1 text-base text-gray-900">{user.name}</p>
                            </div>
                            <div>
                                <h3 className="text-sm font-medium text-gray-500">Email</h3>
                                <p className="mt-1 text-base text-gray-900">{user.email}</p>
                            </div>
                            <div>
                                <h3 className="text-sm font-medium text-gray-500">Organization</h3>
                                <p className="mt-1 text-base text-gray-900">{user.hd || 'Personal Account'}</p>
                            </div>
                        </div>
                    </Card>

                    <Card title="Access Information">
                        <div className="space-y-4">
                            <div>
                                <h3 className="text-sm font-medium text-gray-500">Account Type</h3>
                                <p className="mt-1 flex items-center">
                                    {user.hd === ORGANIZATION_DOMAIN ? (
                                        <>
                                            <span className="bg-green-100 text-green-800 font-medium py-1 px-2 rounded-md text-sm">Staff</span>
                                            <span className="ml-2 text-sm text-gray-600">Full access to all features</span>
                                        </>
                                    ) : (
                                        <>
                                            <span className="bg-blue-100 text-blue-800 font-medium py-1 px-2 rounded-md text-sm">Public User</span>
                                            <span className="ml-2 text-sm text-gray-600">Limited access to public features only</span>
                                        </>
                                    )}
                                </p>
                            </div>

                            <div>
                                <h3 className="text-sm font-medium text-gray-500">Permissions</h3>
                                <div className="mt-2 grid grid-cols-1 md:grid-cols-2 gap-2">
                                    <div className={`px-3 py-2 rounded-md ${user.hd === ORGANIZATION_DOMAIN ? 'bg-green-50 text-green-700' : 'bg-gray-50 text-gray-500'}`}>
                                        <span className="block text-sm font-medium">Dashboard</span>
                                        <span className="block text-xs mt-1">{user.hd === ORGANIZATION_DOMAIN ? 'Full access' : 'No access'}</span>
                                    </div>
                                    <div className={`px-3 py-2 rounded-md ${user.hd === ORGANIZATION_DOMAIN ? 'bg-green-50 text-green-700' : 'bg-gray-50 text-gray-500'}`}>
                                        <span className="block text-sm font-medium">Parks Management</span>
                                        <span className="block text-xs mt-1">{user.hd === ORGANIZATION_DOMAIN ? 'Full access' : 'No access'}</span>
                                    </div>
                                    <div className={`px-3 py-2 rounded-md ${user.hd === ORGANIZATION_DOMAIN ? 'bg-green-50 text-green-700' : 'bg-gray-50 text-gray-500'}`}>
                                        <span className="block text-sm font-medium">Trails Management</span>
                                        <span className="block text-xs mt-1">{user.hd === ORGANIZATION_DOMAIN ? 'Full access' : 'No access'}</span>
                                    </div>
                                    <div className="px-3 py-2 rounded-md bg-green-50 text-green-700">
                                        <span className="block text-sm font-medium">Issue Reporting</span>
                                        <span className="block text-xs mt-1">Full access</span>
                                    </div>
                                    <div className={`px-3 py-2 rounded-md ${user.hd === ORGANIZATION_DOMAIN ? 'bg-green-50 text-green-700' : 'bg-gray-50 text-gray-500'}`}>
                                        <span className="block text-sm font-medium">Issue Management</span>
                                        <span className="block text-xs mt-1">{user.hd === ORGANIZATION_DOMAIN ? 'Full access' : 'No access'}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </Card>
                </div>
            </div>
        </div>
    );
};
