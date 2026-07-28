import { createBrowserRouter } from "react-router";
import { Login } from "./routes/Login";
import { AuthCallback } from "./routes/AuthCallback";
import { ProtectedRoute } from "./components/ProtectedRoute";

export const router = createBrowserRouter([
  {
    path: "/",
    element: (
      <ProtectedRoute>
        <div>Home (placeholder)</div>
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
