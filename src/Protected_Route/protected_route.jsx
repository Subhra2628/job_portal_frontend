
import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children, allowedRole }) => {
  const token = localStorage.getItem("accessToken");
  const role = localStorage.getItem("role");

  // Check whether the user is logged in
  if (!token) {
    return <Navigate to="/login" replace />;
  }

  // Check whether the user's role is allowed
  if (allowedRole && role !== allowedRole) {
   
    return <Navigate to="/" replace  state={{ message: "Only recruiters can post jobs." }}/>;
  }

  return children;
};

export default ProtectedRoute;
