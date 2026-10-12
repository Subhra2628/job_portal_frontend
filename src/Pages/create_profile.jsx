import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../API/api";

const CreateProfile = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    photo: null,
    phone: "",
    location: "",
    skills: "",
    experience: "",
    expectedSalary: "",
    noticePeriod: "",
    githubUrl: "",
    linkedinUrl: "",
    bio: "",
    resumeUrl: null,
    jobPreferences: "",
  });

  // Handle normal text/number inputs
  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Handle file inputs
  const handleFileChange = (e) => {
    const { name, files } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: files[0] || null,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Create FormData
    const submitData = new FormData();

    // Convert comma-separated skills into array
    const skillsArray = formData.skills
      .split(",")
      .map((skill) => skill.trim())
      .filter((skill) => skill !== "");

    // Send skills as JSON string
    submitData.append("skills", JSON.stringify(skillsArray));

    // Append remaining fields
    Object.keys(formData).forEach((key) => {
      if (key === "skills") return;

      if (formData[key] !== null && formData[key] !== "") {
        submitData.append(key, formData[key]);
      }
    });

    try {
      const response = await api.post(
        "/profile/job-seeker",
        submitData
      );

      console.log("PROFILE CREATED:", response.data);

      navigate("/profile");
    } catch (error) {
      console.log("STATUS:", error.response?.status);
      console.log("DATA:", error.response?.data);
      console.log("ERROR:", error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 px-4 py-10">
      <div className="mx-auto max-w-2xl rounded-xl bg-white p-6 shadow">

        <h1 className="mb-2 text-2xl font-bold text-gray-800">
          Create Your Profile
        </h1>

        <p className="mb-6 text-gray-500">
          Add your information to create your job seeker profile.
        </p>

        <form onSubmit={handleSubmit} className="space-y-5">

          {/* Name */}
          <div>
            <label className="mb-1 block text-sm font-medium">
              Full Name
            </label>

            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Enter your full name"
              className="w-full rounded-lg border px-4 py-2 outline-none focus:border-blue-500"
              required
            />
          </div>

          {/* Profile Photo */}
          <div>
            <label className="mb-1 block text-sm font-medium">
              Profile Photo
            </label>

            <input
              type="file"
              name="photo"
              onChange={handleFileChange}
              accept="image/*"
              className="w-full rounded-lg border px-4 py-2"
            />
          </div>

          {/* Resume */}
          <div>
            <label className="mb-1 block text-sm font-medium">
              Resume / CV
            </label>

            <input
              type="file"
              name="resumeUrl"
              onChange={handleFileChange}
              accept=".pdf,.doc,.docx"
              className="w-full rounded-lg border px-4 py-2"
            />
          </div>

          {/* Phone */}
          <div>
            <label className="mb-1 block text-sm font-medium">
              Phone
            </label>

            <input
              type="text"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              placeholder="Enter your phone number"
              className="w-full rounded-lg border px-4 py-2 outline-none focus:border-blue-500"
            />
          </div>

          {/* Location */}
          <div>
            <label className="mb-1 block text-sm font-medium">
              Location
            </label>

            <input
              type="text"
              name="location"
              value={formData.location}
              onChange={handleChange}
              placeholder="e.g. Kolkata, West Bengal"
              className="w-full rounded-lg border px-4 py-2 outline-none focus:border-blue-500"
            />
          </div>

          {/* Job Preferences */}
          <div>
            <label className="mb-1 block text-sm font-medium">
              Job Preferences
            </label>

            <input
              type="text"
              name="jobPreferences"
              value={formData.jobPreferences}
              onChange={handleChange}
              placeholder="e.g. Remote, Full-time, Frontend"
              className="w-full rounded-lg border px-4 py-2 outline-none focus:border-blue-500"
            />
          </div>

          {/* Skills */}
          <div>
            <label className="mb-1 block text-sm font-medium">
              Skills (comma separated)
            </label>

            <input
              type="text"
              name="skills"
              value={formData.skills}
              onChange={handleChange}
              placeholder="e.g. React, Node.js, MySQL"
              className="w-full rounded-lg border px-4 py-2 outline-none focus:border-blue-500"
            />
          </div>

          {/* Experience */}
          <div>
            <label className="mb-1 block text-sm font-medium">
              Experience (years)
            </label>

            <input
              type="number"
              name="experience"
              value={formData.experience}
              onChange={handleChange}
              placeholder="0"
              min="0"
              className="w-full rounded-lg border px-4 py-2 outline-none focus:border-blue-500"
            />
          </div>

          {/* Expected Salary */}
          <div>
            <label className="mb-1 block text-sm font-medium">
              Expected Salary
            </label>

            <input
              type="text"
              name="expectedSalary"
              value={formData.expectedSalary}
              onChange={handleChange}
              placeholder="e.g. ₹20,000/month"
              className="w-full rounded-lg border px-4 py-2 outline-none focus:border-blue-500"
            />
          </div>

          {/* Notice Period */}
          <div>
            <label className="mb-1 block text-sm font-medium">
              Notice Period
            </label>

            <input
              type="text"
              name="noticePeriod"
              value={formData.noticePeriod}
              onChange={handleChange}
              placeholder="e.g. Immediate, 30 Days"
              className="w-full rounded-lg border px-4 py-2 outline-none focus:border-blue-500"
            />
          </div>

          {/* GitHub */}
          <div>
            <label className="mb-1 block text-sm font-medium">
              GitHub URL
            </label>

            <input
              type="url"
              name="githubUrl"
              value={formData.githubUrl}
              onChange={handleChange}
              placeholder="https://github.com/username"
              className="w-full rounded-lg border px-4 py-2 outline-none focus:border-blue-500"
            />
          </div>

          {/* LinkedIn */}
          <div>
            <label className="mb-1 block text-sm font-medium">
              LinkedIn URL
            </label>

            <input
              type="url"
              name="linkedinUrl"
              value={formData.linkedinUrl}
              onChange={handleChange}
              placeholder="https://linkedin.com/in/username"
              className="w-full rounded-lg border px-4 py-2 outline-none focus:border-blue-500"
            />
          </div>

          {/* Bio */}
          <div>
            <label className="mb-1 block text-sm font-medium">
              Bio
            </label>

            <textarea
              name="bio"
              value={formData.bio}
              onChange={handleChange}
              placeholder="Tell recruiters about yourself"
              rows="4"
              className="w-full rounded-lg border px-4 py-2 outline-none focus:border-blue-500"
            />
          </div>

          {/* Submit */}
          <button
            type="submit"
            className="w-full rounded-lg bg-blue-600 py-3 font-medium text-white transition hover:bg-blue-700"
          >
            Create Profile
          </button>

        </form>
      </div>
    </div>
  );
};

export default CreateProfile;