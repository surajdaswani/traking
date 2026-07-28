import { createBrowserRouter } from "react-router";
import { Login } from "./routes/Login";
import { AuthCallback } from "./routes/AuthCallback";
import { Home } from "./routes/Home";
import { SectionFullList } from "./routes/SectionFullList";
import { Search } from "./routes/Search";
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
  {
    path: "/lists/:type",
    element: (
      <ProtectedRoute>
        <SectionFullList />
      </ProtectedRoute>
    ),
  },
  {
    path: "/search",
    element: (
      <ProtectedRoute>
        <Search />
      </ProtectedRoute>
    ),
  },
]);
