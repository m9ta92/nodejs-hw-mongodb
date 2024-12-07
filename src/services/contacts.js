import { ContactsCollection } from '../db/models/contacts.js';

export const getAllContacts = async () => {
  const contacts = await ContactsCollection.find(); // це вбудований метод Mongoose для пошуку документів у MongoDB
  return contacts;
};

export const getContactById = async (contactId) => {
  const contact = await ContactsCollection.findById(contactId); // це вбудований метод Mongoose для пошуку одного документа у MongoDB за його id
  return contact;
};
