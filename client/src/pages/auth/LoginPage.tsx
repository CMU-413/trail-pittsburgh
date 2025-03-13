import React from 'react';
import { GoogleLogin, CredentialResponse } from '@react-oauth/google';
import { useAuth } from '../../hooks/useAuth';
import { Card } from '../../components/ui/Card';
import {
    Navigate, useLocation, Location
} from 'react-router-dom';
import { ORGANIZATION_DOMAIN, APP_NAME } from '../../constants/config';

interface LocationState {
    from?: {
        pathname: string;
    };
}

export const LoginPage: React.FC = () => {
    const { login, isAuthenticated, hasPermission } = useAuth();
    const location = useLocation() as Location & { state: LocationState };

    // Get the page user was trying to access before being redirected to login
    const from = location.state?.from?.pathname || '/dashboard';

    // If already authenticated, redirect
    if (isAuthenticated) {
        if (hasPermission) {
            return <Navigate to={from} replace />;
        } else {
            return <Navigate to="/" replace />;
        }
    }

    const handleLoginError = () => {
        // eslint-disable-next-line no-console
        console.log('Login failed');
    };

    return (
        <div className="flex justify-center items-center min-h-[calc(100vh-16rem)]">
            <Card className="w-full max-w-md p-8">
                <div className="text-center mb-8">
                    <h1 className="text-2xl font-bold text-gray-900 mb-2">Sign In to {APP_NAME}</h1>
                    <p className="text-gray-600">
                        Manage and monitor trail issues across Pittsburgh's parks.
                    </p>
                </div>

                <div className="flex flex-col items-center">
                    <p className="text-sm text-gray-500 mb-6">
                        Sign in with your {APP_NAME} Google account to continue.
                    </p>

                    <div className="mb-4 w-full flex justify-center">
                        <GoogleLogin
                            onSuccess={(credentialResponse: CredentialResponse) => login(credentialResponse)}
                            onError={handleLoginError}
                            theme="outline"
                            shape="rectangular"
                            locale="en"
                            text="signin_with"
                            logo_alignment="center"
                            width="280px"
                        />
                    </div>

                    <p className="text-xs text-gray-500 mt-4 text-center max-w-sm">
                        Note: Access to internal features is restricted to users with
                        <span className="font-medium"> @{ORGANIZATION_DOMAIN} </span>
                        email addresses only.
                    </p>
                </div>
            </Card>
        </div>
    );
};
