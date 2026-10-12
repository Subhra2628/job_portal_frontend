

import Apply from "../Apply_Jobs/apply_job";
import Footer from "../Footer/footer";

import Category from "../Category/Category";
import React, { useState,useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FiArrowRight } from "react-icons/fi";
import { useLocation } from "react-router-dom";

import api from "../../../API/api";


const Home = () => {
  
  const [title, setTitle] = useState("");
  const [location, setLocation] = useState("");
  const [jobs, setJobs] = useState([]);
  const [showModal, setShowModal] = useState(false);
  
  const navigate = useNavigate();
const locationn=useLocation();



useEffect(() => {
    if (locationn.state?.message) {
      alert(locationn.state.message);
    }
  }, [locationn.state]);


  // Job search
  const handleSearch = async () => {
    try {
      let response;

      // Both title and location
      if (title && location) {
        response = await api.get(
          `/create/both?title=${encodeURIComponent(
            title
          )}&location=${encodeURIComponent(location)}`
        );
      }
      // Only title
      else if (title) {
        response = await api.get(
          `/create/search?title=${encodeURIComponent(title)}`
        );
      }
      // Only location
      else if (location) {
        response = await api.get(
          `/create/location?location=${encodeURIComponent(location)}`
        );
      }
      // Nothing entered
      else {
        setJobs([]);
        setShowModal(true);
        return;
      }

      setJobs(response.data.jobs || []);
      setShowModal(true);
    } catch (error) {
      console.error(error);
      setJobs([]);
      setShowModal(true);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50">
      {/* ================= HERO SECTION ================= */}
      <section className="bg-gradient-to-br from-blue-200 via-white to-indigo-200 px-6 py-20 text-center">
        <h1 className="text-4xl font-bold text-slate-800 md:text-5xl">
          Find Your <span className="text-blue-500">Dream Job</span> Today
        </h1>

        <p className="mx-auto mt-5 max-w-2xl text-xl font-semibold leading-8 text-slate-600">
          Connect with thousands of top employers and discover opportunities
          that match your skills, passion, and career goals.
        </p>

        {/* Search Box */}
        <div className="mx-auto mt-10 flex max-w-4xl flex-col gap-3 rounded-xl bg-slate-100 p-3 shadow-md md:flex-row">
          {/* Job Title */}
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            type="text"
            placeholder="Job title, keyword, or company"
            className="flex-1 rounded-lg border border-slate-200 bg-white px-5 py-3 font-semibold outline-none transition focus:border-blue-500"
          />

          {/* Location */}
          <input
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            type="text"
            placeholder="City, state, or zip code"
            className="flex-1 rounded-lg border border-slate-200 bg-white px-5 py-3 font-semibold outline-none transition focus:border-blue-500"
          />

          {/* Search Button */}
          <button
            onClick={handleSearch}
            className="cursor-pointer rounded-lg bg-blue-600 px-8 py-3 font-semibold text-white transition hover:bg-blue-700"
          >
            Search
          </button>
        </div>
      </section>

      {/* ================= EXTERNAL COMPONENT ================= */}
      <Category />

      {/* ================= SEARCH RESULTS MODAL ================= */}
      {showModal && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 px-4"
          onClick={() => setShowModal(false)}
        >
          <div
            className="relative max-h-[80vh] w-full max-w-3xl overflow-y-auto rounded-2xl bg-white p-6 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="mb-6 flex items-center justify-between border-b border-slate-200 pb-4">
              <div>
                <h2 className="text-2xl font-bold text-slate-800">
                  Search Results
                </h2>

                <p className="mt-1 text-sm text-slate-500">
                  {jobs.length} job{jobs.length !== 1 ? "s" : ""} found
                </p>
                
              </div>

            <div className="flex items-center justify-between">
  
  <button
    onClick={() => setShowModal(false)}
    className="flex h-9 w-9 cursor-pointer items-center justify-center rounded-full bg-slate-100 text-xl text-slate-500 transition hover:bg-red-50 hover:text-red-500"
  >
    ×
  </button>



</div>
            </div>

            {/* Jobs */}
            {jobs.length > 0 ? (
              <div className="space-y-4">
                {jobs.map((job) => (
                  <div
                    key={job.id}
                    className="rounded-xl border border-slate-200 bg-slate-50 p-5 transition hover:border-blue-300 hover:shadow-md"
                  >
                    <h3 className="text-xl font-bold text-slate-800">
                      {job.title}
                    </h3>

                    <p className="mt-2 font-medium text-blue-600">
                      {job.company}
                    </p>

                    <p className="mt-1 text-sm text-slate-500">
                      {job.location}
                    </p>

                    {job.category && (
                      <span className="mt-3 inline-block rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-600">
                        {job.category}
                      </span>
                     
                    )}
                         <Apply job={job} />     
                  </div>
                ))}
    
              </div>
            ) : (
              <div className="py-12 text-center">
                <h3 className="text-xl font-semibold text-slate-700">
                  No jobs found
                </h3>

                <p className="mt-2 text-slate-500">
                  Try searching with a different job title or location.
                </p>
              </div>
            )}
          </div>
        </div>
      )}
<Footer/>
    </div>
  );
};

export default Home;