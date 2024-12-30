////////////////////////////////////////////////////////////////////
import { SORT_ORDER } from '../constants/contacts.js';
import { ContactsCollection } from '../db/models/contacts.js';
import { calculatePaginationData } from '../utils/calculatePaginationData.js';
////////////////////////////////////////////////////////////////////
export const getAllContacts = async ({
  page = 1,
  perPage = 2,
  sortOrder = SORT_ORDER.ASC,
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
    data: contacts,
    ...paginationData,
  };
};
////////////////////////////////////////////////////////////////////
export const getContactById = async (contactId) => {
  //
  const contact = await ContactsCollection.findById(contactId);
  //
  return contact;
};
////////////////////////////////////////////////////////////////////
export const getContact = (filter) => ContactsCollection.findOne(filter);
////////////////////////////////////////////////////////////////////
export const createContact = async (payload) => {
  return await ContactsCollection.create(payload);
};
////////////////////////////////////////////////////////////////////
export const updateContact = async ({ filter }, payload, options = {}) => {
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
export const deleteContact = async ({ contactId, userId }) => {
  //
  const contact = await ContactsCollection.findOneAndDelete({
    _id: contactId,
    userId,
  });
  //
  return contact;
};
