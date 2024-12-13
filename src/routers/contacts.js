import { Router } from 'express';
import {
  createContactController,
  deleteContactController,
  getContactByIdController,
  getContactsController,
  patchContactController,
  upsertContactController,
} from '../controllers/contacts.js';
import { ctrlWrapper } from '../utils/ctrlWrapper.js';

const contactsRouter = Router();

contactsRouter.get('/', (req, res) => {
  res.json({
    message: 'fuck this',
  });
});

contactsRouter.get('/contacts', ctrlWrapper(getContactsController));

contactsRouter.get(
  '/contacts/:contactId',
  ctrlWrapper(getContactByIdController),
);

contactsRouter.post('/contacts', ctrlWrapper(createContactController));

contactsRouter.delete(
  '/contacts/:contactId',
  ctrlWrapper(deleteContactController),
);

contactsRouter.put(
  '/contacts/:contactId',
  ctrlWrapper(upsertContactController),
);

contactsRouter.patch(
  '/contacts/:contactId',
  ctrlWrapper(patchContactController),
);

export default contactsRouter;
