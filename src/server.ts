import express, { Application, Request, Response } from 'express';
import cors from 'cors';

import globalErrorHandler from './app/middlewares/globalErrorhandler';
import config from './app/config';
import router from './app/routes';
import notFound from './app/middlewares/notFound';
import { databaseConnecting } from './app/config/database.config';
const app: Application = express();

app.use(express.json());
// app.use(cors());

const corsOptions = {
  origin: 'http://localhost:3000',
  credentials: true, 
};

app.use(cors(corsOptions));

databaseConnecting();

app.listen(config.port, () => {
  console.log(`Local         :👉 http://localhost:${config.port}/`);
});

const startServer = (req: Request, res: Response) => {
  try {
    res.send(`${config.wel_come_message}`);
  } catch (error) {
    console.log('server not start');
  }
};
app.get('/', startServer);

app.use('/api/v1', router);
app.use(notFound);
app.use(globalErrorHandler);
