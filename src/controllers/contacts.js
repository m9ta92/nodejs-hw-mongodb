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
export const getContactByIdController = async (req, res, next) => {
  //
  const { _id: userId } = req.user;
  const { contactId } = req.params;
  //
  const contact = await getContact({ _id, userId });
  if (!contact) {
    throw createHttpError(404, 'Contact not found');
  }
  //
  res.json({
    status: 200,
    message: `Successfully found contact with id: ${contactId}`,
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
export const upsertContactController = async (req, res, next) => {
  //
  const { _id: userId } = req.user;
  const { contactId } = req.params;
  //
  const result = await updateContact(
    contactId,
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
export const patchContactController = async (req, res, next) => {
  //
  const { _id: userId } = req.user;
  const { contactId } = req.params;
  //
  const result = await updateContact({ contactId, userId }, req.body);
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
export const deleteContactController = async (req, res, next) => {
  //
  const { _id: userId } = req.user;
  const { contactId } = req.params;
  //
  const contact = await deleteContact({ contactId, userId });
  if (!contact) {
    throw createHttpError(404, 'Contact not found');
  }
  //
  res.status(204).send();
};
////////////////////////////////////////////////////////////////////
