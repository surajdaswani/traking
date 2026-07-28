import type { ReactNode } from "react";
import { Navigate } from "react-router";
import { isAuthenticated } from "../lib/auth";

export function ProtectedRoute({ children }: { children: ReactNode }) {
  if (!isAuthenticated()) {
    return <Navigate to="/login" replace />;
  }

  return children;
}
