import { Router } from 'express';
import { validateRequest } from '../../middleware/validateRequest';
import { createCVHandler, listCVsHandler, optimizeCVHandler, updateCVHandler } from './cvs.controller';
import { validateCVCreation, validateCVOptimization, validateCVUpdate } from './cvs.validation';

const router: Router = Router();

router.get('/', listCVsHandler);
router.post('/', validateRequest(validateCVCreation), createCVHandler);
router.put('/:cvId', validateRequest(validateCVUpdate), updateCVHandler);
router.post('/:cvId/optimize', validateRequest(validateCVOptimization), optimizeCVHandler);

export default router;
