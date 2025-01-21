import createHttpError from 'http-errors';
import swaggerUI from 'swagger-ui-express';
import fs from 'node:fs';

import { SWAGGER_PATH } from '../constants/index.js';
import path from 'node:path';

export const swaggerDocs = () => {
  try {
    const swaggerDoc = JSON.parse(
      fs.readFileSync(path.resolve(SWAGGER_PATH), 'utf-8'),
    );
    return [swaggerUI.serve, swaggerUI.setup(swaggerDoc)];
  } catch (err) {
    return (req, res, next) =>
      next(createHttpError(500, "Can't load swagger docs"));
  }
};
