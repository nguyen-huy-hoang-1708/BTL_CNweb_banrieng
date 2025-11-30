import { Router } from 'express';
import { validateRequest } from '../../middleware/validateRequest';
import {
  listInterviewsHandler,
  startInterviewHandler,
  submitInterviewHandler,
} from './interviews.controller';
import { validateInterviewCreation, validateInterviewSubmission } from './interviews.validation';

const router: Router = Router();

router.post('/sessions', validateRequest(validateInterviewCreation), startInterviewHandler);
router.post('/sessions/:sessionId/submit', validateRequest(validateInterviewSubmission), submitInterviewHandler);
router.get('/sessions', listInterviewsHandler);

export default router;