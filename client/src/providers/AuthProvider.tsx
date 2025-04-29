import React, {
    createContext, useEffect, useState, useContext 
} from 'react';
import { useNavigate } from 'react-router-dom';
import { User } from '../types';
import { UserRoleEnum } from '../types/index';
import { userApi } from '../services/api';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: () => void;
  logout: () => void;
  isAuthenticated: boolean;
  hasPermission: UserRoleEnum | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    const [userRole, setUserRole] = useState<UserRoleEnum | null>(null);
    const navigate = useNavigate();

    // Fetch current user on mount
    useEffect(() => {
        fetchCurrentUser();
    }, []);

    // Fetch current user from backend
    const fetchCurrentUser = async () => {
        try {
            const res = await fetch(`${import.meta.env.VITE_API_URL}/api/auth/me`, {
                credentials: 'include'
            });
            
            if (!res.ok) {
                setUser(null);
                return;
            }
            
            const data = await res.json();
            if (data?.user) {
                setUser(data.user);
            } else {
                setUser(null);
            }
        } catch {
            setUser(null);
        } finally {
            setLoading(false);
        }
    };

     // Fetch user role when user changes
     useEffect(() => {
        const fetchRole = async () => {
            console.log('fetching role');
            if (user) {
                const role = await userApi.getUserRole();
                setUserRole(role);
            } else {
                setUserRole(null);
            }
        };
        fetchRole();
    }, [user]);

    // Start OAuth flow
    const login = async () => {
        try {
            const res = await fetch(`${import.meta.env.VITE_API_URL}/api/auth`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify({ redirectPath: '/dashboard' })
            });
            const data = await res.json();
            if (data.url) {
                window.location.href = data.url;
            }
        } catch (error) {
            // eslint-disable-next-line no-console
            console.error('Login failed', error);
        }
    };

    // Logout user
    const logout = async () => {
        try {
            await fetch(`${import.meta.env.VITE_API_URL}/api/auth/logout`, {
                method: 'POST',
                credentials: 'include'
            });
            setUser(null);
            navigate('/');
        } catch (error) {
            // eslint-disable-next-line no-console
            console.error('Logout failed', error);
        }
    };

    const isAuthenticated = !!user;
    const hasPermission = userRole;

    return (
        <AuthContext.Provider value={{ user, loading, login, logout, isAuthenticated, hasPermission }}>
            {children}
        </AuthContext.Provider>
    );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = (): AuthContextType => {
    const context = useContext(AuthContext);
    if (!context) {throw new Error('useAuth must be used within an AuthProvider');}
    return context;
};
