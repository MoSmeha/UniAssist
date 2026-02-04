import * as contactUsService from '../services/contactUs.service.js';

// Create a new contact message (authenticated)
export const createContact = async (req, res, next) => {
  try {
    const newMessage = await contactUsService.createContact(req.body, req.user._id);

    res.status(201).json({
      status: 'success',
      message: 'Your contact message has been successfully submitted!',
      data: { contact: newMessage }
    });
  } catch (err) {
    if (err.message.includes('required') || err.message.includes('characters') || err.message.includes('Invalid category')) {
      return res.status(400).json({ status: 'fail', message: err.message });
    }
    console.error('Error creating contact message:', err);
    next(err);
  }
};

// Get all contact messages (admin only)
export const getAllContacts = async (req, res, next) => {
  try {
    const messages = await contactUsService.getAllContacts();

    res.status(200).json({
      status: 'success',
      results: messages.length,
      data: { messages }
    });
  } catch (err) {
    console.error('Error fetching all contact messages:', err);
    res.status(500).json({
      status: 'error',
      message: 'Failed to retrieve contact messages. Please try again later.'
    });
  }
};

// Get a single contact message (admin only)
export const getContact = async (req, res, next) => {
  try {
    const message = await contactUsService.getContactById(req.params.id);
    res.status(200).json({ status: 'success', data: { message } });
  } catch (err) {
    const statusCode = err.message.includes('No contact message found') ? 404 :
                      err.message.includes('Invalid message ID') ? 400 : 500;
    if (statusCode !== 500) {
      return res.status(statusCode).json({ status: 'fail', message: err.message });
    }
    console.error('Error fetching single contact message:', err);
    res.status(500).json({
      status: 'error',
      message: 'Failed to retrieve the contact message. Please try again later.'
    });
  }
};

// Delete a contact message (admin only)
export const deleteContact = async (req, res, next) => {
  try {
    await contactUsService.deleteContact(req.params.id);
    res.status(204).json({ status: 'success', data: null });
  } catch (err) {
    const statusCode = err.message.includes('No contact message found') ? 404 :
                      err.message.includes('Invalid message ID') ? 400 : 500;
    if (statusCode !== 500) {
      return res.status(statusCode).json({ status: 'fail', message: err.message });
    }
    console.error('Error deleting contact message:', err);
    res.status(500).json({
      status: 'error',
      message: 'Failed to delete the contact message. Please try again later.'
    });
  }
};

