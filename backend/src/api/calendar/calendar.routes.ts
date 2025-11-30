import { Router } from 'express';
import { validateRequest } from '../../middleware/validateRequest';
import { createEventHandler, deleteEventHandler, listEventsHandler, updateEventHandler } from './calendar.controller';
import { validateCalendarCreation, validateCalendarUpdate } from './calendar.validation';

const router: Router = Router();

router.get('/events', listEventsHandler);
router.post('/events', validateRequest(validateCalendarCreation), createEventHandler);
router.put('/events/:eventId', validateRequest(validateCalendarUpdate), updateEventHandler);
router.delete('/events/:eventId', deleteEventHandler);

export default router;
