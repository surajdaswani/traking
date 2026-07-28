import { createBrowserRouter } from "react-router";
import { Login } from "./routes/Login";
import { AuthCallback } from "./routes/AuthCallback";
import { Home } from "./routes/Home";
import { SectionFullList } from "./routes/SectionFullList";
import { Search } from "./routes/Search";
import { AppLayout } from "./routes/AppLayout";
import { ProtectedRoute } from "./components/ProtectedRoute";

export const router = createBrowserRouter([
  {
    element: (
      <ProtectedRoute>
        <AppLayout />
      </ProtectedRoute>
    ),
    children: [
      { index: true, element: <Home /> },
      { path: "/lists/:type", element: <SectionFullList /> },
      { path: "/search", element: <Search /> },
    ],
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
