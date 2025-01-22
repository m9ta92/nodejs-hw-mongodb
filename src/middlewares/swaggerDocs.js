import fs from 'node:fs';

import { SWAGGER_PATH } from '../constants/index.js';

export const swaggerDoc = JSON.parse(fs.readFileSync(SWAGGER_PATH, 'utf-8'));
