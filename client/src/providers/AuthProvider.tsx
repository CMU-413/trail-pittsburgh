import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import { ORGANIZATION_DOMAIN } from '../constants/config';
import { AuthContext } from '../context/AuthContext';
import { GoogleUser, JwtPayload } from '../types/auth';
import { CredentialResponse } from '@react-oauth/google';

interface AuthProviderProps {
    children: React.ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
    const [user, setUser] = useState<GoogleUser | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        // Check for existing auth token in localStorage on component mount
        const token = localStorage.getItem('auth_token');
        if (token) {
            try {
                const decodedUser = jwtDecode<GoogleUser>(token);

                // Check if token is expired
                const currentTime = Date.now() / 1000;
                const expiryTime = (jwtDecode<JwtPayload>(token)).exp;

                if (expiryTime && expiryTime < currentTime) {
                    // Token expired, clear it
                    localStorage.removeItem('auth_token');
                    setUser(null);
                } else {
                    setUser(decodedUser);
                }
            } catch (error) {
                // eslint-disable-next-line no-console
                console.error('Failed to decode token:', error);
                localStorage.removeItem('auth_token');
                setUser(null);
            }
        }
        setIsLoading(false);
    }, []);

    const login = (credentialResponse: CredentialResponse) => {
        if (credentialResponse?.credential) {
            try {
                // Save the token
                localStorage.setItem('auth_token', credentialResponse.credential);

                // Decode the JWT token to get user info
                const decodedUser = jwtDecode<GoogleUser>(credentialResponse.credential);
                // eslint-disable-next-line no-console
                console.log('Decoded user:', decodedUser);
                setUser(decodedUser);

                // Redirect based on domain
                if (decodedUser.hd === ORGANIZATION_DOMAIN) {
                    navigate('/dashboard');
                } else {
                    navigate('/');
                }
            } catch (error) {
                // eslint-disable-next-line no-console
                console.error('Failed to authenticate:', error);
                localStorage.removeItem('auth_token');
            }
        }
    };

    const logout = () => {
        localStorage.removeItem('auth_token');
        setUser(null);
        navigate('/');
    };

    const isAuthenticated = !!user;

    // Check if user has permission (is from allowed domain)
    const hasPermission = isAuthenticated && !!user?.hd && user.hd === ORGANIZATION_DOMAIN;

    const value = {
        user,
        isLoading,
        isAuthenticated,
        hasPermission,
        login,
        logout,
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
