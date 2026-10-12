import api from "../../../API/api";
import { useEffect, useState } from "react";
import { 
  FiUser, 
  FiFileText, 
  FiBriefcase, 
  FiLink, 
  FiSave, 
  FiX 
} from "react-icons/fi";

function EditProfile() {
  const [profile, setProfile] = useState(null);
  const [newSkill, setNewSkill] = useState("");

  const normalizeSkills = (skills) => {
    if (!skills) return [];

    if (Array.isArray(skills)) {
      return skills;
    }

    try {
      return JSON.parse(skills);
    } catch {
      return skills
        .split(",")
        .map((skill) => skill.trim())
        .filter(Boolean);
    }
  };

  // =========================
  // Fetch existing profile
  // =========================
  const fetchProfile = async () => {
    try {
      const response = await api.get("/profile/me");
      const data = response.data.profile;

      setProfile({
        ...data,
        skills: normalizeSkills(data.skills),
      });
    } catch (error) {
      console.log("FETCH PROFILE ERROR:", error);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  // =========================
  // Handle text inputs
  // =========================
  const handleChange = (e) => {
    const { name, value } = e.target;

    setProfile((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // =========================
  // Handle file inputs
  // =========================
  const handleFileChange = (e) => {
    const { name, files } = e.target;

    setProfile((prev) => ({
      ...prev,
      [name]: files[0] || null,
    }));
  };

  // =========================
  // Update skills
  // =========================
  const handleAddSkill = () => {
    const skill = newSkill.trim();

    if (!skill) return;

    if (profile.skills.includes(skill)) {
      alert("Skill already added");
      return;
    }

    setProfile((prev) => ({
      ...prev,
      skills: [...prev.skills, skill],
    }));

    setNewSkill("");
  };

  const handleRemoveSkill = (skillToRemove) => {
    setProfile((prev) => ({
      ...prev,
      skills: prev.skills.filter((skill) => skill !== skillToRemove),
    }));
  };

  // =========================
  // Update profile
  // =========================
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!profile.name || !profile.phone || !profile.location || !profile.bio) {
      alert("Please enter all required fields");
      return;
    }

    try {
      const submitData = new FormData();

      // Normal text fields
      submitData.append("name", profile.name);
      submitData.append("phone", profile.phone);
      submitData.append("location", profile.location);
      submitData.append("experience", profile.experience ?? "");
      submitData.append("currentSalary", profile.currentSalary ?? "");
      submitData.append("expectedSalary", profile.expectedSalary ?? "");
      submitData.append("noticePeriod", profile.noticePeriod ?? "");
      submitData.append("githubUrl", profile.githubUrl ?? "");
      submitData.append("linkedinUrl", profile.linkedinUrl ?? "");
      submitData.append("jobPreferences", profile.jobPreferences ?? "");
      submitData.append("bio", profile.bio ?? "");

      // Skills
      submitData.append("skills", JSON.stringify(profile.skills || []));

      // Files
      if (profile.photo instanceof File) {
        submitData.append("photo", profile.photo);
      }
      if (profile.resumeUrl instanceof File) {
        submitData.append("resumeUrl", profile.resumeUrl);
      }

      // Send request
      const response = await api.put("/profile/me", submitData);
      const data = response.data.profile;

      setProfile({
        ...data,
        skills: normalizeSkills(data.skills),
      });

      alert("Profile updated successfully");
    } catch (error) {
      console.log("STATUS:", error.response?.status);
      console.log("DATA:", error.response?.data);
      console.log("UPDATE ERROR:", error);
    }
  };

  // =========================
  // Loading State
  // =========================
  if (!profile) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-slate-50">
        <div className="relative">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
          <div className="absolute top-0 left-0 animate-ping rounded-full h-12 w-12 border border-indigo-400 opacity-20"></div>
        </div>
      </div>
    );
  }

  // Base input classes for consistency
  const inputClass = "w-full px-4 py-3 bg-slate-50/50 rounded-xl border border-slate-200 text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all duration-200";
  const labelClass = "text-sm font-semibold text-slate-700 mb-1.5 ml-1 block";
  const sectionHeaderClass = "text-lg font-bold text-slate-900 mb-6 flex items-center gap-2 border-b border-slate-100 pb-3";

  return (
    <div className="min-h-screen bg-slate-50 py-10 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-3xl shadow-sm border border-slate-200 p-8 sm:p-12">
          
          {/* Header */}
          <div className="mb-10 text-center sm:text-left">
            <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
              Edit Profile
            </h1>
            <p className="text-slate-500 mt-2 text-base">
              Update your personal information and professional details to stand out.
            </p>
          </div>

          <form className="space-y-12" onSubmit={handleSubmit}>

            {/* =========================
                Basic Information
            ========================= */}
            <section>
              <h2 className={sectionHeaderClass}>
                <FiUser className="text-indigo-600" /> Basic Information
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label className={labelClass}>Full Name <span className="text-red-500">*</span></label>
                  <input
                    type="text"
                    name="name"
                    value={profile.name ?? ""}
                    onChange={handleChange}
                    className={inputClass}
                    placeholder="e.g. John Doe"
                  />
                </div>
                <div>
                  <label className={labelClass}>Phone Number <span className="text-red-500">*</span></label>
                  <input
                    type="text"
                    name="phone"
                    value={profile.phone ?? ""}
                    onChange={handleChange}
                    className={inputClass}
                    placeholder="e.g. +91 9876543210"
                  />
                </div>
                <div>
                  <label className={labelClass}>Location <span className="text-red-500">*</span></label>
                  <input
                    type="text"
                    name="location"
                    value={profile.location ?? ""}
                    onChange={handleChange}
                    className={inputClass}
                    placeholder="e.g. Kolkata, West Bengal"
                  />
                </div>
              </div>
            </section>

            {/* =========================
                Profile Files
            ========================= */}
            <section>
              <h2 className={sectionHeaderClass}>
                <FiFileText className="text-indigo-600" /> Documents & Media
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label className={labelClass}>Profile Photo</label>
                  <input
                    type="file"
                    name="photo"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="w-full text-sm text-slate-500 file:mr-4 file:py-2.5 file:px-4 file:rounded-xl file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100 transition-all file:cursor-pointer cursor-pointer"
                  />
                  {typeof profile.photo === "string" && profile.photo && (
                    <p className="text-xs text-emerald-600 font-medium mt-2 flex items-center gap-1">
                      ✓ Existing photo uploaded
                    </p>
                  )}
                </div>
                <div>
                  <label className={labelClass}>Resume / CV</label>
                  <input
                    type="file"
                    name="resumeUrl"
                    accept=".pdf,.doc,.docx"
                    onChange={handleFileChange}
                    className="w-full text-sm text-slate-500 file:mr-4 file:py-2.5 file:px-4 file:rounded-xl file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100 transition-all file:cursor-pointer cursor-pointer"
                  />
                  {typeof profile.resumeUrl === "string" && profile.resumeUrl && (
                    <p className="text-xs text-emerald-600 font-medium mt-2 flex items-center gap-1">
                      ✓ Existing resume uploaded
                    </p>
                  )}
                </div>
              </div>
            </section>

            {/* =========================
                Professional Details
            ========================= */}
            <section>
              <h2 className={sectionHeaderClass}>
                <FiBriefcase className="text-indigo-600" /> Professional Details
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label className={labelClass}>Experience (Years)</label>
                  <input
                    type="number"
                    name="experience"
                    value={profile.experience ?? ""}
                    onChange={handleChange}
                    min="0"
                    className={inputClass}
                    placeholder="e.g. 2"
                  />
                </div>
                <div>
                  <label className={labelClass}>Notice Period</label>
                  <input
                    type="text"
                    name="noticePeriod"
                    value={profile.noticePeriod ?? ""}
                    onChange={handleChange}
                    className={inputClass}
                    placeholder="e.g. Immediate, 30 Days"
                  />
                </div>

                {/* Skills Component */}
                <div className="sm:col-span-2">
                  <label className={labelClass}>Core Skills</label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={newSkill}
                      onChange={(e) => setNewSkill(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          e.preventDefault();
                          handleAddSkill();
                        }
                      }}
                      className={inputClass}
                      placeholder="Type a skill and press Add or Enter (e.g. React, Node.js)"
                    />
                    <button
                      type="button"
                      onClick={handleAddSkill}
                      className="px-6 py-3 rounded-xl bg-slate-900 text-white font-semibold hover:bg-slate-800 transition-all active:scale-95 whitespace-nowrap"
                    >
                      Add Skill
                    </button>
                  </div>
                  
                  <div className="flex flex-wrap gap-2.5 mt-4">
                    {profile.skills?.length > 0 ? (
                      profile.skills.map((skill, index) => (
                        <div
                          key={index}
                          className="flex items-center gap-2 px-3 py-1.5 bg-indigo-50 border border-indigo-100 text-indigo-700 rounded-lg text-sm font-semibold group"
                        >
                          <span>{skill}</span>
                          <button
                            type="button"
                            onClick={() => handleRemoveSkill(skill)}
                            className="text-indigo-400 hover:text-red-500 transition-colors p-0.5 rounded-md hover:bg-red-50"
                          >
                            <FiX className="text-base" />
                          </button>
                        </div>
                      ))
                    ) : (
                      <p className="text-sm text-slate-400 italic">No skills added yet.</p>
                    )}
                  </div>
                </div>

                <div>
                  <label className={labelClass}>Current Salary</label>
                  <input
                    type="text"
                    name="currentSalary"
                    value={profile.currentSalary ?? ""}
                    onChange={handleChange}
                    className={inputClass}
                    placeholder="e.g. ₹6,00,000"
                  />
                </div>
                <div>
                  <label className={labelClass}>Expected Salary</label>
                  <input
                    type="text"
                    name="expectedSalary"
                    value={profile.expectedSalary ?? ""}
                    onChange={handleChange}
                    className={inputClass}
                    placeholder="e.g. ₹8,00,000"
                  />
                </div>
              </div>
            </section>

            {/* =========================
                Links & Bio
            ========================= */}
            <section>
              <h2 className={sectionHeaderClass}>
                <FiLink className="text-indigo-600" /> Online Presence & Bio
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-6">
                <div>
                  <label className={labelClass}>GitHub URL</label>
                  <input
                    type="text"
                    name="githubUrl"
                    value={profile.githubUrl ?? ""}
                    onChange={handleChange}
                    className={inputClass}
                    placeholder="https://github.com/yourusername"
                  />
                </div>
                <div>
                  <label className={labelClass}>LinkedIn URL</label>
                  <input
                    type="text"
                    name="linkedinUrl"
                    value={profile.linkedinUrl ?? ""}
                    onChange={handleChange}
                    className={inputClass}
                    placeholder="https://linkedin.com/in/yourusername"
                  />
                </div>
              </div>

              <div className="mb-6">
                <label className={labelClass}>Job Preferences</label>
                <input
                  type="text"
                  name="jobPreferences"
                  value={profile.jobPreferences ?? ""}
                  onChange={handleChange}
                  className={inputClass}
                  placeholder="e.g. Remote, Hybrid, Frontend Developer"
                />
              </div>

              <div>
                <label className={labelClass}>Professional Bio <span className="text-red-500">*</span></label>
                <textarea
                  name="bio"
                  rows="4"
                  value={profile.bio ?? ""}
                  onChange={handleChange}
                  className={`${inputClass} resize-y`}
                  placeholder="Tell us a little bit about yourself, your background, and your career goals..."
                />
              </div>
            </section>

            {/* =========================
                Action Buttons
            ========================= */}
            <div className="flex flex-col-reverse sm:flex-row items-center justify-end gap-4 pt-8 border-t border-slate-200">
              <button
                type="button"
                onClick={() => fetchProfile()}
                className="w-full sm:w-auto px-6 py-3 rounded-xl text-slate-600 font-semibold border-2 border-transparent hover:border-slate-200 hover:bg-slate-50 transition-all"
              >
                Reset Changes
              </button>
              <button
                type="submit"
                className="w-full sm:w-auto flex items-center justify-center gap-2 px-8 py-3 rounded-xl bg-indigo-600 text-white font-semibold hover:bg-indigo-700 active:scale-95 transition-all shadow-md shadow-indigo-200"
              >
                <FiSave className="text-lg" /> Save Profile
              </button>
            </div>

          </form>
        </div>
      </div>
    </div>
  );
}

export default EditProfile;