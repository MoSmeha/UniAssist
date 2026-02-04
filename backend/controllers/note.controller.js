import * as noteService from "../services/note.service.js";

// Create a new note
export const createNote = async (req, res) => {
  try {
    const note = await noteService.createNote(req.body, req.user._id);
    return res.status(201).json({ success: true, note });
  } catch (err) {
    if (err.message.includes("required") || err.message.includes("must be") || err.message.includes("Invalid color")) {
      return res.status(400).json({ success: false, message: err.message });
    }
    return res.status(500).json({ success: false, message: err.message });
  }
};

// Get all notes for the logged-in user
export const getNotes = async (req, res) => {
  try {
    const notes = await noteService.getNotes(req.user._id);
    return res.status(200).json({ success: true, notes });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

// Get a single note by its ID
export const getNoteById = async (req, res) => {
  try {
    const note = await noteService.getNoteById(req.params.id, req.user._id);
    return res.status(200).json({ success: true, note });
  } catch (err) {
    const statusCode = err.message === "Note not found" ? 404 : 500;
    return res.status(statusCode).json({ success: false, message: err.message });
  }
};

export const updateNote = async (req, res) => {
  try {
    const note = await noteService.updateNote(req.params.id, req.user._id, req.body);
    return res.status(200).json({ success: true, note });
  } catch (err) {
    const statusCode = err.message === "Note not found" ? 404 :
                      (err.message.includes("must be") || err.message.includes("Invalid color")) ? 400 : 500;
    return res.status(statusCode).json({ success: false, message: err.message });
  }
};

export const deleteNote = async (req, res) => {
  try {
    await noteService.deleteNote(req.params.id, req.user._id);
    return res.status(200).json({ success: true, message: "Note deleted" });
  } catch (err) {
    const statusCode = err.message === "Note not found" ? 404 : 500;
    return res.status(statusCode).json({ success: false, message: err.message });
  }
};

export const searchNotes = async (req, res) => {
  try {
    const results = await noteService.searchNotes(req.user._id, req.query.query);
    return res.status(200).json({ success: true, results });
  } catch (err) {
    const statusCode = err.message.includes("required") ? 400 : 500;
    return res.status(statusCode).json({ success: false, message: err.message });
  }
};
