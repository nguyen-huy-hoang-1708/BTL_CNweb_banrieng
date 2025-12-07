import { Router } from 'express';
import { 
  getNotificationsHandler, 
  markAsReadHandler, 
  markAllAsReadHandler 
} from './notifications.controller';

const router: Router = Router();

router.get('/', getNotificationsHandler);
router.patch('/:notificationId/read', markAsReadHandler);
router.post('/mark-all-read', markAllAsReadHandler);

export default router;
