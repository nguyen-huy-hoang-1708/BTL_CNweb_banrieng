import { Router } from 'express';
import { listRoadmapsHandler, getRoadmapHandler, enrollRoadmapHandler, getModulesHandler } from './roadmaps.controller';

const router: Router = Router();

router.get('/', listRoadmapsHandler);
router.get('/:roadmapId/modules', getModulesHandler);
router.get('/:roadmapId/enroll', enrollRoadmapHandler);
router.get('/:roadmapId', getRoadmapHandler);
router.post('/:roadmapId/enroll', enrollRoadmapHandler);

export default router;
