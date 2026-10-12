
import { useEffect, useState } from "react";
import Apply from "../Apply_Jobs/apply_job";
import {
  MdDesignServices,
  MdCode,
  MdCampaign,
  MdAccountBalance,
  MdSupportAgent,
  MdOutlineHealthAndSafety,
  MdEngineering,
  MdPeople,
  MdCategory,
} from "react-icons/md";

import {
  FiArrowRight,
  FiArrowLeft,
  FiMapPin,
  FiBriefcase,
} from "react-icons/fi";

import api from "../../../API/api";

const categories = [
  {
    name: "Design & Creative",
    apiCategory: "Design",
    jobs: "120+ Jobs",
    icon: MdDesignServices,
    iconBg: "bg-purple-50",
    iconColor: "text-purple-600",
  },
  {
    name: "Development",
    apiCategory: "IT & Software",
    jobs: "250+ Jobs",
    icon: MdCode,
    iconBg: "bg-blue-50",
    iconColor: "text-blue-600",
  },
  {
    name: "Marketing",
    apiCategory: "Sales & Marketing",
    jobs: "180+ Jobs",
    icon: MdCampaign,
    iconBg: "bg-green-50",
    iconColor: "text-green-600",
  },
  {
    name: "Finance",
    apiCategory: "Finance",
    jobs: "100+ Jobs",
    icon: MdAccountBalance,
    iconBg: "bg-yellow-50",
    iconColor: "text-yellow-600",
  },
  {
    name: "Customer Support",
    apiCategory: "Customer Service",
    jobs: "300+ Jobs",
    icon: MdSupportAgent,
    iconBg: "bg-orange-50",
    iconColor: "text-orange-600",
  },
  {
    name: "Healthcare",
    apiCategory: "Healthcare",
    jobs: "150+ Jobs",
    icon: MdOutlineHealthAndSafety,
    iconBg: "bg-red-50",
    iconColor: "text-red-600",
  },
  {
    name: "Engineering",
    apiCategory: "Engineering",
    jobs: "100+ Jobs",
    icon: MdEngineering,
    iconBg: "bg-orange-50",
    iconColor: "text-orange-600",
  },
  {
    name: "Human Resource",
    apiCategory: "Human Resources",
    jobs: "160+ Jobs",
    icon: MdPeople,
    iconBg: "bg-pink-50",
    iconColor: "text-pink-600",
  },
  {
    name: "Other",
    apiCategory: "Other",
    jobs: "150+ Jobs",
    icon: MdCategory,
    iconBg: "bg-slate-100",
    iconColor: "text-slate-600",
  },
];
export default function Category() {

//Modal View
const[selected,setselect]=useState(null);


  // Controls how many categories are displayed
  const [visibleCount, setVisibleCount] = useState(4);

  // Selected category
  const [selectedCategory, setSelectedCategory] = useState(null);

  // Jobs for selected category
  const [jobs, setJobs] = useState([]);

  // Loading state
  const [loading, setLoading] = useState(false);

  // Click category
  const handleCategoryClick = (category) => {
    setSelectedCategory(category);
  };

  // View all categories
  const handleViewAll = () => {
    setVisibleCount(categories.length);
  };

  // Back to categories
  const handleBack = () => {
    setSelectedCategory(null);
    setJobs([]);
  };

  // Fetch jobs when category changes
// Fetch jobs when category changes
useEffect(() => {
  if (!selectedCategory) {
    return;
  }

  const fetchCategoryJobs = async () => {
    try {
      setLoading(true);

      const response = await api.get("/create/getcategory", {
        params: {
          category: selectedCategory.apiCategory,
        },
      });

      setJobs(response.data.jobs || []);
    } catch (error) {
      console.error(error);
      setJobs([]);
    } finally {
      setLoading(false);
    }
  };

  fetchCategoryJobs();
}, [selectedCategory]); 


//Modal View
function ModalView(job)
{
  setselect(job)
}

return (
    <div id="categories" className=" mx-auto mt-16 max-w-5xl px-4">

      {/* ================================================= */}
      {/* CATEGORY LIST */}
      {/* ================================================= */}

      {!selectedCategory && (
        <>
          <div  className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">

            {categories.slice(0, visibleCount).map((category) => {
              const Icon = category.icon;

              return (
                <div
                  key={category.name}
                  onClick={() =>
                    handleCategoryClick(category)
                  }
                  className="group flex min-h-[14rem] cursor-pointer flex-col items-start justify-center gap-4 rounded-2xl border border-slate-200 bg-white p-8 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-blue-200 hover:shadow-lg"
                >

                  {/* Icon */}
                  <div
                    className={`flex h-16 w-16 shrink-0 items-center justify-center rounded-xl ${category.iconBg} ${category.iconColor} transition-transform duration-300 group-hover:scale-110`}
                  >
                    <Icon size={30} />
                  </div>

                  {/* Text & Arrow */}
                  <div className="mt-2 flex w-full items-center justify-between">

                    <div>
                      <h3 className="text-lg font-bold text-slate-700 transition-colors group-hover:text-blue-600">
                        {category.name}
                      </h3>

                      <p className="mt-1 text-sm font-medium text-slate-500">
                        {category.jobs}
                      </p>
                    </div>

                    {/* Arrow */}
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-slate-100 text-slate-400 transition-all duration-300 group-hover:bg-blue-600 group-hover:text-white">
                      <FiArrowRight className="transition-transform duration-300 group-hover:translate-x-1" />
                    </div>

                  </div>
                </div>
              );
            })}

          </div>

          {/* View All Button */}
          {visibleCount < categories.length && (
            <div className="mt-10 flex justify-center">

              <button
                onClick={handleViewAll}
                className="rounded-lg cursor-pointer bg-blue-50 px-8 py-3 font-semibold text-blue-600 transition-colors hover:bg-blue-600 hover:text-white"
              >
                View All Categories
              </button>

            </div>
          )}
        </>
      )}

      {/* ================================================= */}
      {/* SELECTED CATEGORY JOBS */}
      {/* ================================================= */}

      {selectedCategory && (
        <div>

          {/* Back Button */}
          <button
            onClick={handleBack}
            className="mb-8 flex cursor-pointer items-center gap-2 rounded-lg px-4 py-2 font-semibold text-slate-600 transition hover:bg-slate-100 hover:text-blue-600"
          >
            <FiArrowLeft />
            Back to Categories
          </button>

          {/* Category Heading */}
          <div className="mb-8">

            <p className="text-sm font-semibold uppercase tracking-wide text-blue-600">
              Jobs by Category
            </p>

            <h2 className="mt-2 text-3xl font-bold text-slate-800">
              {selectedCategory.name}
            </h2>

            <p className="mt-2 text-slate-500">
              Find available jobs in {selectedCategory.name}
            </p>

          </div>

          {/* Loading */}
          {loading && (
            <div className="rounded-2xl bg-white p-12 text-center shadow-sm">

              <p className="font-medium text-slate-500">
                Loading jobs...
              </p>

            </div>
          )}

          {/* No Jobs */}
          {!loading && jobs.length === 0 && (
            <div className="rounded-2xl bg-white p-12 text-center shadow-sm">

              <FiBriefcase className="mx-auto text-4xl text-slate-300" />

              <h3 className="mt-4 text-xl font-bold text-slate-700">
                No jobs found
              </h3>

              <p className="mt-2 text-slate-500">
                There are currently no jobs available in this category.
              </p>

            </div>
          )}

          {/* Jobs */}
          {!loading && jobs.length > 0 && (
            <div className="space-y-5">

              {jobs.map((job) => (
                <div
                  key={job.id}
                  className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition-all duration-300 hover:border-blue-200 hover:shadow-md"
                >

                  {/* Job Title */}
                  <h3 className="text-xl font-bold text-slate-800">
                    {job.title}
                  </h3>

                  {/* Company */}
                  <p className="mt-2 font-semibold text-blue-600">
                    {job.company}
                  </p>

                  {/* Location / Type */}
                  <div className="mt-3 flex flex-wrap gap-5 text-sm text-slate-500">

                    <span className="flex items-center gap-1.5">
                      <FiMapPin />
                      {job.location}
                    </span>

                    {job.jobType && (
                      <span className="flex items-center gap-1.5">
                        <FiBriefcase />
                        {job.jobType}
                      </span>
                    )}

                  </div>

                  {/* Job Tags */}
                  <div className="mt-4 flex flex-wrap gap-2">

                    {job.workMode && (
                      <span className="rounded-full bg-green-50 px-3 py-1 text-xs font-semibold text-green-600">
                        {job.workMode}
                      </span>
                    )}

                    {job.experience && (
                      <span className="rounded-full bg-purple-50 px-3 py-1 text-xs font-semibold text-purple-600">
                        {job.experience}
                      </span>
                    )}

                    {job.category && (
                      <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-600">
                        {job.category}
                      </span>
                    )}

 <button onClick={() => ModalView(job)}className="h-fit ml-auto cursor-pointer rounded-lg 
 bg-blue-600 px-5 py-2.5 font-semibold 
 text-white transition hover:bg-blue-700">
                    View Details
                  </button>
                  </div>
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
          className="rounded-lg cursor-pointer border border-gray-300
           bg-white px-5 py-2.5 text-sm font-medium text-gray-700
           hover:bg-gray-50 focus:outline-none focus:ring-2
           focus:ring-gray-200 transition-colors"
        >
          Close
        </button>
      <Apply job={selected} />
      </div>

    </div>
  </div>
)}
                </div>
              ))}

            </div>
          )}

        </div>
      )}

    </div>
  );
}