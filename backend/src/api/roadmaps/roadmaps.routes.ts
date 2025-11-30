import { Router } from 'express';
import { listRoadmapsHandler, getRoadmapHandler, enrollRoadmapHandler } from './roadmaps.controller';

const router: Router = Router();

router.get('/', listRoadmapsHandler);
router.get('/:roadmapId', getRoadmapHandler);
router.post('/:roadmapId/enroll', enrollRoadmapHandler);

export default router;
