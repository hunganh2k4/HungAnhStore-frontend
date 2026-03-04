import { Navigate } from "react-router-dom";
import { useAuth } from "../features/auth/auth.context";

export const ProtectedRoute = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) return <div>Loading...</div>;

  if (!isAuthenticated)
    return <Navigate to="/auth" replace />;

  return <>{children}</>;
};