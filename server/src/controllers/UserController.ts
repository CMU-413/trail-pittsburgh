import express from 'express';

import { UserService } from '@/services';
import { logger } from '@/utils/logger';

export class UserController {
    private readonly userService: UserService;

    constructor(userService: UserService) {
        this.userService = userService;
        this.getUserRole = this.getUserRole.bind(this);
        this.getAllUsers = this.getAllUsers.bind(this);
        this.updateUserRole = this.updateUserRole.bind(this);
    }

    public async getUserRole(req: express.Request, res: express.Response) {
        // Get userId from the authenticated token
        // eslint-disable-next-line
        const userId = (req as any).user?.id;
        
        if (!userId) {
            res.status(401).json({ message: 'Unauthorized' });
            return;
        }
        
        try {
            const role = await this.userService.getUserRole(userId);

            if (!role) {
                res.status(404).json({ message: 'User not found.' });
                return;
            }

            res.status(200).json({ role });
        } catch (error) {
            logger.error(`Error fetching user role for user ${userId}`, error);
            res.status(500).json({ message: 'Failed to retrieve user role' });
        }
    }

    public async getAllUsers(req: express.Request, res: express.Response) {
        try {
            const users = await this.userService.getAllUsers();
            res.status(200).json(users);
        } catch (error) {
            logger.error('Error fetching all users', error);
            res.status(500).json({ message: 'Failed to retrieve all users' });
        }
    }

    public async updateUserRole(req: express.Request, res: express.Response) {
        const { userId } = req.params;
        const { role } = req.body;
        try {
            const updatedUser = await this.userService.updateUserRole(parseInt(userId), role);
            res.status(200).json(updatedUser);
        } catch (error) {
            logger.error('Error updating user role', error);
            res.status(500).json({ message: 'Failed to update user role' });
        }
    }
}
