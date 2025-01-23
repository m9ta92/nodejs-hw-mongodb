////////////////////////////////////////////////////////////////////
import { ContactsCollection } from '../db/models/contacts.js';
import { calculatePaginationData } from '../utils/calculatePaginationData.js';
////////////////////////////////////////////////////////////////////
export const getAllContacts = async ({
  page = 1,
  perPage = 2,
  sortOrder = 'asc',
  sortBy = 'name',
  filter = {},
}) => {
  const limit = perPage;
  const skip = (page - 1) * perPage;
  const contactsQuery = ContactsCollection.find();
  //
  if (filter.userId) {
    contactsQuery.where('userId').equals(filter.userId);
  }
  //
  const contactsCount = await ContactsCollection.find()
    .merge(contactsQuery)
    .countDocuments();
  //
  const contacts = await contactsQuery
    .find()
    .skip(skip)
    .limit(limit)
    .sort({ [sortBy]: sortOrder })
    .exec();
  //
  const paginationData = calculatePaginationData(contactsCount, perPage, page);
  //
  return {
    contacts,
    // ...paginationData,
  };
};
////////////////////////////////////////////////////////////////////
export const getContactById = (id) => ContactsCollection.findById(id);
////////////////////////////////////////////////////////////////////
export const getContact = async (filter) => {
  return await ContactsCollection.findOne(filter);
};
////////////////////////////////////////////////////////////////////
export const createContact = async (payload) => {
  return await ContactsCollection.create(payload);
};
////////////////////////////////////////////////////////////////////
export const updateContact = async (filter, payload, options = {}) => {
  //
  const rawResult = await ContactsCollection.findOneAndUpdate(filter, payload, {
    new: true,
    includeResultMetadata: true,
    ...options,
  });
  if (!rawResult || !rawResult.value) return null;
  //
  return {
    contact: rawResult.value,
    isNew: Boolean(rawResult?.lastErrorObject?.upserted),
  };
};
////////////////////////////////////////////////////////////////////
export const deleteContact = async (filter) => {
  return await ContactsCollection.findOneAndDelete(filter);
};
