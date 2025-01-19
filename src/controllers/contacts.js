////////////////////////////////////////////////////////////////////
import {
  getAllContacts,
  getContact,
  createContact,
  updateContact,
  deleteContact,
} from '../services/contacts.js';
import createHttpError from 'http-errors';
import { parsePaginationParams } from '../utils/parsePaginationParams.js';
import { parseSortParams } from '../utils/parseSortParams.js';
import { parseFilterParams } from '../utils/parseFilterParams.js';
import { saveFileToUploadDir } from '../utils/saveFileToUploadDir.js';
import { saveFileToCloudinary } from '../utils/saveFileToCloudinary.js';
import { getEnvVar } from '../utils/getEnvVar.js';
////////////////////////////////////////////////////////////////////
export const getContactsController = async (req, res) => {
  //
  const { page, perPage } = parsePaginationParams(req.query);
  const { sortBy, sortOrder } = parseSortParams(req.query);
  const filter = parseFilterParams(req.query);
  filter.userId = req.user._id;
  //
  const contacts = await getAllContacts({
    page,
    perPage,
    sortBy,
    sortOrder,
    filter,
  });
  //
  res.json({
    status: 200,
    message: 'Successfully found contacts!',
    data: contacts,
  });
};
////////////////////////////////////////////////////////////////////
export const getContactByIdController = async (req, res) => {
  //
  const { contactId: _id } = req.params;
  const { _id: userId } = req.user;
  //
  const contact = await getContact({ _id, userId });
  if (!contact) {
    throw createHttpError(404, 'Contact not found');
  }
  //
  res.json({
    status: 200,
    message: `Successfully found contact by id: ${_id}`,
    data: contact,
  });
};
////////////////////////////////////////////////////////////////////
export const createContactController = async (req, res) => {
  //
  const { _id: userId } = req.user;
  //
  const contact = await createContact({ ...req.body, userId });
  //
  res.status(201).json({
    status: 201,
    message: `Successfully created a contact!`,
    data: contact,
  });
};
////////////////////////////////////////////////////////////////////
export const upsertContactController = async (req, res) => {
  //
  const { contactId: _id } = req.params;
  const { _id: userId } = req.user;
  //
  const result = await updateContact(
    { _id, userId },
    { ...req.body, userId },
    {
      upsert: true,
    },
  );
  if (!result) {
    throw createHttpError(404, 'Contact not found');
  }
  //
  const status = result.isNew ? 201 : 200;
  //
  res.status(status).json({
    status,
    message: `Successfully upserted a contact!`,
    data: result.contact,
  });
};
////////////////////////////////////////////////////////////////////
export const patchContactController = async (req, res) => {
  //
  const { contactId: _id } = req.params;
  const { _id: userId } = req.user;
  //
  const photo = req.file;
  let photoUrl;
  if (photo) {
    if (getEnvVar('ENABLE_CLOUDINARY') === 'true') {
      photoUrl = await saveFileToCloudinary(photo);
    } else {
      photoUrl = await saveFileToUploadDir(photo);
    }
  }
  //
  const result = await updateContact(
    { _id, userId },
    { ...req.body, photo: photoUrl },
  );
  if (!result) {
    throw createHttpError(404, 'Contact not found');
  }
  //
  res.json({
    status: 200,
    message: `Successfully patched a contact!`,
    data: result.contact,
  });
};
////////////////////////////////////////////////////////////////////
export const deleteContactController = async (req, res) => {
  //
  const { contactId: _id } = req.params;
  const { _id: userId } = req.user;
  //
  const contact = await deleteContact({ _id, userId });
  if (!contact) {
    throw createHttpError(404, 'Contact not found');
  }
  //
  res.status(204).send();
};
////////////////////////////////////////////////////////////////////
