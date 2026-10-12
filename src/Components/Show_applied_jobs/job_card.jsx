import { useState } from "react";
import api from "../../../API/api";
import { 
  FiBriefcase, 
  FiMapPin, 
  FiLayers, 
  FiClock,
  FiChevronDown,
  FiChevronUp,
  FiCheckCircle,
  FiXCircle,
  FiClock as FiPending
} from "react-icons/fi";

const AppliedJobs = () => {
  const [jobs, setJobs] = useState([]);
  const [showJobs, setShowJobs] = useState(false);
  const [loading, setLoading] = useState(false);
  const [hasFetched, setHasFetched] = useState(false);

  const handleToggleAppliedJobs = async () => {
    // If we already fetched the jobs, just toggle visibility
    if (hasFetched) {
      setShowJobs(!showJobs);
      return;
    }

    const token = localStorage.getItem("accessToken");

    if (!token) {
      alert("Please login first.");
      return;
    }

    try {
      setLoading(true);
      const response = await api.get("/profile/applieddd");
      setJobs(response.data.applications || []);
      setHasFetched(true);
      setShowJobs(true);
    } catch (error) {
      console.error("API ERROR:", error);
    } finally {
      setLoading(false);
    }
  };

  // Helper to style status badges dynamically
  const getStatusStyles = (status = "") => {
    const s = status.toLowerCase();
    if (s.includes("accept") || s.includes("hire") || s.includes("shortlist") || s.includes("select")) {
      return { bg: "bg-emerald-50 text-emerald-700 border-emerald-200", icon: <FiCheckCircle /> };
    }
    if (s.includes("reject") || s.includes("decline")) {
      return { bg: "bg-rose-50 text-rose-700 border-rose-200", icon: <FiXCircle /> };
    }
    return { bg: "bg-amber-50 text-amber-700 border-amber-200", icon: <FiPending /> };
  };

  return (
    <div className="w-full">
      <button
        onClick={handleToggleAppliedJobs}
        disabled={loading}
        className="flex items-center justify-between w-full p-4 bg-white border border-slate-200 rounded-xl shadow-sm hover:border-indigo-300 hover:bg-slate-50 transition-all active:scale-[0.99] group"
      >
        <div className="flex items-center gap-3">
          <div className="p-2 bg-indigo-50 text-indigo-600 rounded-lg group-hover:bg-indigo-100 transition-colors">
            <FiBriefcase className="text-xl" />
          </div>
          <span className="font-semibold text-slate-800 text-lg">
            My Applied Jobs
          </span>
        </div>
        
        <div className="text-slate-400">
          {loading ? (
            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-indigo-600"></div>
          ) : showJobs ? (
            <FiChevronUp className="text-xl" />
          ) : (
            <FiChevronDown className="text-xl" />
          )}
        </div>
      </button>

      {/* Expandable Content Area */}
      <div 
        className={`transition-all duration-300 ease-in-out overflow-hidden ${
          showJobs ? "max-h-[2000px] opacity-100 mt-6" : "max-h-0 opacity-0"
        }`}
      >
        {jobs.length === 0 ? (
          <div className="text-center py-10 bg-slate-50 rounded-xl border border-dashed border-slate-300">
            <FiLayers className="mx-auto text-4xl text-slate-300 mb-3" />
            <p className="text-slate-500 font-medium">You haven't applied for any jobs yet.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {jobs.map((application) => {
              const statusDesign = getStatusStyles(application.status);
              
              return (
                <div
                  key={application.id || application._id}
                  className="group flex flex-col justify-between bg-white rounded-xl border border-slate-200 p-5 hover:shadow-md hover:border-indigo-200 transition-all"
                >
                  <div>
                    {/* Header: Title & Status */}
                    <div className="flex justify-between items-start gap-4 mb-2">
                      <h3 className="text-lg font-bold text-slate-900 group-hover:text-indigo-600 transition-colors line-clamp-1">
                        {application.job.title}
                      </h3>
                      <span className={`flex items-center gap-1.5 px-2.5 py-1 text-xs font-semibold rounded-md border whitespace-nowrap ${statusDesign.bg}`}>
                        {statusDesign.icon}
                        {application.status || "Pending"}
                      </span>
                    </div>

                    {/* Company Name */}
                    <p className="text-indigo-600 font-semibold text-sm mb-4">
                      {application.job.company}
                    </p>

                    {/* Job Meta Details */}
                    <div className="space-y-2">
                      <div className="flex items-center text-sm text-slate-600 gap-2">
                        <FiMapPin className="text-slate-400 shrink-0" />
                        <span className="truncate">{application.job.location}</span>
                      </div>
                      <div className="flex items-center text-sm text-slate-600 gap-2">
                        <FiLayers className="text-slate-400 shrink-0" />
                        <span className="truncate">{application.job.category}</span>
                      </div>
                    </div>
                  </div>

                  {/* Footer / Date Applied (Optional, if your API returns it) */}
                  {application.appliedAt && (
                    <div className="mt-5 pt-4 border-t border-slate-100 flex items-center gap-2 text-xs text-slate-400 font-medium">
                      <FiClock />
                      Applied {new Date(application.appliedAt).toLocaleDateString()}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default AppliedJobs;