import express, {Application, Request, Response} from 'express';
import cors from 'cors';
import authRouter from './api/auth/auth.routes';
import adminRouter from './api/admin/admin.routes';
import calendarRouter from './api/calendar/calendar.routes';
import certificatesRouter from './api/certificates/certificates.routes';
import cvsRouter from './api/cvs/cvs.routes';
import exercisesRouter from './api/exercises/exercises.routes';
import interviewsRouter from './api/interviews/interviews.routes';
import notesRouter from './api/notes/notes.routes';
import progressRouter from './api/progress/progress.routes';
import roadmapsRouter from './api/roadmaps/roadmaps.routes';

const app: Application = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({extended: true}));

app.use('/api/auth', authRouter);
app.use('/api/admin', adminRouter);
app.use('/api/calendar', calendarRouter);
app.use('/api/progress', progressRouter);
app.use('/api/roadmaps', roadmapsRouter);
app.use('/api/certificates', certificatesRouter);
app.use('/api/cvs', cvsRouter);
app.use('/api/exercises', exercisesRouter);
app.use('/api/interviews', interviewsRouter);
app.use('/api/modules/:moduleId', notesRouter);
app.get('/', (req: Request, res: Response) => {
    res.status(200).json({success: true, message: 'Welcome to SkillSync API'});
});

export default app;