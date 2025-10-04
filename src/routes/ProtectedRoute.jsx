import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const ProtectedRoute = ({ children, requireRole = null }) => {
  const { user, userProfile, loading, isAdmin } = useAuth();

  // Show loading state while checking auth
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-500"></div>
      </div>
    );
  }

  // Redirect to login if not authenticated
  if (!user) {
    return <Navigate to="/login" />;
  }

  // Check role-based access if requireRole is specified
  // Admin users have unrestricted access to all routes
  if (requireRole && userProfile?.role !== requireRole && !isAdmin()) {
    return <Navigate to="/" />;
  }

  return children;
};

export default ProtectedRoute;
