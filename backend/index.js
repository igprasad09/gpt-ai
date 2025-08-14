import express from 'express';
import AiRouter from './routes/ai.js';
import ExeRouter from './routes/codeExecuter.js';
import cors from 'cors';
import dotenv from 'dotenv';
dotenv.config();

const app = express();
app.use(express.json());
app.use(cors());

app.use('/', AiRouter);
app.use('/code', ExeRouter);

// ✅ Instead of app.listen, export default for Vercel
export default app;
