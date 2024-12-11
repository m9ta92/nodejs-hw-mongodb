import { getAllContacts, getContactById } from '../services/contacts.js';
import createHttpError from 'http-errors';

export const getContactsController = async (req, res) => {
  const contacts = await getAllContacts();

  res.json({
    status: 200,
    message: 'Successfully found contacts!',
    data: contacts,
  });
};

export const getContactByIdController = async (req, res, next) => {
  const { contactId } = req.params;
  const contact = await getContactById(contactId);

  // Старий код res.status(404)
  //   if (!contact) {
  //     res.status(404).json({
  //       message: 'Contact not found',
  //     });
  //     return;
  //   }

  // А тепер додаємо базову обробку помилки замість res.status(404)
  // Після виклику next, обробник помилок в нашому додатку (error middleware) у файлі server.js, перехопить і опрацює цю помилку.
  // Виклик next передає керування до наступного middleware в ланцюжку обробки запитів, але код в тілі самого контролера все ще виконається.
  // Тому, після виклику next обов’язково потрібно додати return, щоб у разі помилки припинити виконання подальшого коду у контролері

  if (!contact) {
    // next(new Error('Contact not found'));
    // return;

    // Створюємо та налаштовуємо помилку
    throw createHttpError(404, 'Student not found');
  }

  res.json({
    status: 200,
    message: 'Successfully found contact with id {contactId}!',
    data: contact,
  });
};
