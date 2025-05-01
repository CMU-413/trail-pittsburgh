import { UserRoleEnum } from '../types';

/**
 * Formats a UserRoleEnum value into a human-readable string
 */
export const formatUserRole = (role: UserRoleEnum | undefined | null): string => {
    if (!role) {return 'Public User';}
    
    switch (role) {
    case UserRoleEnum.ROLE_SUPERADMIN:
        return 'Super Admin';
    case UserRoleEnum.ROLE_ADMIN:
        return 'Admin';
    case UserRoleEnum.ROLE_USER:
        return 'User';
    default:
        return 'Public User';
    }
};

/**
 * Determines if a user role has access to a feature requiring a specific role level
 */
export const hasAccess = (role: UserRoleEnum | undefined | null, requiredRole: UserRoleEnum): boolean => {
    if (!role) {return false;}
    
    switch (role) {
    case UserRoleEnum.ROLE_SUPERADMIN:
        return true;
    case UserRoleEnum.ROLE_ADMIN:
        return requiredRole === UserRoleEnum.ROLE_ADMIN || requiredRole === UserRoleEnum.ROLE_USER;
    case UserRoleEnum.ROLE_USER:
        return requiredRole === UserRoleEnum.ROLE_USER;
    default:
        return false;
    }
}; 
