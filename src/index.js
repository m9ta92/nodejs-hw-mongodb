// Файл, з якого буде починатися виконання нашої програми :)

import { setupServer } from './server.js';
import { initMongoConnection } from './db/initMongoConnection.js';

// setupServer();
const boostrap = async () => {
  await initMongoConnection();
  setupServer();
};

boostrap();
