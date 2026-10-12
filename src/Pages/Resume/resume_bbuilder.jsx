
import { useState } from "react";

function CreateResume() {
  const [resume, setResume] = useState({
    fullName: "",
    email: "",
    phone: "",
    location: "",
    headline: "",
    summary: "",
    linkedin: "",
    github: "",
    portfolio: "",
     education: {
    degree: "",
    institution: "",
    year: "",},
    skills: "",
    experience: "",
    projects: "",
    certifications: "",
    languages: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;

    setResume({
      ...resume,
      [name]: value,
    });
  };

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     try {
//       const token = localStorage.getItem("accessToken");

//       const response = await axios.post(
//         "http://localhost:5000/api/resume/build",
//         resume,
//         {
//           headers: {
//             Authorization: `Bearer ${token}`,
//           },
//         }
//       );

const handleSubmit = async (e) => {
  e.preventDefault();

  try {
    const response = await api.post("/resume/updateresume", resume);

    console.log("CREATE RESUME RESPONSE:", response.data);

    alert("Resume created successfully");

  } 
  catch (error) {
    console.log("CREATE RESUME ERROR:", error);

    alert(
      error.response?.data?.message || "Something went wrong"
    );

    
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">
        Create Resume
      </h1>

      <form onSubmit={handleSubmit} className="space-y-5">

        {/* Full Name */}
        <div>
          <label className="block mb-1 font-medium">
            Full Name
          </label>

          <input
            type="text"
            name="fullName"
            value={resume.fullName}
            onChange={handleChange}
            className="w-full border rounded-lg p-2"
            placeholder="Enter full name"
            required
          />
        </div>

        {/* Email */}
        <div>
          <label className="block mb-1 font-medium">
            Email
          </label>

          <input
            type="email"
            name="email"
            value={resume.email}
            onChange={handleChange}
            className="w-full border rounded-lg p-2"
            placeholder="Enter email"
            required
          />
        </div>

        {/* Phone */}
        <div>
          <label className="block mb-1 font-medium">
            Phone
          </label>

          <input
            type="text"
            name="phone"
            value={resume.phone}
            onChange={handleChange}
            className="w-full border rounded-lg p-2"
            placeholder="Enter phone"
          />
        </div>

        {/* Location */}
        <div>
          <label className="block mb-1 font-medium">
            Location
          </label>

          <input
            type="text"
            name="location"
            value={resume.location}
            onChange={handleChange}
            className="w-full border rounded-lg p-2"
            placeholder="Enter location"
          />
        </div>

        {/* Headline */}
        <div>
          <label className="block mb-1 font-medium">
            Professional Headline
          </label>

          <input
            type="text"
            name="headline"
            value={resume.headline}
            onChange={handleChange}
            className="w-full border rounded-lg p-2"
            placeholder="e.g. Aspiring Software Developer"
          />
        </div>

        {/* Summary */}
        <div>
          <label className="block mb-1 font-medium">
            Summary
          </label>

          <textarea
            name="summary"
            value={resume.summary}
            onChange={handleChange}
            className="w-full border rounded-lg p-2"
            rows="4"
            placeholder="Write your professional summary"
          />
        </div>

        {/* LinkedIn */}
        <div>
          <label className="block mb-1 font-medium">
            LinkedIn
          </label>

          <input
            type="text"
            name="linkedin"
            value={resume.linkedin}
            onChange={handleChange}
            className="w-full border rounded-lg p-2"
            placeholder="LinkedIn profile URL"
          />
        </div>

        {/* GitHub */}
        <div>
          <label className="block mb-1 font-medium">
            GitHub
          </label>

          <input
            type="text"
            name="github"
            value={resume.github}
            onChange={handleChange}
            className="w-full border rounded-lg p-2"
            placeholder="GitHub profile URL"
          />
        </div>

        {/* Portfolio */}
        <div>
          <label className="block mb-1 font-medium">
            Portfolio
          </label>

          <input
            type="text"
            name="portfolio"
            value={resume.portfolio}
            onChange={handleChange}
            className="w-full border rounded-lg p-2"
            placeholder="Portfolio URL"
          />
        </div>

        {/* Education */}
        <div>
          <label className="block mb-1 font-medium">
            Education
          </label>

          <input
  type="text"
  placeholder="Degree"
  value={resume.education.degree}
  onChange={(e) =>
    setResume({
      ...resume,
      education: {
        ...resume.education,
        degree: e.target.value,
      },
    })
  }
/>

<input
  type="text"
  placeholder="Institution"
  value={resume.education.institution}
  onChange={(e) =>
    setResume({
      ...resume,
      education: {
        ...resume.education,
        institution: e.target.value,
      },
    })
  }
/>

<input
  type="text"
  placeholder="Year"
  value={resume.education.year}
  onChange={(e) =>
    setResume({
      ...resume,
      education: {
        ...resume.education,
        year: e.target.value,
      },
    })
  }
/>
        </div>

        {/* Skills */}
        <div>
          <label className="block mb-1 font-medium">
            Skills
          </label>

          <textarea
            name="skills"
            value={resume.skills}
            onChange={handleChange}
            className="w-full border rounded-lg p-2"
            rows="3"
            placeholder="React, JavaScript, Node.js, Express..."
          />
        </div>

        {/* Experience */}
        <div>
          <label className="block mb-1 font-medium">
            Experience
          </label>

          <textarea
            name="experience"
            value={resume.experience}
            onChange={handleChange}
            className="w-full border rounded-lg p-2"
            rows="4"
            placeholder="Enter your experience"
          />
        </div>

        {/* Projects */}
        <div>
          <label className="block mb-1 font-medium">
            Projects
          </label>

          <textarea
            name="projects"
            value={resume.projects}
            onChange={handleChange}
            className="w-full border rounded-lg p-2"
            rows="4"
            placeholder="Enter your projects"
          />
        </div>

        {/* Certifications */}
        <div>
          <label className="block mb-1 font-medium">
            Certifications
          </label>

          <textarea
            name="certifications"
            value={resume.certifications}
            onChange={handleChange}
            className="w-full border rounded-lg p-2"
            rows="3"
            placeholder="Enter certifications"
          />
        </div>

        {/* Languages */}
        <div>
          <label className="block mb-1 font-medium">
            Languages
          </label>

          <input
            type="text"
            name="languages"
            value={resume.languages}
            onChange={handleChange}
            className="w-full border rounded-lg p-2"
            placeholder="English, Bengali, Hindi"
          />
        </div>

        {/* Submit */}
        <button
          type="submit"
          className="bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700"
        >
          Create Resume
        </button>

      </form>
    </div>
  );
}

export default CreateResume;