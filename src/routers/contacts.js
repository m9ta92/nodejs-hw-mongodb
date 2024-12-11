import { Router } from 'express'; // - функціонал Express Router
import {
  getContactByIdController,
  getContactsController,
} from '../controllers/contacts.js';
import { ctrlWrapper } from '../utils/ctrlWrapper.js';

const contactsRouter = Router();

//  замість app.get використовуємо створений contactsRouter.get

contactsRouter.get('/', (req, res) => {
  res.json({
    message: 'HOME PAGE',
  });
});

contactsRouter.get('/contacts', ctrlWrapper(getContactsController));

contactsRouter.get(
  '/contacts/:contactId',
  ctrlWrapper(getContactByIdController),
);

export default contactsRouter;
