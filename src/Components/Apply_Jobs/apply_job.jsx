
import { useState, useEffect } from "react";
import api from "../../../API/api";

const Apply = ({ job }) => {
  const [loading, setLoading] = useState(false);
  const [applied, setApplied] = useState(false);
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    let cancelled = false;

    const checkApplication = async () => {
      const token = localStorage.getItem("accessToken");

      if (!token || !job?.id) {
        setChecking(false);
        return;
      }

      try {
        const response = await api.get(`/applyy/${job.id}`);

        if (!cancelled) {
          setApplied(Boolean(response.data.applied));
        }
      } catch (error) {
        console.error(
          "Check application failed:",
          error.response?.status,
          error.response?.data || error.message
        );
      } finally {
        if (!cancelled) {
          setChecking(false);
        }
      }
    };

    checkApplication();

    return () => {
      cancelled = true;
    };
  }, [job?.id]);

  const handleApply = async () => {
    const token = localStorage.getItem("accessToken");

    if (!token) {
      alert("Please login to apply for this job.");
      return;
    }

    if (!job?.id) {
      alert("Job information is missing.");
      return;
    }

    if (applied || loading) return;

    try {
      setLoading(true);

      const response = await api.post(`/apply/${job.id}`);

      setApplied(true);

      alert(response.data?.message || "Application submitted successfully!");
    } catch (error) {
      console.error(
        "Apply request failed:",
        error.response?.status,
        error.response?.data || error.message
      );

      alert(
        error.response?.data?.message ||
        "Could not apply. Check the browser console."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      type="button"
      onClick={handleApply}
      disabled={loading || applied || checking}
      className="float-right cursor-pointer rounded-lg bg-blue-600 px-5 py-2.5 font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
    >
      {checking
        ? "Checking..."
        : loading
        ? "Applying..."
        : applied
        ? "Applied"
        : "Apply Now"}
    </button>
  );
};

export default Apply;
