import AppliedJobs from "../Show_applied_jobs/job_card";
import {
  FiDownload,
  FiEyeOff,
  FiFileText,
  FiBriefcase,
  FiMapPin,
  FiClock,
  FiPhone,
  FiGithub,
  FiLinkedin,
  FiDollarSign,
  FiUser,
  FiMail,
  FiAward
} from "react-icons/fi";

import { jsPDF } from "jspdf";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../../API/api";

const JobSeekerProfile = () => {
  const navigate = useNavigate();

  // Profile States
  const [profile, setProfile] = useState(null);
  const [profileNotFound, setProfileNotFound] = useState(false);
  const [loadingProfile, setLoadingProfile] = useState(true);

  // Resume States
  const [resume, setResume] = useState(null);
  const [loadingResume, setLoadingResume] = useState(false);

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

  const handleDownloadResume = async () => {
    try {
      const response = await api.get(
        `/profile/downloading/${profile.resumeUrl}`,
        { responseType: "blob" }
      );

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");

      link.href = url;
      link.setAttribute("download", profile.resumeUrl);

      document.body.appendChild(link);
      link.click();

      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Resume download failed:", error);
    }
  };

  const fetchResume = async () => {
    try {
      setLoadingResume(true);
      const response = await api.get("/resume/getResume");
      setResume(response.data.resume);
    } catch (error) {
      if (error.response?.status === 404) {
        alert("You have not created a resume yet. Please create one first.");
      } else {
        console.error("GET RESUME ERROR:", error);
        alert("Something went wrong while loading your resume.");
      }
    } finally {
      setLoadingResume(false);
    }
  };

  const DownloadResume = () => {
    const doc = new jsPDF();
    const pageHeight = doc.internal.pageSize.height || 297;
    const margin = 20;
    const maxWidth = 170;
    let currentY = 20;

    const addText = (text, fontSize, spaceAfter = 5, isHeader = false) => {
      if (!text) return;
      doc.setFontSize(fontSize);
      doc.setFont("helvetica", isHeader ? "bold" : "normal");

      const lines = doc.splitTextToSize(String(text), maxWidth);
      const textHeight = lines.length * (fontSize * 0.4);

      if (currentY + textHeight > pageHeight - margin) {
        doc.addPage();
        currentY = margin;
      }

      doc.text(lines, margin, currentY);
      currentY += textHeight + spaceAfter;
    };

    addText(resume.fullName, 20, 3, true);
    addText(resume.headline, 12, 2);
    addText(`${resume.email} | ${resume.phone} | ${resume.location}`, 11, 10);

    if (resume.summary) {
      addText("SUMMARY", 14, 4, true);
      addText(resume.summary, 11, 10);
    }

    if (resume.skills?.length) {
      addText("SKILLS", 14, 4, true);
      addText(resume.skills.join(", "), 11, 10);
    }

    if (resume.education?.length) {
      addText("EDUCATION", 14, 4, true);
      resume.education.forEach((edu) => {
        addText(edu.degree, 11, 2, true);
        addText(`${edu.institution} | ${edu.year}`, 11, 6);
      });
    }

    if (resume.experience?.length) {
      addText("EXPERIENCE", 14, 4, true);
      resume.experience.forEach((exp) => {
        addText(exp.position, 11, 2, true);
        addText(`${exp.company} | ${exp.duration}`, 11, 2);
        addText(exp.description, 11, 8);
      });
    }

    if (resume.projects?.length) {
      addText("PROJECTS", 14, 4, true);
      resume.projects.forEach((project) => {
        addText(project.name, 11, 2, true);
        addText(project.description, 11, 2);
        addText(`Technologies: ${project.technologies}`, 11, 8);
      });
    }

    if (resume.certifications?.length) {
      addText("CERTIFICATIONS", 14, 4, true);
      resume.certifications.forEach((cert) => {
        const certName = typeof cert === "object" ? cert.name : cert;
        addText(`${certName}`, 11, 3);
      });
      currentY += 5;
    }

    if (resume.languages?.length) {
      addText("LANGUAGES", 14, 4, true);
      addText(resume.languages.join(", "), 11, 10);
    }

    doc.save(`${resume.fullName?.replace(/\s+/g, "_")}_Resume.pdf`);
  };

  // Safely parse skills to prevent JSON crashes
  const parseSkills = (skillsData) => {
    if (!skillsData) return [];
    if (Array.isArray(skillsData)) return skillsData;
    try {
      return JSON.parse(skillsData);
    } catch {
      return typeof skillsData === "string" ? skillsData.split(",") : [];
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
      <div className="max-w-6xl mx-auto space-y-10">
        {/* Profile does not exist */}
        {profileNotFound && (
          <div className="max-w-2xl mx-auto text-center mt-12 bg-white p-12 rounded-3xl shadow-sm border border-slate-200">
            <div className="bg-indigo-50 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6 shadow-inner">
              <FiUser className="text-4xl text-indigo-600" />
            </div>
            <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
              Let's Build Your Profile
            </h1>
            <p className="text-slate-500 mt-3 mb-8 text-lg">
              Set up your profile to stand out to employers and start applying
              for your dream jobs.
            </p>
            <button
              onClick={() => navigate("/create-profile")}
              className="bg-indigo-600 hover:bg-indigo-700 active:scale-95 transition-all text-white px-8 py-3.5 rounded-xl font-semibold shadow-md hover:shadow-lg"
            >
              Create My Profile
            </button>
          </div>
        )}

        {/* Profile exists */}
        {profile && (
          <div className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden relative">
            {/* Elegant Banner Background */}
            <div className="h-40 sm:h-48 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 relative overflow-hidden">
              <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-white via-transparent to-transparent"></div>
            </div>

            <div className="px-6 sm:px-10 pb-10 relative">
              {/* Avatar & Actions */}
              <div className="flex flex-col sm:flex-row sm:items-end justify-between -mt-16 sm:-mt-20 mb-8 gap-6">
                <div className="flex flex-col sm:flex-row sm:items-end gap-6">
                  <div className="relative group">
                    <img
                      src={
                        profile.photo
                          ? `http://localhost:5000/api/profile/show/${profile.photo}`
                          : "https://via.placeholder.com/150"
                      }
                      className="w-32 h-32 sm:w-40 sm:h-40 rounded-full border-4 border-white bg-slate-100 object-cover shadow-xl transition-transform duration-300 group-hover:scale-[1.02]"
                      alt={profile.name}
                    />
                  </div>
                  <div className="mb-2">
                    <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
                      {profile.name}
                    </h1>
                    {profile.location && (
                      <p className="flex items-center text-slate-500 mt-1.5 font-medium gap-1.5">
                        <FiMapPin className="text-indigo-500" />{" "}
                        {profile.location}
                      </p>
                    )}
                  </div>
                </div>
                <button
                  onClick={() => navigate("/update-profile")}
                  className="px-6 py-2.5 border-2 border-slate-200 text-slate-700 font-semibold rounded-xl hover:bg-slate-50 hover:border-slate-300 transition-all active:scale-95 whitespace-nowrap"
                >
                  Edit Profile
                </button>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 xl:gap-12">
                {/* Left Column - Main Details */}
                <div className="lg:col-span-2 space-y-10">
                  {/* About Me */}
                  {profile.bio && (
                    <section>
                      <h2 className="text-xl font-bold text-slate-900 mb-4 flex items-center gap-2">
                        <FiUser className="text-indigo-600" /> About Me
                      </h2>
                      <p className="text-slate-600 leading-relaxed whitespace-pre-wrap text-lg">
                        {profile.bio}
                      </p>
                    </section>
                  )}

                  {/* Skills */}
                  <section>
                    <h2 className="text-xl font-bold text-slate-900 mb-5 flex items-center gap-2">
                      <FiBriefcase className="text-indigo-600" /> Skills &
                      Expertise
                    </h2>
                    <div className="flex flex-wrap gap-2.5">
                      {parseSkills(profile.skills).length > 0 ? (
                        parseSkills(profile.skills).map((skill, index) => (
                          <span
                            key={index}
                            className="px-4 py-1.5 bg-indigo-50 text-indigo-700 rounded-lg text-sm font-semibold border border-indigo-100 shadow-sm"
                          >
                            {skill}
                          </span>
                        ))
                      ) : (
                        <p className="text-slate-400 italic">
                          No skills added yet.
                        </p>
                      )}
                    </div>
                  </section>

                  {/* Applied Jobs Widget (Moved here) */}
                  <section>
                    <h2 className="text-xl font-bold text-slate-900 mb-5 flex items-center gap-2">
                      <FiFileText className="text-indigo-600" /> My Applications
                    </h2>
                    <AppliedJobs />
                  </section>
                </div>

                {/* Right Column - Sidebar Stats & Links */}
                <div className="space-y-6">
                  {/* Highlights Card */}
                  <div className="bg-slate-50 rounded-2xl p-6 border border-slate-100 shadow-sm">
                    <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-5">
                      At a Glance
                    </h3>
                    <div className="space-y-5">
                      <div className="flex items-center gap-4">
                        <div className="p-2.5 bg-white rounded-lg shadow-sm text-indigo-500">
                          <FiPhone className="text-lg" />
                        </div>
                        <div>
                          <p className="text-xs text-slate-400 font-medium">
                            Phone
                          </p>
                          <p className="font-semibold text-slate-700">
                            {profile.phone || "Not provided"}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-4">
                        <div className="p-2.5 bg-white rounded-lg shadow-sm text-indigo-500">
                          <FiClock className="text-lg" />
                        </div>
                        <div>
                          <p className="text-xs text-slate-400 font-medium">
                            Notice Period
                          </p>
                          <p className="font-semibold text-slate-700">
                            {profile.noticePeriod || "N/A"}
                          </p>
                        </div>
                      </div>

                      <div className="flex gap-4">
                        <div className="p-2.5 bg-white rounded-lg shadow-sm text-indigo-500 h-fit">
                          <FiDollarSign className="text-lg" />
                        </div>
                        <div className="w-full space-y-2">
                          <div>
                            <p className="text-xs text-slate-400 font-medium">
                              Current Salary
                            </p>
                            <p className="font-semibold text-slate-700">
                              {profile.currentSalary || "N/A"}
                            </p>
                          </div>
                          <div className="w-full h-px bg-slate-200"></div>
                          <div>
                            <p className="text-xs text-slate-400 font-medium">
                              Expected Salary
                            </p>
                            <p className="font-semibold text-indigo-600">
                              {profile.expectedSalary || "N/A"}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Links & Resume Card */}
                  <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
                    <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-5">
                      Documents & Links
                    </h3>

                    <div className="space-y-3">
                      {profile.resumeUrl ? (
                        <button
                          onClick={handleDownloadResume}
                          className="group flex items-center justify-center gap-2 w-full bg-indigo-50 text-indigo-700 border border-indigo-100 py-3 rounded-xl hover:bg-indigo-100 transition-colors font-semibold"
                        >
                          <FiDownload className="group-hover:-translate-y-0.5 transition-transform" />
                          View Uploaded Resume
                        </button>
                      ) : (
                        <div className="flex items-center justify-center w-full bg-slate-50 text-slate-400 border border-slate-200 py-3 rounded-xl font-medium text-sm">
                          No Resume Uploaded
                        </div>
                      )}

                      <button
                        onClick={() => navigate("/create-resume")}
                        className="flex items-center justify-center gap-2 w-full bg-indigo-600 text-white py-3 rounded-xl hover:bg-indigo-700 active:scale-[0.98] transition-all font-semibold shadow-md shadow-indigo-200"
                      >
                        <FiFileText /> Build Resume
                      </button>

                      <button
                        onClick={fetchResume}
                        className="flex items-center justify-center gap-2 w-full bg-white text-slate-700 border-2 border-slate-200 py-3 rounded-xl hover:border-indigo-600 hover:text-indigo-600 active:scale-[0.98] transition-all font-semibold"
                      >
                        <FiEyeOff className="hidden" /> {/* Spacer logic */}
                        View Generated Resume
                      </button>
                    </div>

                    {(profile.githubUrl || profile.linkedinUrl) && (
                      <div className="grid grid-cols-2 gap-3 mt-5 pt-5 border-t border-slate-100">
                        {profile.githubUrl && (
                          <a
                            href={profile.githubUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center justify-center gap-2 bg-[#24292e] text-white py-2.5 rounded-lg hover:bg-black transition-colors text-sm font-semibold"
                          >
                            <FiGithub /> GitHub
                          </a>
                        )}
                        {profile.linkedinUrl && (
                          <a
                            href={profile.linkedinUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center justify-center gap-2 bg-[#0a66c2] text-white py-2.5 rounded-lg hover:bg-[#004182] transition-colors text-sm font-semibold"
                          >
                            <FiLinkedin /> LinkedIn
                          </a>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Embedded Generated Resume Section */}
        {loadingResume ? (
          <div className="flex justify-center items-center py-16">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-indigo-600"></div>
          </div>
        ) : resume ? (
          <div
            id="resume-container"
            className="max-w-[900px] mx-auto bg-white text-slate-800 shadow-xl border border-slate-200 rounded-2xl overflow-hidden print:shadow-none print:border-none"
          >
            <div className="p-8 sm:p-14">
              {/* Resume Header */}
              <header className="text-center border-b-2 border-slate-800 pb-8 mb-10">
                <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 mb-3 uppercase tracking-tight">
                  {resume.fullName}
                </h1>
                <h2 className="text-xl font-medium text-indigo-600 mb-5 tracking-wide">
                  {resume.headline}
                </h2>
                <div className="flex flex-wrap justify-center items-center gap-4 text-sm font-medium text-slate-500">
                  <span className="flex items-center gap-1.5">
                    <FiMail /> {resume.email}
                  </span>
                  <span className="text-slate-300 hidden sm:inline">•</span>
                  <span className="flex items-center gap-1.5">
                    <FiPhone /> {resume.phone}
                  </span>
                  <span className="text-slate-300 hidden sm:inline">•</span>
                  <span className="flex items-center gap-1.5">
                    <FiMapPin /> {resume.location}
                  </span>
                </div>
              </header>

              {/* Resume Body */}
              <main className="space-y-10">
                {/* Summary */}
                {resume.summary && (
                  <section>
                    <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest border-b border-slate-200 pb-2 mb-4">
                      Professional Summary
                    </h3>
                    <p className="text-slate-700 leading-relaxed text-base">
                      {resume.summary}
                    </p>
                  </section>
                )}

                <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
                  {/* Main Timeline Column */}
                  <div className="md:col-span-2 space-y-10">
                    {/* Experience */}
                    <section>
                      <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest border-b border-slate-200 pb-2 mb-5">
                        Experience
                      </h3>
                      <div className="space-y-6">
                        {resume.experience?.length > 0 ? (
                          resume.experience.map((exp, index) => (
                            <div key={index} className="group">
                              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-baseline mb-1">
                                <h4 className="font-bold text-slate-900 text-lg">
                                  {exp.position}
                                </h4>
                                <span className="text-sm font-semibold text-indigo-600 shrink-0">
                                  {exp.duration}
                                </span>
                              </div>
                              <p className="text-slate-600 font-medium mb-2">
                                {exp.company}
                              </p>
                              {exp.description && (
                                <p className="text-slate-600 text-sm leading-relaxed">
                                  {exp.description}
                                </p>
                              )}
                            </div>
                          ))
                        ) : (
                          <p className="text-slate-400 italic">
                            No experience added.
                          </p>
                        )}
                      </div>
                    </section>

                    {/* Projects */}
                    <section>
                      <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest border-b border-slate-200 pb-2 mb-5">
                        Notable Projects
                      </h3>
                      <div className="space-y-6">
                        {resume.projects?.length > 0 ? (
                          resume.projects.map((project, index) => (
                            <div key={index}>
                              <h4 className="font-bold text-slate-900 text-lg">
                                {project.name}
                              </h4>
                              <p className="text-slate-600 text-sm leading-relaxed mt-1.5 mb-2">
                                {project.description}
                              </p>
                              <p className="text-xs font-semibold text-indigo-600 bg-indigo-50 inline-block px-2.5 py-1 rounded-md">
                                {project.technologies}
                              </p>
                            </div>
                          ))
                        ) : (
                          <p className="text-slate-400 italic">
                            No projects added.
                          </p>
                        )}
                      </div>
                    </section>
                  </div>

                  {/* Sidebar Column */}
                  <div className="md:col-span-1 space-y-10">
                    {/* Education */}
                    <section>
                      <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest border-b border-slate-200 pb-2 mb-5">
                        Education
                      </h3>
                      <div className="space-y-4">
                        {resume.education?.length > 0 ? (
                          resume.education.map((edu, index) => (
                            <div key={index}>
                              <h4 className="font-bold text-slate-900 leading-tight">
                                {edu.degree}
                              </h4>
                              <p className="text-slate-600 text-sm mt-1">
                                {edu.institution}
                              </p>
                              <p className="text-slate-400 text-xs mt-0.5 font-medium">
                                {edu.year}
                              </p>
                            </div>
                          ))
                        ) : (
                          <p className="text-slate-400 italic">
                            No education added.
                          </p>
                        )}
                      </div>
                    </section>

                    {/* Skills */}
                    <section>
                      <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest border-b border-slate-200 pb-2 mb-5">
                        Core Skills
                      </h3>
                      <div className="flex flex-wrap gap-2">
                        {resume.skills?.map((skill, index) => (
                          <span
                            key={index}
                            className="px-3 py-1 bg-slate-100 text-slate-700 rounded-md text-xs font-semibold"
                          >
                            {skill}
                          </span>
                        ))}
                      </div>
                    </section>

                    {/* Certifications */}
                    {resume.certifications?.length > 0 && (
                      <section>
                        <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest border-b border-slate-200 pb-2 mb-4">
                          Certifications
                        </h3>
                        <ul className="space-y-2">
                          {resume.certifications.map((cert, index) => (
                            <li
                              key={index}
                              className="flex gap-2 text-slate-700 text-sm items-start"
                            >
                              <FiAward className="mt-0.5 text-indigo-500 shrink-0" />
                              <span>
                                {typeof cert === "object" ? cert.name : cert}
                              </span>
                            </li>
                          ))}
                        </ul>
                      </section>
                    )}

                    {/* Languages */}
                    {resume.languages?.length > 0 && (
                      <section>
                        <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest border-b border-slate-200 pb-2 mb-4">
                          Languages
                        </h3>
                        <div className="flex flex-col gap-1.5">
                          {resume.languages.map((language, index) => (
                            <span
                              key={index}
                              className="text-sm font-medium text-slate-700"
                            >
                              {language}
                            </span>
                          ))}
                        </div>
                      </section>
                    )}
                  </div>
                </div>
              </main>
            </div>

            {/* Resume Action Bar (Hidden in Print) */}
            <div className="bg-slate-50 p-4 sm:px-8 border-t border-slate-200 flex flex-col sm:flex-row gap-4 justify-end print:hidden">
              <button
                onClick={() => setResume(null)}
                className="flex items-center justify-center gap-2 px-6 py-2.5 bg-white text-slate-600 border border-slate-300 rounded-xl hover:bg-slate-100 transition-all font-semibold shadow-sm"
              >
                <FiEyeOff /> Close
              </button>
              <button
                onClick={DownloadResume}
                className="flex items-center justify-center gap-2 px-6 py-2.5 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 active:scale-95 transition-all font-semibold shadow-md shadow-indigo-200"
              >
                <FiDownload /> Download PDF
              </button>
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
};

export default JobSeekerProfile;