import { useState, useEffect } from "react";
import {
  Container,
  CircularProgress,
  Alert,
  Box,
  Fade,
  Typography,
} from "@mui/material";
import { useNotesStore } from "../../zustand/notesStore";

import NoteCard from "./NoteCard";
import NoteForm from "./NoteForm";
import NotesHeader from "./NotesHeader";
import EmptyNotesMessage from "./EmptyNotesMessage";

const NotesApp = () => {
  const {
    notes,
    loading,
    error,
    searchQuery,
    setSearchQuery,
    fetchNotes,
    createNote,
    updateNote,
    deleteNote,
    togglePin,
    searchNotes,
  } = useNotesStore();

  const [formOpen, setFormOpen] = useState(false);
  const [editingNote, setEditingNote] = useState(null);

  useEffect(() => {
    fetchNotes();
  }, [fetchNotes]);

  const handleSearchChange = (e) => {
    const query = e.target.value;
    setSearchQuery(query);
    searchNotes(query);
  };

  const handleCreateNote = () => {
    setEditingNote(null);
    setFormOpen(true);
  };

  const handleEditNote = (note) => {
    setEditingNote(note);
    setFormOpen(true);
  };

  const handleSaveNote = async (noteData) => {
    if (editingNote) {
      await updateNote(editingNote._id, noteData);
    } else {
      await createNote(noteData);
    }
    setFormOpen(false);
  };

  const handleDeleteNote = async (id) => {
    await deleteNote(id);
  };

  // Separate pinned and unpinned notes
  const pinnedNotes = notes.filter((note) => note.pinned);
  const unpinnedNotes = notes.filter((note) => !note.pinned);

  return (
    <>
      <NotesHeader
        searchQuery={searchQuery}
        onSearchChange={handleSearchChange}
        onCreateNote={handleCreateNote}
      />
      <Container
        maxWidth={false}
        sx={{
          mt: 4,
          pb: 4,
          px: { xs: 2, sm: 3, md: 4 },
          position: "relative",
          maxWidth: "1400px",
        }}
      >
        {error && (
          <Alert severity="error" sx={{ mb: 3, borderRadius: 2 }}>
            {error}
          </Alert>
        )}

        <Fade in={loading}>
          <Box
            sx={{
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              backgroundColor: "rgba(255, 255, 255, 0.7)",
              zIndex: 10,
              borderRadius: 2,
            }}
          >
            <CircularProgress color="primary" />
          </Box>
        </Fade>

        {/* Pinned Notes Section */}
        {pinnedNotes.length > 0 && (
          <>
            <Typography
              variant="overline"
              sx={{
                display: "block",
                mb: 2,
                color: "#5f6368",
                fontSize: "0.75rem",
                fontWeight: 500,
                letterSpacing: "0.8px",
              }}
            >
              PINNED
            </Typography>
            <Box
              sx={{
                columns: {
                  xs: 1,
                  sm: 1, // Changed from 2 to 1 for wider cards on small screens
                  md: 2, // Changed from 3 to 2 for wider cards on medium screens
                  lg: 3, // Changed from 4 to 3 for wider cards on large screens
                  xl: 4, // Changed from 5 to 4 for wider cards on extra-large screens
                },
                columnGap: "16px",
                mb: 4,
              }}
            >
              {pinnedNotes.map((note) => (
                <Box
                  key={note._id}
                  sx={{
                    breakInside: "avoid",
                    mb: 2,
                    display: "inline-block",
                    width: "100%",
                  }}
                >
                  <NoteCard
                    note={note}
                    onEdit={handleEditNote}
                    onDelete={handleDeleteNote}
                    onTogglePin={togglePin}
                  />
                </Box>
              ))}
            </Box>
          </>
        )}

        {/* Other Notes Section */}
        {unpinnedNotes.length > 0 && (
          <>
            {pinnedNotes.length > 0 && (
              <Typography
                variant="overline"
                sx={{
                  display: "block",
                  mb: 2,
                  color: "#5f6368",
                  fontSize: "0.75rem",
                  fontWeight: 500,
                  letterSpacing: "0.8px",
                }}
              >
                OTHERS
              </Typography>
            )}
            <Box
              sx={{
                columns: {
                  xs: 1,
                  sm: 1, // Changed from 2 to 1 for wider cards on small screens
                  md: 2, // Changed from 3 to 2 for wider cards on medium screens
                  lg: 3, // Changed from 4 to 3 for wider cards on large screens
                  xl: 4, // Changed from 5 to 4 for wider cards on extra-large screens
                },
                columnGap: "16px",
                mb: 4,
              }}
            >
              {unpinnedNotes.map((note) => (
                <Box
                  key={note._id}
                  sx={{
                    breakInside: "avoid",
                    mb: 2,
                    display: "inline-block",
                    width: "100%",
                  }}
                >
                  <NoteCard
                    note={note}
                    onEdit={handleEditNote}
                    onDelete={handleDeleteNote}
                    onTogglePin={togglePin}
                  />
                </Box>
              ))}
            </Box>
          </>
        )}

        {notes.length === 0 && !loading && !error && (
          <EmptyNotesMessage searchQuery={searchQuery} />
        )}
      </Container>
      <NoteForm
        open={formOpen}
        onClose={() => {
          setFormOpen(false);
        }}
        note={editingNote}
        onSave={handleSaveNote}
      />
    </>
  );
};

export default NotesApp;
