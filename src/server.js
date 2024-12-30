////////////////////////////////////////////////////////////////////
import express from 'express';
import cors from 'cors';
import pino from 'pino-http';
import cookieParser from 'cookie-parser';
import { getEnvVar } from './utils/getEnvVar.js';
import contactsRouter from './routers/contacts.js';
import { notFoundHandler } from './middlewares/notFoundHandler.js';
import { errorHandler } from './middlewares/errorHandler.js';
import authRouter from './routers/auth.js';
////////////////////////////////////////////////////////////////////
const PORT = Number(getEnvVar('PORT', '3000'));
////////////////////////////////////////////////////////////////////
export function setupServer() {
  //
  const app = express();
  //
  app.use(express.json());
  app.use(cors());
  app.use(cookieParser());
  app.use(
    pino({
      transport: {
        target: 'pino-pretty',
      },
    }),
  );
  app.use('/auth', authRouter);
  app.use((req, res, next) => {
    console.log(`Time: ${new Date().toLocaleString()}`);
    next();
  });
  app.use(contactsRouter);
  app.use('*', notFoundHandler);
  app.use(errorHandler);
  //
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
}
////////////////////////////////////////////////////////////////////
