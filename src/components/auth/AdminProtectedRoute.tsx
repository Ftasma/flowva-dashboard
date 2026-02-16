import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContextProvider";
import FlowvaLoader from "../common/loading";

const AdminProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { loading, authenticated, hasProfile } = useAuth();
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

  // Profile check removed to allow access regardless of profile status


  // ✅ Allow all authenticated users to access everything
  return <>{children}</>;
};

export default AdminProtectedRoute;

