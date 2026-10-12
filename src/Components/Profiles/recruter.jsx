import PostedJobs from "../Show_posted_jobs/show_posted_jobs";
import { FiBriefcase, FiGlobe, FiPlusCircle } from "react-icons/fi";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../../API/api";

const RecruiterProfile = () => {
  const navigate = useNavigate();

  const [profile, setProfile] = useState(null);
  const [profileNotFound, setProfileNotFound] = useState(false);
  const [loadingProfile, setLoadingProfile] = useState(true);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const response = await api.get("/profile/me");
      setProfile(response.data.profile);
    } catch (error) {
      console.error("GET PROFILE ERROR:", error);
      if (error.response?.status === 404) {
        setProfileNotFound(true);
      }
    } finally {
      setLoadingProfile(false);
    }
  };

  if (loadingProfile) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-slate-50">
        <div className="relative">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
          <div className="absolute top-0 left-0 animate-ping rounded-full h-12 w-12 border border-indigo-400 opacity-20"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 py-10 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="max-w-4xl mx-auto space-y-8">
        
        {/* Profile does not exist */}
        {profileNotFound && (
          <div className="text-center mt-12 bg-white p-12 rounded-3xl shadow-sm border border-slate-200">
            <div className="bg-indigo-50 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6 shadow-inner">
              <FiBriefcase className="text-4xl text-indigo-600" />
            </div>
            <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
              Create Your Company Profile
            </h1>
            <p className="text-slate-500 mt-3 mb-8 text-lg">
              Set up your company details to start posting jobs and managing applicants.
            </p>
            <button
              onClick={() => navigate("/create-recruiter-profile")}
              className="bg-indigo-600 hover:bg-indigo-700 active:scale-95 transition-all text-white px-8 py-3.5 rounded-xl font-semibold shadow-md"
            >
              Create Company Profile
            </button>
          </div>
        )}

        {/* Profile exists */}
        {profile && (
          <>
            {/* 1. Company Information Section */}
            <div className="bg-white rounded-3xl shadow-sm border border-slate-200 p-8 sm:p-10">
              <div className="flex flex-col sm:flex-row items-start gap-6 sm:gap-8">
                {/* Company Logo */}
                <img
                  src={
                    profile.companyLogo || profile.logo
                      ? `http://localhost:5000/api/recruiter/show/${profile.companyLogo || profile.logo}`
                      : "https://via.placeholder.com/150"
                  }
                  className="w-28 h-28 sm:w-36 sm:h-36 rounded-2xl border border-slate-100 bg-white object-cover shadow-sm shrink-0"
                  alt={profile.companyName}
                />
                
                {/* Company Details */}
                <div className="flex-1 w-full">
                  <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 mb-3">
                    <div>
                      <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
                        {profile.companyName}
                      </h1>
                      {/* Company Website */}
                      {(profile.companyWebsite || profile.websiteUrl) && (
                        <a
                          href={profile.companyWebsite || profile.websiteUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1.5 text-indigo-600 hover:text-indigo-800 font-medium mt-1.5 transition-colors"
                        >
                          <FiGlobe /> {profile.companyWebsite || profile.websiteUrl}
                        </a>
                      )}
                    </div>
                    
                    <button
                      onClick={() => navigate("/edit-recuirter-profile")}
                      className="px-5 py-2 border-2 border-slate-200 text-slate-600 font-semibold rounded-xl hover:bg-slate-50 hover:border-slate-300 transition-all active:scale-95 whitespace-nowrap text-sm"
                    >
                      Edit Profile
                    </button>
                  </div>

                  {/* Company Description */}
                  <div className="mt-4 pt-4 border-t border-slate-100">
                    <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-2">
                      About the Company
                    </h3>
                    <p className="text-slate-600 leading-relaxed whitespace-pre-wrap">
                      {profile.companyDescription || profile.aboutCompany || "No description provided."}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* 2. Posted Jobs & Applicants Section */}
            <div className="bg-white rounded-3xl shadow-sm border border-slate-200 p-8 sm:p-10">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8 pb-4 border-b border-slate-100">
                <div>
                  <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                    <FiBriefcase className="text-indigo-600" /> Manage Job Postings
                  </h2>
                  <p className="text-sm text-slate-500 mt-1">
                    Track applicants and update application statuses.
                  </p>
                </div>
                
                {/* Post a Job Button */}
                <button
                  onClick={() => navigate("/post-job")}
                  className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2.5 rounded-xl font-semibold transition-all active:scale-95 shadow-md hover:shadow-lg w-full sm:w-auto justify-center"
                >
                  <FiPlusCircle className="text-lg" /> Post a Job
                </button>
              </div>

              {/* Injected Job Listings Component */}
              <PostedJobs />
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default RecruiterProfile;