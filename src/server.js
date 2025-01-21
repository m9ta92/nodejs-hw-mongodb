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
import { UPLOAD_DIR } from './constants/index.js';
import { swaggerDoc } from './middlewares/swaggerDocs.js';
import swaggerUI from 'swagger-ui-express';
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
  app.use((req, res, next) => {
    console.log(`Time: ${new Date().toLocaleString()}`);
    next();
  });
  app.use('/api-docs', ...swaggerUI.serve, swaggerUI.setup(swaggerDoc));
  app.use('/auth', authRouter);
  app.use(contactsRouter);
  app.use(errorHandler);
  app.use('/uploads', express.static(UPLOAD_DIR));
  app.use('*', notFoundHandler);
  //
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
}
////////////////////////////////////////////////////////////////////
