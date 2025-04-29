import express from 'express';

import { UserController } from '@/controllers';
import { UserRepository } from '@/repositories';
import { UserService } from '@/services';
import { authenticateToken, requireAdmin } from '@/middlewares';

const userRepository = new UserRepository();
const userService = new UserService(userRepository);
const userController = new UserController(userService);

const router = express.Router();

// User Routes
router.get('/:userId/role',
    authenticateToken,
    userController.getUserRole
);

export { router as userRouter };
