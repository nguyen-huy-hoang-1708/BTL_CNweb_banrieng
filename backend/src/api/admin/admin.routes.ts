import { Router } from 'express';
import { 
  getAllUsersHandler, 
  updateUserRoleHandler, 
  deleteUserHandler,
  getAllRoadmapsHandler,
  createRoadmapHandler,
  updateRoadmapHandler,
  deleteRoadmapHandler,
  createModuleHandler,
  updateModuleHandler,
  deleteModuleHandler
} from './admin.controller';
import { requireAdmin } from '../../middleware/requireAdmin';

const router: Router = Router();

// All admin routes require admin role
router.use(requireAdmin);

// User management
router.get('/users', getAllUsersHandler);
router.patch('/users/:userId/role', updateUserRoleHandler);
router.delete('/users/:userId', deleteUserHandler);

// Roadmap management
router.get('/roadmaps', getAllRoadmapsHandler);
router.post('/roadmaps', createRoadmapHandler);
router.patch('/roadmaps/:roadmapId', updateRoadmapHandler);
router.delete('/roadmaps/:roadmapId', deleteRoadmapHandler);

// Module management
router.post('/roadmaps/:roadmapId/modules', createModuleHandler);
router.patch('/modules/:moduleId', updateModuleHandler);
router.delete('/modules/:moduleId', deleteModuleHandler);

export default router;
