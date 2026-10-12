import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../../API/api";

function VerifyEmail() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");

  const [codeSent, setCodeSent] = useState(false);
  const [loading, setLoading] = useState(false);

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  // Send verification code
  const handleSendCode = async () => {
    if (!email) {
      setError("Email is required");
      return;
    }
    
    try {
      setLoading(true);
      setError("");
      setMessage("");

      const response = await api.post("/auth/send-otp", {
        email: email,
      });

      setMessage(response.data.message);
      setCodeSent(true);
    } catch (error) {
      setError(
        error.response?.data?.message ||
          "Failed to send verification code."
      );
    } finally {
      setLoading(false);
    }
  };

  // Verify code
  const handleVerifyCode = async () => {
    if (!email || !code) {
      setError("Email and OTP are required");
      return;
    }

    try {
      setLoading(true);
      setError("");
      setMessage("");

      const response = await api.post("/auth/verify-otp", {
        email: email,
        otp: code, // <-- Changed from "code: code" to match your backend
      });

      setMessage(response.data.message);

      // Email verified → go to Register and pass the email in state
      setTimeout(() => {
        navigate("/register", { state: { verifiedEmail: email } });
      }, 1000);
      
    } catch (error) {
      setError(
        error.response?.data?.message ||
          "Invalid verification code."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
        
        {/* Header Icon */}
        <div className="mx-auto w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-6">
          <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
          </svg>
        </div>

        {/* Dynamic Header */}
        <div className="text-center mb-8">
          <h2 className="text-2xl font-extrabold text-gray-900 tracking-tight">
            {!codeSent ? "Verify your email" : "Enter verification code"}
          </h2>
          <p className="mt-2 text-sm text-gray-500">
            {!codeSent ? (
              "We'll send a code to confirm your address."
            ) : (
              <>
                We sent a code to <span className="font-semibold text-gray-900">{email}</span>
              </>
            )}
          </p>
        </div>

        {/* Alerts */}
        {error && (
          <div className="mb-6 p-4 rounded-xl bg-red-50 border border-red-100 text-sm text-red-600 flex items-start">
            <svg className="w-5 h-5 mr-2 shrink-0" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" /></svg>
            {error}
          </div>
        )}
        {message && (
          <div className="mb-6 p-4 rounded-xl bg-green-50 border border-green-100 text-sm text-green-600 flex items-start">
            <svg className="w-5 h-5 mr-2 shrink-0" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" /></svg>
            {message}
          </div>
        )}

        <div className="space-y-6">
          {!codeSent ? (
            <>
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1.5">
                  Email Address
                </label>
                <input
                  id="email"
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-600 focus:border-transparent outline-none transition-all"
                  disabled={loading}
                />
              </div>

              <button
                onClick={handleSendCode}
                disabled={loading || !email}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-xl transition-all shadow-md hover:shadow-lg disabled:opacity-50 disabled:shadow-none flex justify-center items-center"
              >
                {loading ? (
                  <svg className="animate-spin h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                ) : (
                  "Send Verification Code"
                )}
              </button>
            </>
          ) : (
            <>
              <div>
                <label htmlFor="code" className="block text-sm font-medium text-gray-700 mb-1.5 text-center">
                  6-Digit Code
                </label>
                <input
                  id="code"
                  type="text"
                  placeholder="000000"
                  maxLength={6}
                  value={code}
                  onChange={(e) => setCode(e.target.value.replace(/\D/g, ''))}
                  className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-600 focus:border-transparent outline-none transition-all text-center text-2xl tracking-[0.5em] font-mono"
                  disabled={loading}
                />
              </div>

              <button
                onClick={handleVerifyCode}
                disabled={loading || code.length < 6}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-xl transition-all shadow-md hover:shadow-lg disabled:opacity-50 disabled:shadow-none flex justify-center items-center"
              >
                {loading ? "Verifying..." : "Verify Email"}
              </button>

              <div className="text-center mt-4">
                <button
                  onClick={() => setCodeSent(false)}
                  className="text-sm font-medium text-gray-500 hover:text-blue-600 transition-colors"
                  type="button"
                >
                  Entered the wrong email?
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default VerifyEmail;