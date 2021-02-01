import { Router } from 'express';
import * as authService from '../services/auth.service';
import * as userService from '../services/user.service';
import * as middleware from '../middleware/auth';

const userRouter = Router();

userRouter.post('/signin', authService.getUserData);
userRouter.post('/signup', authService.create);
userRouter.get('/logout', middleware.auth, authService.logout);
userRouter.get('/info', middleware.auth, userService.getUserInfo);

export default userRouter;
