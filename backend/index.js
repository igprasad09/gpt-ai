import express from 'express';
import AiRouter from './routes/ai.js';
import cors from 'cors';
const app = express();
app.use(express.json());
app.use(cors());

app.use('/',AiRouter);

app.listen(3000, console.log("server is running.........."));