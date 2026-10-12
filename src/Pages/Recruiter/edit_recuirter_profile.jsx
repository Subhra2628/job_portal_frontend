import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  FiUser,
  FiBriefcase,
  FiMapPin,
  FiPhone,
  FiLinkedin,
  FiGlobe,
  FiUpload,
  FiFileText,
  FiArrowLeft,
} from "react-icons/fi";

import api from "../../../API/api";

function EditRecruiterProfile() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    location: "",
    linkedinUrl: "",
    bio: "",
    companyName: "",
    companyWebsite: "",
    companyDescription: "",
  });

  const [photo, setPhoto] = useState(null);
  const [companyLogo, setCompanyLogo] = useState(null);

  const [photoPreview, setPhotoPreview] = useState("");
  const [logoPreview, setLogoPreview] = useState("");

  const [loading, setLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Fetch existing profile data on component mount
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await api.get("/profile/me");
        const profileData = response.data.profile || response.data; // Adjust based on your API response structure

        setFormData({
          name: profileData.name || "",
          phone: profileData.phone || "",
          location: profileData.location || "",
          linkedinUrl: profileData.linkedinUrl || "",
          bio: profileData.bio || "",
          companyName: profileData.companyName || "",
          companyWebsite: profileData.companyWebsite || "",
          companyDescription: profileData.companyDescription || "",
        });

        // Assuming your backend returns the URLs for existing images
        if (profileData.photoUrl) setPhotoPreview(profileData.photoUrl);
        if (profileData.companyLogoUrl) setLogoPreview(profileData.companyLogoUrl);
      } catch (err) {
        setError(
          err.response?.data?.message || "Unable to fetch profile data."
        );
      } finally {
        setIsFetching(false);
      }
    };

    fetchProfile();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handlePhotoChange = (e) => {
    const file = e.target.files?.[0];

    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setError("Please select a valid profile image.");
      e.target.value = "";
      return;
    }

    setPhoto(file);
    setPhotoPreview(URL.createObjectURL(file));
    setError("");
  };

  const handleLogoChange = (e) => {
    const file = e.target.files?.[0];

    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setError("Please select a valid company logo.");
      e.target.value = "";
      return;
    }

    setCompanyLogo(file);
    setLogoPreview(URL.createObjectURL(file));
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");
    setSuccess("");

    if (!formData.name.trim() || !formData.companyName.trim()) {
      setError("Full name and company name are required.");
      return;
    }

    if (formData.phone && !/^[0-9]{10}$/.test(formData.phone)) {
      setError("Please enter a valid 10-digit phone number.");
      return;
    }

    if (
      formData.linkedinUrl &&
      !/^https?:\/\/.+/i.test(formData.linkedinUrl)
    ) {
      setError("Please enter a valid LinkedIn URL starting with http:// or https://.");
      return;
    }

    if (
      formData.companyWebsite &&
      !/^https?:\/\/.+/i.test(formData.companyWebsite)
    ) {
      setError("Please enter a valid company website URL.");
      return;
    }

    try {
      setLoading(true);

      const data = new FormData();

      Object.entries(formData).forEach(([key, value]) => {
        data.append(key, value.trim());
      });

      if (photo) {
        data.append("photo", photo);
      }

      if (companyLogo) {
        data.append("companyLogo", companyLogo);
      }

      // Use PUT or PATCH for updating depending on your backend setup
      const response = await api.put("/profile/me", data);

      setSuccess(
        response.data.message || "Profile updated successfully!"
      );

      setTimeout(() => {
        navigate("/profile");
      }, 1000);
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Unable to update your profile. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  const inputClass =
    "w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-800 outline-none transition focus:border-indigo-500 focus:bg-white focus:ring-2 focus:ring-indigo-100";

  const labelClass = "mb-2 block text-sm font-medium text-gray-700";

  if (isFetching) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50">
        <p className="text-gray-500">Loading profile data...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 px-4 py-10 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-4xl">
        {/* Header */}
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="mb-6 flex items-center gap-2 text-sm font-medium text-gray-600 hover:text-indigo-600"
        >
          <FiArrowLeft />
          Go Back
        </button>

        <div className="mb-8">
          <div className="mb-3 flex h-14 w-14 items-center justify-center rounded-2xl bg-indigo-100 text-2xl text-indigo-600">
            <FiBriefcase />
          </div>

          <h1 className="text-3xl font-bold tracking-tight text-gray-900">
            Edit Recruiter Profile
          </h1>

          <p className="mt-2 text-gray-500">
            Update your professional profile and company information.
          </p>
        </div>

        {/* Feedback */}
        {error && (
          <div
            role="alert"
            className="mb-5 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700"
          >
            {error}
          </div>
        )}

        {success && (
          <div
            role="status"
            className="mb-5 rounded-xl border border-green-200 bg-green-50 p-4 text-sm text-green-700"
          >
            {success}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-7">
          {/* Personal Information */}
          <section className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm sm:p-8">
            <div className="mb-6 flex items-center gap-3">
              <div className="rounded-xl bg-indigo-50 p-3 text-indigo-600">
                <FiUser size={20} />
              </div>

              <div>
                <h2 className="text-lg font-semibold text-gray-900">
                  Personal Information
                </h2>
                <p className="text-sm text-gray-500">
                  Tell employers and candidates about yourself.
                </p>
              </div>
            </div>

            {/* Profile Photo */}
            <div className="mb-7 flex flex-col items-start gap-4 sm:flex-row sm:items-center">
              {photoPreview ? (
                <img
                  src={photoPreview}
                  alt="Profile preview"
                  className="h-24 w-24 rounded-full border border-gray-200 object-cover"
                />
              ) : (
                <div className="flex h-24 w-24 items-center justify-center rounded-full bg-indigo-50 text-3xl text-indigo-400">
                  <FiUser />
                </div>
              )}

              <div>
                <label
                  htmlFor="photo"
                  className="inline-flex cursor-pointer items-center gap-2 rounded-lg border border-gray-200 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
                >
                  <FiUpload />
                  Update Profile Photo
                </label>

                <input
                  id="photo"
                  type="file"
                  accept="image/*"
                  onChange={handlePhotoChange}
                  className="sr-only"
                />

                <p className="mt-2 text-xs text-gray-400">
                  Choose a new image to update your profile photo.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
              <div>
                <label htmlFor="name" className={labelClass}>
                  Full Name *
                </label>
                <input
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Enter your full name"
                  className={inputClass}
                  required
                />
              </div>

              <div>
                <label htmlFor="phone" className={labelClass}>
                  Phone Number
                </label>
                <div className="relative">
                  <FiPhone className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    id="phone"
                    name="phone"
                    type="tel"
                    inputMode="numeric"
                    maxLength={10}
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="10-digit mobile number"
                    className={`${inputClass} pl-10`}
                  />
                </div>
              </div>

              <div>
                <label htmlFor="location" className={labelClass}>
                  Location
                </label>
                <div className="relative">
                  <FiMapPin className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    id="location"
                    name="location"
                    value={formData.location}
                    onChange={handleChange}
                    placeholder="City, State"
                    className={`${inputClass} pl-10`}
                  />
                </div>
              </div>

              <div>
                <label htmlFor="linkedinUrl" className={labelClass}>
                  LinkedIn Profile URL
                </label>
                <div className="relative">
                  <FiLinkedin className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    id="linkedinUrl"
                    name="linkedinUrl"
                    type="url"
                    value={formData.linkedinUrl}
                    onChange={handleChange}
                    placeholder="https://linkedin.com/in/..."
                    className={`${inputClass} pl-10`}
                  />
                </div>
              </div>

              <div className="sm:col-span-2">
                <label htmlFor="bio" className={labelClass}>
                  Professional Bio
                </label>
                <textarea
                  id="bio"
                  name="bio"
                  rows={4}
                  value={formData.bio}
                  onChange={handleChange}
                  placeholder="Introduce yourself and describe your recruiting experience..."
                  className={`${inputClass} resize-y`}
                />
              </div>
            </div>
          </section>

          {/* Company Information */}
          <section className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm sm:p-8">
            <div className="mb-6 flex items-center gap-3">
              <div className="rounded-xl bg-purple-50 p-3 text-purple-600">
                <FiBriefcase size={20} />
              </div>

              <div>
                <h2 className="text-lg font-semibold text-gray-900">
                  Company Information
                </h2>
                <p className="text-sm text-gray-500">
                  Update the details candidates need to know about your company.
                </p>
              </div>
            </div>

            {/* Company Logo */}
            <div className="mb-7 flex flex-col items-start gap-4 sm:flex-row sm:items-center">
              {logoPreview ? (
                <img
                  src={logoPreview}
                  alt="Company logo preview"
                  className="h-20 w-20 rounded-xl border border-gray-200 bg-white object-contain p-2"
                />
              ) : (
                <div className="flex h-20 w-20 items-center justify-center rounded-xl bg-purple-50 text-3xl text-purple-400">
                  <FiBriefcase />
                </div>
              )}

              <div>
                <label
                  htmlFor="companyLogo"
                  className="inline-flex cursor-pointer items-center gap-2 rounded-lg border border-gray-200 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
                >
                  <FiUpload />
                  Update Company Logo
                </label>

                <input
                  id="companyLogo"
                  type="file"
                  accept="image/*"
                  onChange={handleLogoChange}
                  className="sr-only"
                />

                <p className="mt-2 text-xs text-gray-400">
                  Upload a new version of your company's brand logo.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
              <div>
                <label htmlFor="companyName" className={labelClass}>
                  Company Name *
                </label>
                <input
                  id="companyName"
                  name="companyName"
                  value={formData.companyName}
                  onChange={handleChange}
                  placeholder="Enter company name"
                  className={inputClass}
                  required
                />
              </div>

              <div>
                <label htmlFor="companyWebsite" className={labelClass}>
                  Company Website
                </label>
                <div className="relative">
                  <FiGlobe className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    id="companyWebsite"
                    name="companyWebsite"
                    type="url"
                    value={formData.companyWebsite}
                    onChange={handleChange}
                    placeholder="https://yourcompany.com"
                    className={`${inputClass} pl-10`}
                  />
                </div>
              </div>

              <div className="sm:col-span-2">
                <label
                  htmlFor="companyDescription"
                  className={labelClass}
                >
                  Company Description
                </label>
                <div className="relative">
                  <FiFileText className="absolute left-3 top-4 text-gray-400" />
                  <textarea
                    id="companyDescription"
                    name="companyDescription"
                    rows={5}
                    value={formData.companyDescription}
                    onChange={handleChange}
                    placeholder="Describe your company, its mission, industry, and work culture..."
                    className={`${inputClass} resize-y pl-10`}
                  />
                </div>
              </div>
            </div>
          </section>

          {/* Submit */}
          <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
            <button
              type="button"
              onClick={() => navigate(-1)}
              disabled={loading}
              className="rounded-xl border border-gray-200 bg-white px-6 py-3 font-medium text-gray-700 transition hover:bg-gray-50 disabled:opacity-50"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={loading}
              className="rounded-xl bg-indigo-600 px-7 py-3 font-semibold text-white shadow-sm transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? "Saving Changes..." : "Save Changes"}
            </button>
          </div>

          <p className="pb-4 text-center text-xs text-gray-400">
            * Required fields
          </p>
        </form>
      </div>
    </div>
  );
}

export default EditRecruiterProfile;