import { Router } from 'express';
import { validateRequest } from '../../middleware/validateRequest';
import {
  createExerciseHandler,
  deleteExerciseHandler,
  listExercisesHandler,
  submitExerciseHandler,
  updateExerciseHandler,
} from './exercises.controller';
import { validateExerciseCreation, validateExerciseSubmission, validateExerciseUpdate } from './exercises.validation';

const router: Router = Router();

router.get('/', listExercisesHandler);
router.post('/', validateRequest(validateExerciseCreation), createExerciseHandler);
router.put('/:exerciseId', validateRequest(validateExerciseUpdate), updateExerciseHandler);
router.delete('/:exerciseId', deleteExerciseHandler);
router.post('/:exerciseId/submit', validateRequest(validateExerciseSubmission), submitExerciseHandler);

export default router;
