import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContextProvider";
import FlowvaLoader from "../common/loading";

const AdminProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { loading, authenticated, hasProfile, userRole, isAuthor } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[100svh]">
        <FlowvaLoader />
      </div>
    );
  }

  if (!authenticated) {
    return <Navigate to="/admin/signin" state={{ from: location }} replace />;
  }

  if (hasProfile === false) {
    return <Navigate to="/unauthorized" replace />;
  }

  const isAdmin = userRole === "admin";
  const isBlogPath = location.pathname.startsWith("/admin/blog");

  // ✅ Allow admins to access everything
  if (isAdmin) return <>{children}</>;

  // ✅ Allow authors to access only blog-related routes
  if (isAuthor && isBlogPath) return <>{children}</>;

  // ❌ Everyone else gets blocked
  return <Navigate to="/unauthorized" replace />;
};

export default AdminProtectedRoute;
