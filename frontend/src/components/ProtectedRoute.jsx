import { Navigate } from "react-router-dom";

function ProtectedRoute({ children, role }) {
  const userRole = localStorage.getItem("role");

  if (!userRole) {
    return <Navigate to="/" replace />;
  }

  if (role && userRole !== role) {
    return <Navigate to="/" replace />;
  }

  return children;
}

export default ProtectedRoute;
