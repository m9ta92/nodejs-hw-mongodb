import express from 'express';
import cors from 'cors';
import pino from 'pino-http';
import { getEnvVar } from './utils/getEnvVar.js';
import contactsRouter from './routers/contacts.js';
import { notFoundHandler } from './middlewares/notFoundHandler.js';
import { errorHandler } from './middlewares/errorHandler.js';

// Отримуємо порт з змінної оточення або 3000 за замовчуванням
const PORT = Number(getEnvVar('PORT', '3000'));

// Тут знаходится логіка роботи express-сервера
export function setupServer() {
  // Створення серверу за допомогою виклику express()
  const app = express();

  // Вбудований у express middleware для обробки (парсингу) JSON-даних у запитах POST або PATCH
  app.use(express.json());

  // Налаштування CORS
  app.use(cors());

  // Налаштування PINO-HTTP
  app.use(
    pino({
      transport: {
        target: 'pino-pretty',
      },
    }),
  );

  // Middleware для логування часу запиту
  app.use((req, res, next) => {
    console.log(`Time: ${new Date().toLocaleString()}`);
    next();
  });

  // Додаємо роутер(Маршрути) до app як middleware
  app.use(contactsRouter);

  // Middleware до неіснуючого маршруту
  app.use('*', notFoundHandler);

  // Middleware для обробких помилок (приймає 4 аргументи)
  app.use(errorHandler);

  // Запустити сервер. Для цього нам потрібно викликати метод сервера listen,
  // передавши йому: першим аргументом номер порту, на якому ми хочемо його запустити, наприклад, 3000
  // другим аргументом колбек функцію, що виконається, коли сервер успішно запуститься
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
}
