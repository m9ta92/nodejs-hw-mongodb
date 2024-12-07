import { model } from 'mongoose';
import { contactsSchema } from '../../validation/contactsSchema.js';

export const ContactsCollection = model('contacts', contactsSchema);
