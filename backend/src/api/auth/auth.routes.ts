import { Router } from 'express';
import { registerUserHandler } from './auth.controller';
import { validateRequest } from '../../middleware/validateRequest';
import { validateRegisterInput } from './auth.validation';

const router: Router = Router();

router.post('/register', validateRequest(validateRegisterInput), registerUserHandler);

export default router;