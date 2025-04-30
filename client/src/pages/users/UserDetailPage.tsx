import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, UserRoleEnum } from '../../types';
import { PageHeader } from '../../components/layout/PageHeader';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { LoadingSpinner } from '../../components/layout/LoadingSpinner';
import { EmptyState } from '../../components/layout/EmptyState';
import { userApi } from '../../services/api';

export const UserDetailPage: React.FC = () => {
    const navigate = useNavigate();
    const [users, setUsers] = useState<User[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const usersData = await userApi.getUsers();
                setUsers(usersData);
            } catch (err) {
                // eslint-disable-next-line no-console
                console.error('Error fetching users:', err);
                setError('Failed to load users. Please try again later.');
            } finally {
                setIsLoading(false);
            }
        };

        fetchUsers();
    }, []);

    const handleRoleChange = async (userId: string, newRole: UserRoleEnum) => {
        try {
            await userApi.updateUserRole(userId, newRole);
            setUsers(users.map((user) => 
                user.userId?.toString() === userId ? { ...user, role: newRole } : user));
        } catch (err) {
            // eslint-disable-next-line no-console
            console.error('Error updating user role:', err);
            setError('Failed to update user role. Please try again later.');
        }
    };

    const getRoleBadgeVariant = (role: UserRoleEnum) => {
        switch (role) {
        case UserRoleEnum.ROLE_SUPERADMIN:
            return 'danger';
        case UserRoleEnum.ROLE_ADMIN:
            return 'success';
        default:
            return 'secondary';
        }
    };

    if (isLoading) {
        return <LoadingSpinner />;
    }

    if (error) {
        return (
            <div>
                <PageHeader title="Users" />
                <EmptyState
                    title="Error"
                    description={error}
                    action={
                        <Button variant="primary" onClick={() => window.location.reload()}>
                            Try Again
                        </Button>
                    }
                />
            </div>
        );
    }

    return (
        <div>
            <PageHeader
                title="Users"
                subtitle="Manage user roles and permissions"
                action={
                    <Button variant="primary" onClick={() => navigate('/users/new')}>
                        Add New User
                    </Button>
                }
            />

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
                <Card className="lg:col-span-3">
                    <div className="flex justify-between mb-4">
                        <h3 className="text-xl font-bold text-gray-900">User Management</h3>
                        <div className="flex space-x-2">
                            <Badge key="total-users" variant="secondary">{users.length} Total Users</Badge>
                        </div>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        User
                                    </th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Email
                                    </th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Role
                                    </th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Status
                                    </th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Change Role
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {users.map((user) => (
                                    <tr key={user.userId}>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex items-center">
                                                <div className="flex-shrink-0">
                                                    <img
                                                        className="h-10 w-10 rounded-full"
                                                        src={user.profileImage || `https://ui-avatars.com/api/?background=random&color=fff&size=400&name=${encodeURIComponent(user.username || 'User')}`}
                                                        alt={user.username || 'User profile'}
                                                        onError={(e) => {
                                                            e.currentTarget.src = `https://ui-avatars.com/api/?background=random&color=fff&size=400&name=${encodeURIComponent(user.username || 'User')}`;
                                                        }}
                                                    />
                                                </div>
                                                <div className="ml-4">
                                                    <div className="text-sm font-medium text-gray-900">{user.username}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm text-gray-900">{user.email}</div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <Badge variant={getRoleBadgeVariant(user.role || UserRoleEnum.ROLE_USER)}>
                                                {user.role?.replace('ROLE_', '') || 'User'}
                                            </Badge>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <Badge variant={user.isActive ? 'success' : 'secondary'}>
                                                {user.isActive ? 'Active' : 'Inactive'}
                                            </Badge>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            <select
                                                value={user.role || UserRoleEnum.ROLE_USER}
                                                onChange={(e) => {
                                                    const newRole = e.target.value as UserRoleEnum;
                                                    if (user.userId) {
                                                        handleRoleChange(user.userId.toString(), newRole);
                                                    }
                                                }}
                                                className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-[#BD4602] focus:border-[#BD4602] sm:text-sm rounded-md"
                                            >
                                                <option value={UserRoleEnum.ROLE_USER}>User</option>
                                                <option value={UserRoleEnum.ROLE_ADMIN}>Admin</option>
                                                <option value={UserRoleEnum.ROLE_SUPERADMIN}>Super Admin</option>
                                            </select>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </Card>
            </div>
        </div>
    );
}; 
