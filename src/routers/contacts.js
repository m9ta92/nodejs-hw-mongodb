////////////////////////////////////////////////////////////////////
import { Router } from 'express';
import {
  getContactsController,
  getContactByIdController,
  createContactController,
  patchContactController,
  upsertContactController,
  deleteContactController,
} from '../controllers/contacts.js';
import { ctrlWrapper } from '../utils/ctrlWrapper.js';
import { validateBody } from '../middlewares/validateBody.js';
import {
  contactAddSchema,
  contactUpdateSchema,
} from '../validation/contacts.js';
import { isValidId } from '../middlewares/isValidId.js';
import { authenticate } from '../middlewares/authenticate.js';
import { upload } from '../middlewares/multer.js';
////////////////////////////////////////////////////////////////////
const contactsRouter = Router();
////////////////////////////////////////////////////////////////////
contactsRouter.use(authenticate);
////////////////////////////////////////////////////////////////////
contactsRouter.get('/', (req, res) => {
  res.json({
    message: 'HOME PAGE :)',
  });
});
////////////////////////////////////////////////////////////////////
contactsRouter.get('/contacts', ctrlWrapper(getContactsController));
////////////////////////////////////////////////////////////////////
contactsRouter.get(
  '/contacts/:contactId',
  isValidId,
  ctrlWrapper(getContactByIdController),
);
////////////////////////////////////////////////////////////////////
contactsRouter.post(
  '/contacts',
  upload.single('photo'),
  validateBody(contactAddSchema),
  ctrlWrapper(createContactController),
);
////////////////////////////////////////////////////////////////////
contactsRouter.put(
  '/contacts/:contactId',
  isValidId,
  ctrlWrapper(upsertContactController),
);
////////////////////////////////////////////////////////////////////
contactsRouter.patch(
  '/contacts/:contactId',
  isValidId,
  upload.single('photo'),
  validateBody(contactUpdateSchema),
  ctrlWrapper(patchContactController),
);
////////////////////////////////////////////////////////////////////
contactsRouter.delete(
  '/contacts/:contactId',
  isValidId,
  ctrlWrapper(deleteContactController),
);
////////////////////////////////////////////////////////////////////
export default contactsRouter;
