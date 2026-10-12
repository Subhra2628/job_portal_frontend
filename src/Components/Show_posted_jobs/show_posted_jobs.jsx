import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FiMapPin, FiDollarSign, FiClock, FiUsers, FiEdit, FiTrash2, FiPlusCircle } from "react-icons/fi";
import api from "../../../API/api";

const PostedJobs = () => {
  const navigate = useNavigate();

  // 1. State for holding data
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // 2. State for managing the "View Candidates" section
  const [selectedJobId, setSelectedJobId] = useState(null);
  const [applicants, setApplicants] = useState([]);
  const [applicantsLoading, setApplicantsLoading] = useState(false);

  // 3. Fetch jobs when the component first loads
  useEffect(() => {
    const fetchPostedJobs = async () => {
      try {
        const response = await api.get("/create/getByrecuirteres");
        setJobs(response.data.jobs || []);
      } catch (error) {
        console.error("Error fetching jobs:", error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchPostedJobs();
  }, []); // Empty array means this runs once on mount

  // 4. Update the status of a specific applicant (e.g., Pending -> Shortlisted)
  const handleStatusChange = async (applicationId, newStatus) => {
    try {
      const response = await api.patch(`/statusUpdate/${applicationId}`, { status: newStatus });
      
      // Update the local state so the UI reflects the change immediately
      setApplicants((prevApplicants) =>
        prevApplicants.map((app) => 
          app.id === applicationId ? { ...app, status: response.data.application.status } : app
        )
      );
      
      alert("Status updated successfully!");
    } catch (error) {
      alert(error.response?.data?.message || "Failed to update status");
    }
  };

  // 5. Handle viewing or downloading a resume
  const handleResume = async (appId, isDownload = false) => {
    // Open a blank popup early if we are viewing (not downloading)
    let popup = null;
    if (!isDownload) {
      popup = window.open("about:blank", "_blank");
      if (!popup) {
        alert("Please allow popups in your browser to view the resume.");
        return;
      }
    }

    try {
      // Fetch the file as a Blob
      const response = await api.get(`/resume/${appId}`, {
        params: isDownload ? { download: "1" } : {},
        responseType: "blob",
      });
      
      const fileUrl = URL.createObjectURL(response.data);

      if (isDownload) {
        // Create a hidden link and click it to trigger download
        const downloadLink = document.createElement("a");
        downloadLink.href = fileUrl;
        downloadLink.download = `resume-${appId}.pdf`;
        downloadLink.click();
        
        // Clean up memory after a short delay
        setTimeout(() => URL.revokeObjectURL(fileUrl), 1000);
      } else {
        // Point the popup to the file URL
        popup.location.href = fileUrl;
        
        // Clean up memory after a longer delay
        setTimeout(() => URL.revokeObjectURL(fileUrl), 60000);
      }
    } catch (error) {
      if (popup && !popup.closed) popup.close();
      alert(error.response?.data?.message || "Unable to access resume.");
    }
  };

  // 6. Toggle the candidates view for a specific job
  const handleToggleCandidates = async (jobId) => {
    // If clicking the same job again, close the panel
    if (selectedJobId === jobId) {
      setSelectedJobId(null);
      return;
    }
    
    // Otherwise, open the panel and fetch candidates
    try {
      setSelectedJobId(jobId);
      setApplicantsLoading(true);
      
      const response = await api.get(`/byRecruiter/${jobId}`);
      setApplicants(response.data.applicants || []);
    } catch (error) {
      alert(error.response?.data?.message || "Failed to fetch candidates");
    } finally {
      setApplicantsLoading(false);
    }
  };

  // 7. Delete a job posting
  const handleDeleteJob = async (jobId) => {
    const isConfirmed = window.confirm("Are you sure you want to delete this job posting?");
    if (!isConfirmed) return;
    
    try {
      await api.delete(`/jobs/${jobId}`);
      
      // Remove the deleted job from the local list
      setJobs((prevJobs) => prevJobs.filter((job) => (job._id || job.id) !== jobId));
    } catch (error) {
      alert("Failed to delete the job posting.");
    }
  };

  // --- Render logic starts here --- //

  // Show a loading spinner while fetching initial data
  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <div className="animate-spin h-8 w-8 rounded-full border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  // Show an empty state if no jobs exist
  if (jobs.length === 0) {
    return (
      <div className="rounded-2xl border-dashed border-slate-300 bg-slate-50 p-10 text-center">
        <FiPlusCircle className="mx-auto mb-4 text-4xl text-indigo-500" />
        <h3 className="mb-2 text-lg font-bold">No Jobs Posted Yet</h3>
        <button 
          onClick={() => navigate("/post-job")} 
          className="mt-4 rounded-xl bg-indigo-600 px-6 py-2.5 font-semibold text-white transition hover:bg-indigo-700"
        >
          Post a Job Now
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Header section */}
      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-2xl font-bold">My Job Listings</h2>
        <button 
          onClick={() => navigate("/post-job")} 
          className="flex items-center gap-2 rounded-lg bg-indigo-50 px-4 py-2 font-semibold text-indigo-700 transition hover:bg-indigo-100"
        >
          <FiPlusCircle /> Post New Job
        </button>
      </div>

      {/* List of jobs */}
      <div className="grid gap-4">
        {jobs.map((job) => {
          // Some APIs use _id, some use id. This handles both.
          const jobId = job._id || job.id;
          
          return (
            <div key={jobId} className="rounded-2xl border bg-white p-5 transition-all hover:shadow-md">
              <div className="flex flex-col justify-between gap-4 sm:flex-row">
                
                {/* Job Details Left Side */}
                <div className="flex-1">
                  <div className="mb-2 flex items-center gap-3">
                    <h3 className="text-lg font-bold">{job.title}</h3>
                    <span className="rounded-md bg-green-50 px-2.5 py-1 text-xs font-bold text-green-700">
                      {job.status || "Active"}
                    </span>
                  </div>
                  
                  <div className="flex flex-wrap gap-x-6 gap-y-2 text-sm font-medium text-slate-500">
                    <span className="flex items-center gap-1.5"><FiMapPin /> {job.location}</span>
                    <span className="flex items-center gap-1.5"><FiClock /> {job.jobType}</span>
                    {job.salary && (
                      <span className="flex items-center gap-1.5"><FiDollarSign /> {job.salary}</span>
                    )}
                    <span className="flex items-center gap-1.5 text-indigo-600">
                      <FiUsers /> {job._count?.applications || 0} Applicant{(job._count?.applications || 0) === 1 ? "" : "s"}
                    </span>
                  </div>
                </div>

                {/* Actions Right Side */}
                <div className="flex items-center gap-2 sm:flex-col sm:items-end">
                  <button 
                    onClick={() => handleToggleCandidates(jobId)} 
                    className="whitespace-nowrap rounded-lg bg-indigo-600 px-4 py-2 text-white transition hover:bg-indigo-700"
                  >
                    {selectedJobId === jobId ? "Hide Candidates" : "View Candidates"}
                  </button>
                  
                  <div className="mt-2 flex w-full gap-2 sm:w-auto">
                    <button 
                      onClick={() => navigate(`/profile/edit-job/${jobId}`)} 
                      className="rounded-lg bg-slate-50 p-2 text-slate-500 transition hover:bg-slate-100 hover:text-indigo-600"
                      title="Edit Job"
                    >
                      <FiEdit />
                    </button>
                    <button 
                      onClick={() => handleDeleteJob(jobId)} 
                      className="rounded-lg bg-slate-50 p-2 text-slate-500 transition hover:bg-slate-100 hover:text-red-600"
                      title="Delete Job"
                    >
                      <FiTrash2 />
                    </button>
                  </div>
                </div>
              </div>

              {/* Candidates Section (Expands below the job) */}
              {selectedJobId === jobId && (
                <div className="mt-5 border-t pt-5">
                  <h4 className="mb-4 text-lg font-bold">Candidates for {job.title}</h4>
                  
                  {applicantsLoading ? (
                    <p className="text-slate-500">Loading candidates...</p>
                  ) : applicants.length === 0 ? (
                    <p className="text-slate-500">No candidates have applied yet.</p>
                  ) : (
                    <div className="grid gap-4 md:grid-cols-2">
                      {applicants.map((app) => {
                        const candidateProfile = app.user?.profile || {};
                        const candidateName = candidateProfile.name || app.user?.name || "Unknown Candidate";
                        
                        return (
                          <div key={app.id} className="rounded-xl border bg-slate-50 p-4">
                            <h5 className="mb-2 font-semibold">{candidateName}</h5>
                            
                            <div className="mb-4 space-y-1 text-sm text-slate-600">
                              <p><strong>Email:</strong> {app.user?.email || "N/A"}</p>
                              <p><strong>Phone:</strong> {candidateProfile.phone || "N/A"}</p>
                              <p><strong>Location:</strong> {candidateProfile.location || "N/A"}</p>
                            </div>
                            
                            <div className="mb-4 flex gap-3">
                              <button 
                                onClick={() => handleResume(app.id, false)} 
                                disabled={!candidateProfile.resumeUrl} 
                                className="rounded-lg bg-indigo-600 px-4 py-2 text-sm text-white disabled:opacity-50"
                              >
                                View Resume
                              </button>
                              <button 
                                onClick={() => handleResume(app.id, true)} 
                                disabled={!candidateProfile.resumeUrl} 
                                className="rounded-lg border border-indigo-600 px-4 py-2 text-sm text-indigo-600 disabled:opacity-50"
                              >
                                Download
                              </button>
                            </div>

                            <div className="border-t pt-3">
                              <select 
                                value={app.status} 
                                onChange={(e) => handleStatusChange(app.id, e.target.value)} 
                                className="w-full rounded-lg border bg-white p-2 text-sm outline-none focus:ring-1 focus:ring-indigo-500"
                              >
                                <option value="PENDING">Pending</option>
                                <option value="SHORTLISTED">Shortlisted</option>
                                <option value="REJECTED">Rejected</option>
                                <option value="SELECTED">Selected</option>
                              </select>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default PostedJobs;