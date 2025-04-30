import { UserRoleEnum } from '@prisma/client';
import { Response, NextFunction } from 'express';

import { AuthRequest } from './auth';

import { UserRepository } from '@/repositories';
import { UserService } from '@/services';

const userService = new UserService(new UserRepository());

export function requireRole(requiredRole: UserRoleEnum) {
    return async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
        if (!req.user) {
            res.status(401).json({ message: 'Authentication required' });
            return;
        }

        try {
            const user = await userService.getUserById(req.user.id);

            if (!user) {
                res.status(404).json({ message: 'User not found' });
                return;
            }

            const userRole = user.role;

            let hasPermission = false;

            switch (userRole) {
            case UserRoleEnum.ROLE_SUPERADMIN:
                hasPermission = true;
                break;
            case UserRoleEnum.ROLE_ADMIN:
                hasPermission = requiredRole === UserRoleEnum.ROLE_ADMIN ||
                                    requiredRole === UserRoleEnum.ROLE_USER;
                break;
            case UserRoleEnum.ROLE_USER:
                hasPermission = requiredRole === UserRoleEnum.ROLE_USER;
                break;
            }

            if (!hasPermission) {
                res.status(403).json({ message: 'Insufficient permissions' });
                return;
            }

            next();

        } catch (error) {
            console.error('Authorization error:', error);
            res.status(500).json({ message: 'Internal server error' });
            
        }
    };
}

// Helper middleware to check if user has admin or superadmin role
export const requireAdmin = requireRole(UserRoleEnum.ROLE_ADMIN);

// Helper middleware to check if user has superadmin role
export const requireSuperAdmin = requireRole(UserRoleEnum.ROLE_SUPERADMIN);

// Helper middleware to check if user has user role
export const requireUser = requireRole(UserRoleEnum.ROLE_USER);
