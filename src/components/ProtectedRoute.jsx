import { useAuthStore } from "../features/auth/store";
import { Navigate } from "react-router-dom";

export default function ProtectedRoute({ children }) {
  const user = useAuthStore((s) => s.user);

  if (!user) {
    return <Navigate to="/" replace />;
  }

  return children;
}