import express from 'express';
import AiRouter from './routes/ai.js';
import ExeRouter from './routes/codeExecuter.js';
import cors from 'cors';
import dotent from 'dotenv';
dotent.config();

const PORT = process.env.PORT;

const app = express();
app.use(express.json());
app.use(cors());

app.use('/',AiRouter);
app.use('/code',ExeRouter);

app.listen(PORT, console.log("server is running.........."));