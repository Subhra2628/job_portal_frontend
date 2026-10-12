import { Navigate,Outlet, useNavigate } from "react-router-dom";
import { useEffect } from "react";

const RecruiterRoute = () => {
  const role = localStorage.getItem("role");
  const navigate = useNavigate();

  useEffect(() => {
    if (role !== "RECRUITER") {
      alert("Access denied! Only recruiters can post jobs.");
      navigate("/", { replace: true });
    }
  }, [role, navigate]);

  if (role !== "RECRUITER") {
    return null;
  }

  return <Outlet />;
};
export default RecruiterRoute;