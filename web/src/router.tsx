import { createBrowserRouter } from "react-router";
import { Login } from "./routes/Login";
import { AuthCallback } from "./routes/AuthCallback";
import { Home } from "./routes/Home";
import { ProtectedRoute } from "./components/ProtectedRoute";

export const router = createBrowserRouter([
  {
    path: "/",
    element: (
      <ProtectedRoute>
        <Home />
      </ProtectedRoute>
    ),
  },
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/connect/google/redirect",
    element: <AuthCallback />,
  },
]);
