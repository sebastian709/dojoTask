import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { fetchAuthSession } from "aws-amplify/auth";

export default function PublicRoute({ children }) {
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const session = await fetchAuthSession();
        const token = session.tokens?.accessToken;

        if (token) {
          setIsAuthenticated(true);
        }
      } catch {
        setIsAuthenticated(false);
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  if (loading) {
    return null; // pwede mo lagyan loader if gusto mo
  }

  
  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
}