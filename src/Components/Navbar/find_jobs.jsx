import Apply from "../Apply_Jobs/apply_job";

import {
  FiSearch,
  FiMapPin,
  FiBriefcase,
  FiDollarSign,
} from "react-icons/fi";
import api from "../../../API/api";
import { useEffect, useState } from "react";

const FindJob = () => {
  const [jobs, setJobs] = useState([]);

  // Filter states
  const [category, setCategory] = useState("");
  const [jobType, setJobType] = useState("");
  const [location, setLocation] = useState("");
  const [salary, setSalary] = useState("");
  const [jobTitle, setJobTitle] = useState("");
const [selected, setselect]=useState(null);
  // Fetch all jobs on mount
  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const response = await api.get("/create/showAll");
        setJobs(response.data.job);
      } catch (error) {
        console.log(error);
      }
    };

    fetchJobs();
  }, []);

  // Filter jobs
  const handleApplyFilters = async () => {
    try {
      const response = await api.get("/create/jobs/filter", {
        params: {
          title: jobTitle,
          category: category,
          jobType: jobType,
          location: location,
          salary: salary,
        },
      });

      // Assuming your filter endpoint returns { jobs: [...] }
      setJobs(response.data.jobs);
    } catch (error) {
      console.log(error);
    }
  };


//Modal View
function ModalView(job)
{
  setselect(job);
}


  // Clear filters
  const handleClearFilters = () => {
    setJobTitle("");
    setCategory("");
    setJobType("");
    setLocation("");
    setSalary("");
    // Optionally re-fetch all jobs here
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <section className="mx-auto max-w-6xl px-6 py-10">
        <div className="grid gap-8 md:grid-cols-[250px_1fr]">
          
          {/* ================= FILTER SIDEBAR ================= */}
          <aside className="h-fit rounded-xl bg-white p-6 shadow-sm">
            <h2 className="text-xl font-bold text-slate-800">Filters</h2>

            {/* Job Title */}
            <div className="mt-6">
              <label className="mb-2 block text-sm font-semibold text-slate-700">
                Job Title
              </label>
              <input
                type="text"
                placeholder="e.g. Developer"
                value={jobTitle}
                onChange={(e) => setJobTitle(e.target.value)}
                className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
              />
            </div>

            {/* Salary */}
            <div className="mt-5">
              <label className="mb-2 block text-sm font-semibold text-slate-700">
                Salary
              </label>
              <select
                value={salary}
                onChange={(e) => setSalary(e.target.value)}
                className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-600 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
              >
                <option value="">Any Salary</option>
                <option value="0-20000">Below ₹20K</option>
                <option value="20000-30000">₹20K - ₹30K</option>
                <option value="30000-50000">₹30K - ₹50K</option>
                <option value="50000">₹50K+</option>
              </select>
            </div>

            {/* Category */}
            <div className="mt-5">
              <label className="mb-2 block text-sm font-semibold text-slate-700">
                Category
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-600 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
              >
                <option value="">All Categories</option>
                <option value="IT & Software">IT & Software</option>
                <option value="Healthcare">Healthcare</option>
                <option value="Finance">Finance</option>
                <option value="Sales & Marketing">Sales & Marketing</option>
                <option value="Education">Education</option>
                <option value="Design">Design</option>
              </select>
            </div>

            {/* Job Type */}
            <div className="mt-5">
              <label className="mb-2 block text-sm font-semibold text-slate-700">
                Job Type
              </label>
              <select
                value={jobType}
                onChange={(e) => setJobType(e.target.value)}
                className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-600 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
              >
                <option value="">All Types</option>
                <option value="FULL_TIME">Full Time</option>
                <option value="PART_TIME">Part Time</option>
                <option value="INTERNSHIP">Internship</option>
                <option value="CONTRACT">Contract</option>
              </select>
            </div>

            {/* Location */}
            <div className="mt-5">
              <label className="mb-2 block text-sm font-semibold text-slate-700">
                Location
              </label>
              <div className="relative">
                <FiMapPin
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                  size={17}
                />
                <input
                  type="text"
                  placeholder="e.g. Kolkata"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="w-full rounded-lg border border-slate-200 py-2.5 pl-9 pr-3 text-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                />
              </div>
            </div>

            {/* Apply Filter */}
            <button
              onClick={handleApplyFilters}
              className="mt-6 w-full cursor-pointer rounded-lg bg-blue-600 py-2.5 font-semibold text-white transition hover:bg-blue-700"
            >
              Apply Filters
            </button>

            {/* Clear */}
            <button
              onClick={handleClearFilters}
              className="mt-3 w-full cursor-pointer rounded-lg border border-slate-200 py-2.5 font-semibold text-slate-600 transition hover:bg-slate-100"
            >
              Clear Filters
            </button>
          </aside>

          {/* ================= JOBS ================= */}
          <main>
            <div className="mb-5 flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-slate-800">
                  Latest Jobs
                </h2>
                <p className="mt-1 text-sm text-slate-500">
                  Showing available opportunities
                </p>
              </div>
              <span className="text-sm text-slate-500">
                {jobs.length} {jobs.length === 1 ? "Job" : "Jobs"} Found
              </span>
            </div>

            {/* Job Cards */}
            {jobs.map((job) => (
              <div
                key={job.id}
                className="mb-5 rounded-xl bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-md"
              >
                <div className="flex flex-col justify-between gap-5 sm:flex-row">
                  <div className="flex gap-4">
                    <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                      <FiBriefcase size={26} />
                    </div>

                    <div>
                      <h3 className="text-xl font-semibold text-slate-800">
                        {job.title}
                      </h3>
                      <p className="mt-1 text-slate-500">{job.company}</p>

                      <div className="mt-3 flex flex-wrap gap-4 text-sm text-slate-500">
                        <span className="flex items-center gap-1">
                          <FiMapPin />
                          {job.location}
                        </span>

                        <span className="flex items-center gap-1">
                          <FiBriefcase />
                          {job.jobType === "FULL_TIME"
                            ? "Full Time"
                            : job.jobType === "PART_TIME"
                            ? "Part Time"
                            : job.jobType === "INTERNSHIP"
                            ? "Internship"
                            : "Contract"}
                        </span>

                        <span className="flex items-center gap-1">
                          <FiDollarSign />
                          ₹{job.salary}
                        </span>
                      </div>

                      <div className="mt-4">
                        <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-medium text-blue-600">
                          {job.category} 
                        </span>
                      </div>
                    </div>
                  </div>

                  <button onClick={() => ModalView(job)}className="h-fit cursor-pointer rounded-lg bg-blue-600 px-5 py-2.5 font-semibold text-white transition hover:bg-blue-700">
                    View Details
                  </button>
                </div>
              </div>
              
            ))}


{/* //Modal View */}
{selected && (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm transition-opacity">
    <div className="relative flex w-full max-w-2xl flex-col max-h-[90vh] rounded-2xl bg-white shadow-2xl">
      
      {/* Header Section */}
      <div className="flex items-start justify-between border-b p-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">
            {selected.title}
          </h2>
          <div className="mt-2 flex flex-wrap items-center gap-4 text-sm text-gray-600">
            <span className="font-semibold text-blue-600">
              {selected.company}
            </span>
            <span className="flex items-center gap-1">
              <svg className="h-4 w-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              {selected.location}
            </span>
          </div>
        </div>
        
        {/* Top Right Close Icon */}
        <button
          onClick={() => setselect(null)}
          className="rounded-full p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition-colors"
          aria-label="Close"
        >
          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      {/* Body Section (Scrollable for long descriptions) */}
      <div className="overflow-y-auto p-6">
        {/* Badges */}
        <div className="mb-6 flex flex-wrap gap-2">
          <span className="inline-flex items-center rounded-md bg-green-50 px-2.5 py-1 text-sm font-medium text-green-700 ring-1 ring-inset ring-green-600/20">
            ₹ {selected.salary}
          </span>
          <span className="inline-flex items-center rounded-md bg-blue-50 px-2.5 py-1 text-sm font-medium text-blue-700 ring-1 ring-inset ring-blue-700/10">
            {selected.jobType}
          </span>
          <span className="inline-flex items-center rounded-md bg-purple-50 px-2.5 py-1 text-sm font-medium text-purple-700 ring-1 ring-inset ring-purple-700/10">
            {selected.category}
          </span>
        </div>

        {/* Description */}
        <div className="space-y-3">
          <h3 className="text-lg font-semibold text-gray-900">Job Description</h3>
          <p className="whitespace-pre-line text-gray-600 leading-relaxed">
            {selected.description}
          </p>
        </div>
      </div>

      {/* Footer Section */}
      <div className="flex justify-end gap-3 rounded-b-2xl border-t bg-gray-50 px-6 py-4">
        <button
          onClick={() => setselect(null)}
          className="rounded-lg cursor-pointer border border-gray-300 bg-white px-5 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-200 transition-colors"
        >
          Close
        </button>
        <Apply job={selected} />
      </div>

    </div>
  </div>
)}         </main>
        </div>
      </section>
    </div>
  );
};

export default FindJob;