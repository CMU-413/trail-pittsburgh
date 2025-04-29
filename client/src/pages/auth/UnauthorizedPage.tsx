// src/pages/auth/UnauthorizedPage.tsx
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../../components/ui/Button';
import { useAuth } from '../../providers/AuthProvider';
import { APP_NAME } from '../../constants/config';

export const UnauthorizedPage: React.FC = () => {
    const { user, logout } = useAuth();

    return (
        <div className="min-h-[calc(100vh-16rem)] flex flex-col items-center justify-center px-4 py-16">
            <div className="bg-white p-8 rounded-xl shadow-md max-w-lg w-full text-center">
                <div className="mx-auto flex items-center justify-center h-20 w-20 rounded-full bg-red-100 mb-6">
                    <svg className="h-12 w-12 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m0 0v2m0-2h2m-2 0h-2m6-10l2 2v8a2 2 0 01-2 2H8a2 2 0 01-2-2V9a2 2 0 012-2h8a2 2 0 012 2v1" />
                    </svg>
                </div>

                <h1 className="text-2xl font-bold text-gray-900 mb-4">Access Restricted</h1>

                <p className="text-gray-600 mb-6">
                    {user?.email ? (
                        <>
                            Your email <span className="font-medium">{user.email}</span> doesn't have permission to access
                            this area. Access is restricted to accounts only.
                        </>
                    ) : (
                        `Access to this area is restricted to ${APP_NAME} steward only.`
                    )}
                </p>

                <div className="flex flex-col sm:flex-row justify-center space-y-3 sm:space-y-0 sm:space-x-3">
                    <Link to="/">
                        <Button variant="primary">
                            Go to Homepage
                        </Button>
                    </Link>

                    <Button variant="secondary" onClick={logout}>
                        Sign Out
                    </Button>
                </div>
            </div>
        </div>
    );
};
