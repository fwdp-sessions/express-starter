import express from 'express';
import { validate } from '../middleware/validate';
import {
  getCurrentUserHandler,
  loginUserHandler,
  logoutUserHandler,
  refreshAccessTokenHandler,
  registerUserHandler,
} from '../controllers/auth.controller';
import { userCreateBodySchema, userLoginBodySchema } from '../schema/user';
import { requireUser } from '../middleware/requireUser';
import { deserializeUser } from '../middleware/deserializeUser';

const router = express.Router();

router.post('/register', validate(userCreateBodySchema), registerUserHandler);

router.post('/login', validate(userLoginBodySchema), loginUserHandler);

// Protected Routes
router.get('/me', deserializeUser, requireUser, getCurrentUserHandler);

router.get('/logout', deserializeUser, requireUser, logoutUserHandler);

router.get('/refreshtokens', refreshAccessTokenHandler);

export default router;
