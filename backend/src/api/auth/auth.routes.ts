import { Router } from 'express';
import { registerUserHandler, loginUserHandler, getUserHandler, updateUserProfileHandler, updateUserPasswordHandler } from './auth.controller';
import { validateRequest } from '../../middleware/validateRequest';
import { validateRegisterInput, validateLoginInput } from './auth.validation';

const router: Router = Router();

router.post('/register', validateRequest(validateRegisterInput), registerUserHandler);
router.post('/login', validateRequest(validateLoginInput), loginUserHandler);
router.get('/users/:userId', getUserHandler);
router.patch('/users/:userId/profile', updateUserProfileHandler);
router.patch('/users/:userId/password', updateUserPasswordHandler);

export default router;