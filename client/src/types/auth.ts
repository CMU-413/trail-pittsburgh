import { CredentialResponse } from '@react-oauth/google';

export interface GoogleUser {
    email: string;
    name: string;
    picture: string;
    sub: string; // Google user ID
    hd?: string; // Hosted domain (for organization emails)
}

export interface JwtPayload extends GoogleUser {
    exp: number; // Expiration time
}

export interface AuthContextType {
    user: GoogleUser | null;
    isLoading: boolean;
    isAuthenticated: boolean;
    hasPermission: boolean;
    login: (credentialResponse: CredentialResponse) => void;
    logout: () => void;
}
