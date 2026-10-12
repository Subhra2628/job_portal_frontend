import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { FiArrowLeft, FiSave, FiBriefcase } from "react-icons/fi";
import api from "../../../API/api";

function EditJobs() {
  const navigate = useNavigate();
  
  // 1. Get the job ID from the URL (e.g., /edit-job/123)
  const { id } = useParams();

  // 2. Setup state to hold all the form data expected by your backend
  const [formData, setFormData] = useState({
    title: "",
    company: "",
    location: "",
    description: "",
    salary: "",
    jobType: "",
    category: "",
    experience: "",
    skills: "",
    vacancies: "",
    deadline: "",
  });

  // 3. Setup state for loading screens and messages
  const [isFetching, setIsFetching] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });

  // 4. Fetch the existing job details when the page loads
  useEffect(() => {
    const fetchJobDetails = async () => {
      try {
        // Assume you have an endpoint to get a single job's details
        const response = await api.get(`create/jobs/${id}`);
        const job = response.data.job || response.data;

        // Pre-fill the form with the fetched data
        setFormData({
          title: job.title || "",
          company: job.company || "",
          location: job.location || "",
          description: job.description || "",
          salary: job.salary || "",
          jobType: job.jobType || "",
          category: job.category || "",
          experience: job.experience || "",
          skills: job.skills || "",
          vacancies: job.vacancies || "",
          // Format date for the HTML date input (YYYY-MM-DD)
          deadline: job.deadline ? new Date(job.deadline).toISOString().split('T')[0] : "",
        });
      } catch (error) {
        setMessage({ type: "error", text: "Failed to load job details." });
      } finally {
        setIsFetching(false);
      }
    };

    fetchJobDetails();
  }, [id]);

  // 5. Handle typing in the input fields
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  // 6. Handle submitting the updated data to your controller
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    setMessage({ type: "", text: "" });

    try {
      // Convert vacancies to a number if it exists
      const dataToSend = {
        ...formData,
        vacancies: formData.vacancies ? parseInt(formData.vacancies, 10) : null,
      };

      // Sending a PUT request to your updateJob controller
      await api.put(`create/jobs/update/${id}`, dataToSend);
      
      setMessage({ type: "success", text: "Job updated successfully!" });
      
      // // Go back to the posted jobs page after 1.5 seconds
      // setTimeout(() => {
      //   navigate("/post-job"); // Change this to your actual route
      // }, 1500);

    } catch (error) {
      setMessage({ 
        type: "error", 
        text: error.response?.data?.message || "Failed to update job. Please try again." 
      });
    } finally {
      setIsSaving(false);
    }
  };

  // Reusable Tailwind CSS classes for inputs
  const inputClass = "w-full rounded-xl border border-slate-300 bg-slate-50 px-4 py-3 text-sm outline-none transition focus:border-indigo-500 focus:bg-white focus:ring-2 focus:ring-indigo-100";
  const labelClass = "mb-1 block text-sm font-semibold text-slate-700";

  // Show a loading spinner while fetching data
  if (isFetching) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50">
        <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 px-4 py-10 sm:px-6">
      <div className="mx-auto max-w-3xl">
        
        {/* Top Navigation */}
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="mb-6 flex items-center gap-2 text-sm font-medium text-slate-500 hover:text-indigo-600"
        >
          <FiArrowLeft /> Go Back
        </button>

        {/* Page Header */}
        <div className="mb-8 flex items-center gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-100 text-2xl text-indigo-600">
            <FiBriefcase />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Edit Job Posting</h1>
            <p className="text-sm text-slate-500">Update the details for this job listing.</p>
          </div>
        </div>

        {/* Feedback Messages */}
        {message.text && (
          <div className={`mb-6 rounded-xl p-4 text-sm font-medium ${message.type === 'error' ? 'bg-red-50 text-red-700 border border-red-200' : 'bg-green-50 text-green-700 border border-green-200'}`}>
            {message.text}
          </div>
        )}

        {/* Form Container */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            
            {/* 2-Column Grid for basic details */}
            <div className="grid gap-6 sm:grid-cols-2">
              <div>
                <label className={labelClass}>Job Title *</label>
                <input required type="text" name="title" value={formData.title} onChange={handleChange} placeholder="e.g. Frontend Developer" className={inputClass} />
              </div>

              <div>
                <label className={labelClass}>Company Name *</label>
                <input required type="text" name="company" value={formData.company} onChange={handleChange} placeholder="e.g. Google" className={inputClass} />
              </div>

              <div>
                <label className={labelClass}>Location</label>
                <input type="text" name="location" value={formData.location} onChange={handleChange} placeholder="e.g. Remote, or New York" className={inputClass} />
              </div>

              <div>
                <label className={labelClass}>Salary</label>
                <input type="text" name="salary" value={formData.salary} onChange={handleChange} placeholder="e.g. $80,000 - $100,000" className={inputClass} />
              </div>

              <div>
                <label className={labelClass}>Job Type</label>
                <select name="jobType" value={formData.jobType} onChange={handleChange} className={inputClass}>
                  <option value="">Select Type</option>
                  <option value="Full-time">Full-time</option>
                  <option value="Part-time">Part-time</option>
                  <option value="Contract">Contract</option>
                  <option value="Internship">Internship</option>
                </select>
              </div>

              <div>
                <label className={labelClass}>Category</label>
                <input type="text" name="category" value={formData.category} onChange={handleChange} placeholder="e.g. Software Engineering" className={inputClass} />
              </div>

              <div>
                <label className={labelClass}>Experience Required</label>
                <input type="text" name="experience" value={formData.experience} onChange={handleChange} placeholder="e.g. 2-3 Years" className={inputClass} />
              </div>

              <div>
                <label className={labelClass}>No. of Vacancies</label>
                <input type="number" name="vacancies" value={formData.vacancies} onChange={handleChange} placeholder="e.g. 3" min="1" className={inputClass} />
              </div>

              <div>
                <label className={labelClass}>Application Deadline</label>
                <input type="date" name="deadline" value={formData.deadline} onChange={handleChange} className={inputClass} />
              </div>

              <div>
                <label className={labelClass}>Required Skills</label>
                <input type="text" name="skills" value={formData.skills} onChange={handleChange} placeholder="e.g. React, Node.js, MongoDB" className={inputClass} />
              </div>
            </div>

            {/* Full-width Description field */}
            <div>
              <label className={labelClass}>Job Description *</label>
              <textarea 
                required 
                name="description" 
                value={formData.description} 
                onChange={handleChange} 
                rows="5" 
                placeholder="Describe the role, responsibilities, and benefits..." 
                className={`${inputClass} resize-y`}
              ></textarea>
            </div>

            {/* Form Actions */}
            <div className="mt-8 flex flex-col-reverse gap-3 border-t border-slate-100 pt-6 sm:flex-row sm:justify-end">
              <button 
                type="button" 
                onClick={() => navigate(-1)} 
                className="rounded-xl px-6 py-2.5 font-medium text-slate-600 transition hover:bg-slate-100"
              >
                Cancel
              </button>
              
              <button 
                type="submit" 
                disabled={isSaving}
                className="flex items-center justify-center gap-2 rounded-xl bg-indigo-600 px-8 py-2.5 font-semibold text-white transition hover:bg-indigo-700 disabled:opacity-60"
              >
                {isSaving ? "Saving..." : <><FiSave /> Save Changes</>}
              </button>
            </div>

          </form>
        </div>
      </div>
    </div>
  );
}

export default EditJobs;