# Project Overview

This is a full-stack web application called "UniAssist". It appears to be a university assistant application with features like a chatbot, announcements, appointments, a cafeteria menu, a lost and found, notes, a pomodoro timer, a schedule, and a to-do list.

**Frontend:**

*   **Framework:** React with Vite
*   **UI Library:** Material-UI
*   **Routing:** React Router
*   **State Management:** Zustand

**Backend:**

*   **Framework:** Node.js with Express
*   **Database:** MongoDB with Mongoose
*   **Real-time Communication:** Socket.IO
*   **Authentication:** JWT
*   **File Uploads:** Multer and Cloudinary
*   **Scheduled Jobs:** node-cron
*   **AI:** OpenAI

# Building and Running

**Prerequisites:**

*   Node.js and npm installed
*   A MongoDB instance running

**Development:**

1.  **Install Dependencies:**
    ```bash
    npm install
    npm install --prefix frontend
    ```
2.  **Run Backend Server:**
    ```bash
    npm run server
    ```
3.  **Run Frontend Development Server:**
    ```bash
    npm run dev --prefix frontend
    ```

**Production:**

1.  **Build the application:**
    ```bash
    npm run build
    ```
2.  **Start the server:**
    ```bash
    npm start
    ```

# Development Conventions

*   The project is split into a `frontend` and a `backend` directory.
*   The backend uses a modular structure with routes, controllers, models, and middleware.
*   The frontend uses a component-based architecture with pages, components, hooks, and stores.
*   API routes are prefixed with `/api`.
*   The frontend is served as static files from the `frontend/dist` directory.
