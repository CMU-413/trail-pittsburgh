import React, {
    createContext, useEffect, useState, useContext 
} from 'react';
import { useNavigate } from 'react-router-dom';
import { User } from '../types';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: () => void;
  logout: () => void;
  isAuthenticated: boolean;
  hasPermission: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
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
        } catch (error) {
            setUser(null);
        } finally {
            setLoading(false);
        }
    };

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
            console.error("Login failed", error);
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
            console.error("Logout failed", error);
        }
    };

    const isAuthenticated = !!user;
    const hasPermission = user?.email?.endsWith('@trailpittsburgh.org') ?? false;

    return (
        <AuthContext.Provider value={{ user, loading, login, logout, isAuthenticated, hasPermission }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = (): AuthContextType => {
    const context = useContext(AuthContext);
    if (!context) {throw new Error('useAuth must be used within an AuthProvider');}
    return context;
};
