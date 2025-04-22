import { createContext } from 'react';
import { AuthContextType } from '../types/auth';

export const AuthContext = createContext<AuthContextType>({
    user: null,
    loading: true,
    isAuthenticated: false,
    hasPermission: false,
    login: () => { },
    logout: () => { },
});
