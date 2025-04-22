import { User } from '../types';

export interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: () => void;
  logout: () => void;
  isAuthenticated: boolean;
  hasPermission: boolean;
} 
