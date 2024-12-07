// Тут знаходится логіка роботи express-сервера

import express from 'express';
import cors from 'cors';
import pino from 'pino-http';
import { getEnvVar } from './utils/getEnvVar.js';
import { getAllContacts, getContactById } from './services/contacts.js';

// Отримуємо порт з змінної оточення або 3000 за замовчуванням
const PORT = Number(getEnvVar('PORT', '3000'));

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

  // Маршрути
  app.get('/', (req, res) => {
    res.json({
      message: 'Hello world!',
    });
  });

  app.get('/contacts', async (req, res) => {
    const contacts = await getAllContacts();

    res.json({
      status: 200,
      message: 'Successfully found contacts!',
      data: contacts,
    });
  });

  app.get('/contacts/:contactId', async (req, res) => {
    const { contactId } = req.params;
    const contact = await getContactById(contactId);

    if (!contact) {
      res.status(404).json({
        message: 'Contact not found',
      });
      return;
    }

    res.json({
      status: 200,
      message: 'Successfully found contact with id {contactId}!',
      data: contact,
    });
  });

  // Middleware до неіснуючого маршруту
  app.use('*', (req, res, next) => {
    res.status(404).json({
      message: 'Route not found',
    });
  });

  // Middleware для обробких помилок (приймає 4 аргументи)
  app.use((err, req, res, next) => {
    res.status(500).json({
      message: 'Something went wrong',
      error: err.message,
    });
  });

  // Запустити сервер. Для цього нам потрібно викликати метод сервера listen,
  // передавши йому: першим аргументом номер порту, на якому ми хочемо його запустити, наприклад, 3000
  // другим аргументом колбек функцію, що виконається, коли сервер успішно запуститься
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
}
