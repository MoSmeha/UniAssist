import { useEffect, memo } from "react";
import {
  Container,
  Box,
  Typography,
  Paper,
  Button,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { Add as AddIcon } from "@mui/icons-material";
import useTodoStore from "../../zustand/useTodoStore";
import TodoHeader from "./TodoHeader";
import TodoItem from "./TodoItem";
import TodoForm from "./TodoForm";

const TodoList = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const { todos, filteredTodos, fetchTodos, handleOpenForm } = useTodoStore();

  useEffect(() => {
    fetchTodos();
  }, [fetchTodos]);

  return (
    <>
      <TodoHeader />
      <Container
        sx={{
          mt: 4,
          px: isMobile ? 1 : 3,
          maxWidth: "md",
        }}
      >
        {filteredTodos.length === 0 ? (
          <Paper
            elevation={1}
            sx={{ p: 3, textAlign: "center", mt: 2, borderRadius: 2 }}
          >
            <Typography variant="h6" color="text.secondary">
              {todos.length === 0
                ? "No tasks yet. Add your first task to get started!"
                : "No tasks match the selected priority filter."}
            </Typography>
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={() => handleOpenForm()}
              sx={{ mt: 2 }}
            >
              Add Task
            </Button>
          </Paper>
        ) : (
          <Box sx={{ mt: 1 }}>
            {filteredTodos.map((todo) => (
              <TodoItem key={todo._id} todo={todo} />
            ))}
          </Box>
        )}
        <TodoForm />
      </Container>
    </>
  );
};

export default memo(TodoList);
