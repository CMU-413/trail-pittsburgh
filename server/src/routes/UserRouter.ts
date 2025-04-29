import express from 'express';

import { UserController } from '@/controllers';
import {
    requireSuperAdmin, authenticateToken 
} from '@/middlewares/index';
import { UserRepository } from '@/repositories';
import { UserService } from '@/services';

const userRepository = new UserRepository();
const userService = new UserService(userRepository);
const userController = new UserController(userService);

const router = express.Router();

// User Routes
router.get('/:userId/role',
    authenticateToken,
    userController.getUserRole);

router.get('/',
    authenticateToken,
    requireSuperAdmin,
    userController.getAllUsers);

router.put('/:userId/role',
    authenticateToken,
    requireSuperAdmin,
    userController.updateUserRole);

export { router as userRouter };
