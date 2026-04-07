// src/pages/auth/ProfilePage.tsx
import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../providers/AuthProvider';
import { PageHeader } from '../../components/layout/PageHeader';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { 
    Issue, UserRoleEnum, IssueStatusEnum 
} from '../../types';
import { APP_NAME } from '../../constants/config';
import { formatUserRole, hasAccess } from '../../utils/formatters';
import { LoadingSpinner } from '../../components/layout/LoadingSpinner';
import { issueApi } from '../../services/api';
import { formatDistanceToNow } from 'date-fns/formatDistanceToNow';

export const ProfilePage: React.FC = () => {
    const location = useLocation();
    const { user, logout } = useAuth();
    const [isLoading, setIsLoading] = useState(true);
    const [issues, setIssues] = useState<Issue[]>([]);
    const statusColors: Record<IssueStatusEnum, string> = {
        UNRESOLVED: 'bg-red-100 text-red-700',
        IN_PROGRESS: 'bg-yellow-100 text-yellow-800',
        RESOLVED: 'bg-green-100 text-green-800',
    };

    useEffect(() => {
        if (!user?.email) {
            return;
        }

        (async () => {
            setIsLoading(true);
            try {
                const issuesData = await issueApi.getAllIssues({ reporterEmail: user.email , ownerEmail: user.email });
                setIssues(issuesData);
            } catch (err) {
                console.error('Error fetching profile data:', err);
            } finally {
                setIsLoading(false);
            }
        })(); 
    }, [user?.email]);

    if (!user) {
        return <div>Loading...</div>;
    }

    if (isLoading) {
        return <LoadingSpinner />;
    }

    // Get the most recent issues
    const filteredIssues = [...issues].sort(
        (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );

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
                                    src={user.picture || `https://ui-avatars.com/api/?background=random&color=fff&size=400&name=${encodeURIComponent(user.name || 'User')}`}
                                    alt={user.name || 'User profile'}
                                    className="h-32 w-32 rounded-full object-cover border-4 border-white shadow-md"
                                    onError={(e) => {
                                        e.currentTarget.src = `https://ui-avatars.com/api/?background=random&color=fff&size=400&name=${encodeURIComponent(user.name || 'User')}`;
                                    }}
                                />
                            </div>
                            <h2 className="text-xl font-bold text-gray-900">{user.name}</h2>
                            <p className="text-sm text-gray-500 mb-4">{user.email}</p>

                            {user.role && (
                                <Badge variant="primary" className="mb-4">
                                    {formatUserRole(user.role)}
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
                                <p className="mt-1 text-base text-gray-900">{APP_NAME}</p>
                            </div>
                        </div>
                    </Card>
                    
                    <Card title="My Reported Issues" className="mb-6">
                        <div className="space-y-4">
                            {filteredIssues.map((issue) => (
                                <div
                                    key={issue.issueId}
                                    className="bg-white shadow-sm rounded-md p-4 mb-3 border border-gray-100 hover:shadow-md transition"
                                >
                                    <div className="flex items-center gap-3">

                                        {/* Status Badge */}
                                        <span
                                            className={`px-2 py-1 text-xs font-semibold rounded ${statusColors[issue.status]}`}
                                        >
                                            {issue.status.replace('_', ' ')}
                                        </span>

                                        {/* Issue Type / Title */}
                                        <Link
                                            to={`/issues/card/${issue.issueId}`}
    										state={{ 
                                                backgroundLocation: {
                                                    pathname: location.pathname,
                                                    search: location.search,
                                                    hash: location.hash
                                                }
                                            }}
                                            className="font-medium text-blue-600 hover:text-blue-500 truncate"
                                        >
                                            {issue.issueType.charAt(0).toUpperCase() + issue.issueType.slice(1)}
                                        </Link>

                                        {/* Date */}
                                        <span className="text-sm text-gray-500 ml-auto whitespace-nowrap">
                                            {formatDistanceToNow(new Date(issue.createdAt), { addSuffix: true })}
                                        </span>
                                    </div>

                                    {/* Description */}
                                    <p className="text-sm text-gray-600 mt-2 line-clamp-2">
                                        {issue.description}
                                    </p>

                                    {/* Park */}
                                    {issue.park && (
                                        <p className="text-xs text-gray-400 mt-2">
                                            Park: <span className="font-medium">{issue.park.name}</span>
                                        </p>
                                    )}
                                </div>
                            ))}
                        </div>
                    </Card>

                    <Card title="Access Information">
                        <div className="space-y-4">
                            <div>
                                <h3 className="text-sm font-medium text-gray-500">Account Type</h3>
                                <p className="mt-1 flex items-center">
                                    {user.role === UserRoleEnum.ROLE_SUPERADMIN ? (
                                        <>
                                            <span className="bg-purple-100 text-purple-800 font-medium py-1 px-2 rounded-md text-sm">Super Admin</span>
                                            <span className="ml-2 text-sm text-gray-600">Full access to all features and system administration</span>
                                        </>
                                    ) : user.role === UserRoleEnum.ROLE_ADMIN ? (
                                        <>
                                            <span className="bg-green-100 text-green-800 font-medium py-1 px-2 rounded-md text-sm">Admin</span>
                                            <span className="ml-2 text-sm text-gray-600">Access to management features and reports</span>
                                        </>
                                    ) : user.role === UserRoleEnum.ROLE_USER ? (
                                        <>
                                            <span className="bg-blue-100 text-blue-800 font-medium py-1 px-2 rounded-md text-sm">User</span>
                                            <span className="ml-2 text-sm text-gray-600">Standard user access</span>
                                        </>
                                    ) : (
                                        <>
                                            <span className="bg-gray-100 text-gray-800 font-medium py-1 px-2 rounded-md text-sm">Public User</span>
                                            <span className="ml-2 text-sm text-gray-600">Limited access to public features only</span>
                                        </>
                                    )}
                                </p>
                            </div>

                            <div>
                                <h3 className="text-sm font-medium text-gray-500">Permissions</h3>
                                <div className="mt-2 grid grid-cols-1 md:grid-cols-2 gap-2">
                                    <div className={`px-3 py-2 rounded-md ${hasAccess(user.role, UserRoleEnum.ROLE_ADMIN) ? 'bg-green-50 text-green-700' : 'bg-gray-50 text-gray-500'}`}>
                                        <span className="block text-sm font-medium">Dashboard</span>
                                        <span className="block text-xs mt-1">{hasAccess(user.role, UserRoleEnum.ROLE_ADMIN) ? 'Full access' : 'No access'}</span>
                                    </div>
                                    <div className={`px-3 py-2 rounded-md ${hasAccess(user.role, UserRoleEnum.ROLE_ADMIN) ? 'bg-green-50 text-green-700' : 'bg-gray-50 text-gray-500'}`}>
                                        <span className="block text-sm font-medium">Parks Management</span>
                                        <span className="block text-xs mt-1">{hasAccess(user.role, UserRoleEnum.ROLE_ADMIN) ? 'Full access' : 'No access'}</span>
                                    </div>
                                    <div className="px-3 py-2 rounded-md bg-green-50 text-green-700">
                                        <span className="block text-sm font-medium">Issue Reporting</span>
                                        <span className="block text-xs mt-1">Full access</span>
                                    </div>
                                    <div className={`px-3 py-2 rounded-md ${hasAccess(user.role, UserRoleEnum.ROLE_ADMIN) ? 'bg-green-50 text-green-700' : 'bg-gray-50 text-gray-500'}`}>
                                        <span className="block text-sm font-medium">Issue Management</span>
                                        <span className="block text-xs mt-1">{hasAccess(user.role, UserRoleEnum.ROLE_ADMIN) ? 'Full access' : 'No access'}</span>
                                    </div>
                                    <div className={`px-3 py-2 rounded-md ${hasAccess(user.role, UserRoleEnum.ROLE_SUPERADMIN) ? 'bg-green-50 text-green-700' : 'bg-gray-50 text-gray-500'}`}>
                                        <span className="block text-sm font-medium">User Management</span>
                                        <span className="block text-xs mt-1">{hasAccess(user.role, UserRoleEnum.ROLE_SUPERADMIN) ? 'Full access' : 'No access'}</span>
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
