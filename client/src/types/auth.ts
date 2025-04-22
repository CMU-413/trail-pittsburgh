export interface User {
    id: string;
    email: string;
    name?: string;
    picture?: string;
}

export interface AuthContextType {
    user: User | null;
    loading: boolean;
    isAuthenticated: boolean;
    hasPermission: boolean;
    login: () => void;
    logout: () => void;
}
