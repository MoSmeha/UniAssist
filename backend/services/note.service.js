import Note from "../models/note.model.js";

const ALLOWED_COLORS = ["default", "red", "green", "blue", "yellow", "purple"];

export const createNote = async (noteData, userId) => {
  const { title, content, tags, isPinned, color } = noteData;

  if (!title || !content) {
    throw new Error("Title and content are required.");
  }

  if (tags && !Array.isArray(tags)) {
    throw new Error("Tags must be an array.");
  }

  if (color && !ALLOWED_COLORS.includes(color)) {
    throw new Error("Invalid color value.");
  }

  return await Note.create({
    user: userId,
    title,
    content,
    tags,
    isPinned,
    color,
  });
};

export const getNotes = async (userId) => {
  return await Note.find({ user: userId }).sort({
    isPinned: -1,
    updatedAt: -1,
  });
};

export const getNoteById = async (noteId, userId) => {
  const note = await Note.findOne({ _id: noteId, user: userId });
  if (!note) {
    throw new Error("Note not found");
  }
  return note;
};

export const updateNote = async (noteId, userId, updateData) => {
  const allowedUpdates = ["title", "content", "tags", "isPinned", "color"];
  const updates = {};

  for (const key of allowedUpdates) {
    if (key in updateData) updates[key] = updateData[key];
  }

  if (updates.tags && !Array.isArray(updates.tags)) {
    throw new Error("Tags must be an array.");
  }

  if (updates.color && !ALLOWED_COLORS.includes(updates.color)) {
    throw new Error("Invalid color value.");
  }

  const note = await Note.findOneAndUpdate(
    { _id: noteId, user: userId },
    updates,
    { new: true, runValidators: true }
  );

  if (!note) {
    throw new Error("Note not found");
  }

  return note;
};

export const deleteNote = async (noteId, userId) => {
  const deleted = await Note.findOneAndDelete({
    _id: noteId,
    user: userId,
  });
  if (!deleted) {
    throw new Error("Note not found");
  }
  return true;
};

export const searchNotes = async (userId, query) => {
  if (!query || typeof query !== "string" || query.trim() === "") {
    throw new Error("Query parameter is required");
  }

  const regex = new RegExp(query.trim(), "i");
  return await Note.find({
    user: userId,
    $or: [{ title: { $regex: regex } }, { content: { $regex: regex } }],
  }).sort({ isPinned: -1, updatedAt: -1 });
};
