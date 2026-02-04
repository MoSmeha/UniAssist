import ContactUs from '../models/contactUs.model.js';
import mongoose from 'mongoose';

export const createContact = async (contactData, userId) => {
  const { title, description, category } = contactData;

  // Validation
  if (!title) {
    throw new Error('A title is required for your contact message.');
  }
  if (title.length > 100) {
    throw new Error('Title must be at most 100 characters long.');
  }
  if (!description) {
    throw new Error('Please provide a description for your message.');
  }
  if (description.length > 2000) {
    throw new Error('Description cannot exceed 2000 characters.');
  }
  const validCategories = ['bug', 'feedback and suggestions', 'feature request', 'help', 'other'];
  if (category && !validCategories.includes(category)) {
    throw new Error(`Invalid category. Category must be one of: ${validCategories.join(', ')}.`);
  }

  return await ContactUs.create({
    title,
    description,
    category,
    user: userId,
  });
};

export const getAllContacts = async () => {
  return await ContactUs.find()
    .populate({ path: 'user', select: 'firstName lastName profilePic email' })
    .sort('-createdAt');
};

export const getContactById = async (contactId) => {
  try {
    const contact = await ContactUs.findById(contactId)
      .populate({ path: 'user', select: 'firstName lastName profilePic email' });

    if (!contact) {
      throw new Error('No contact message found with that ID.');
    }
    return contact;
  } catch (err) {
    if (err instanceof mongoose.CastError && err.path === '_id') {
      throw new Error(`Invalid message ID: ${contactId}. Please provide a valid ID.`);
    }
    throw err;
  }
};

export const deleteContact = async (contactId) => {
  try {
    const contact = await ContactUs.findByIdAndDelete(contactId);

    if (!contact) {
      throw new Error('No contact message found with that ID to delete.');
    }
    return contact;
  } catch (err) {
    if (err instanceof mongoose.CastError && err.path === '_id') {
      throw new Error(`Invalid message ID: ${contactId}. Please provide a valid ID to delete.`);
    }
    throw err;
  }
};
