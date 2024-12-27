import { model, Schema } from 'mongoose';
import { typeList } from '../../constants/contacts.js';

export const contactsSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    phoneNumber: {
      type: String,
      required: true,
    },
    email: {
      type: String,
    },
    isFavourite: {
      type: Boolean,
      required: false,
    },
    contactType: {
      type: String,
      enum: typeList,
      required: true,
      default: 'personal',
    },
  },
  {
    timestamps: true,
    versionKey: false,
  },
);

export const ContactsCollection = model('contacts', contactsSchema);
