import JobSeekerProfile from "../Profiles/job_seeker";
import RecruiterProfile from "../Profiles/recruter";

const MyProfile = () => {
  const role = localStorage.getItem("role");

  if (role === "JOB_SEEKER") {
    return <JobSeekerProfile />;
  }

  if (role === "RECRUITER") {
    return <RecruiterProfile />;
  }

  return <p>Invalid user role</p>;
};

export default MyProfile;