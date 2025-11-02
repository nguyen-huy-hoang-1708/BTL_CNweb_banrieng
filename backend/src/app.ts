import express, {Application, Request, Response} from 'express';
import cors from 'cors';
import authRouter from './api/auth/auth.routes';

const app: Application = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({extended: true}));

app.use('/api/auth', authRouter);
app.get('/', (req: Request, res: Response) => {
    res.status(200).json({success: true, message: 'Welcome to SkillSync API'});
});

export default app;