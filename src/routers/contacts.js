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
import { validateBody } from '../middlewares/validateBody.js';
import {
  contactAddSchema,
  contactUpdateSchema,
} from '../validation/contacts.js';
import { isValidId } from '../middlewares/isValidId.js';

const contactsRouter = Router();

contactsRouter.get('/', (req, res) => {
  res.json({
    message: 'HOME PAGE :)',
  });
});

contactsRouter.get('/contacts', ctrlWrapper(getContactsController));

contactsRouter.get(
  '/contacts/:contactId',
  isValidId,
  ctrlWrapper(getContactByIdController),
);

contactsRouter.post(
  '/contacts',
  validateBody(contactAddSchema),
  ctrlWrapper(createContactController),
);

contactsRouter.delete(
  '/contacts/:contactId',
  isValidId,
  ctrlWrapper(deleteContactController),
);

contactsRouter.put(
  '/contacts/:contactId',
  isValidId,
  ctrlWrapper(upsertContactController),
);

contactsRouter.patch(
  '/contacts/:contactId',
  isValidId,
  validateBody(contactUpdateSchema),
  ctrlWrapper(patchContactController),
);

export default contactsRouter;
