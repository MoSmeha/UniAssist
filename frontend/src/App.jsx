import { Navigate, Route, Routes } from "react-router-dom";
import "./App.css";

import Login from "./pages/login/Login";
import { Toaster } from "react-hot-toast";
import DashboardLayoutBasic from "./Dashboard";
import { useAuthStore } from "./zustand/AuthStore";
// import DashboardLayoutAccountSidebar from "./TodoDialog";

function App() {
  const { authUser, loading } = useAuthStore();

  console.log("authUser on render:", authUser);
  return (
    <>
      <Routes>
        <Route
          path="/"
          element={
            authUser ? (
              <DashboardLayoutBasic />
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />
        <Route
          path="/login"
          element={authUser ? <Navigate to="/" /> : <Login />}
        />
      </Routes>
      <Toaster />
    </>
  );
}

export default App;
