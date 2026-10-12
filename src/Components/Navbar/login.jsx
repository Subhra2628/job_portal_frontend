import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { FiMail, FiLock, FiEye, FiEyeOff, FiAlertCircle, FiHexagon } from "react-icons/fi";
import api from "../../../API/api";

const Login = () => {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    
    if (!email || !password) {
      setError("Please enter both email and password.");
      return;
    }

    try {
      setLoading(true);
      setError("");

      const response = await api.post("/auth/login", {
        email: email,
        password: password,
      });
      
      localStorage.setItem("accessToken", response.data.accessToken);
      localStorage.setItem(
  "role",
  response.data.user.role
);
      window.dispatchEvent(new Event("auth-change"));
      navigate("/profile");

    } catch (error) {
      setError(
        error.response?.data?.message || 
        "Invalid email or password. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#fafcff] relative overflow-hidden p-4 sm:p-8 font-sans selection:bg-indigo-500/30">
      
      {/* --- Premium Background Effects --- */}
      {/* 1. Fading Dot Grid Pattern */}
      <div 
        className="absolute inset-0 z-0 pointer-events-none opacity-40" 
        style={{ 
          backgroundImage: 'radial-gradient(#cbd5e1 1px, transparent 1px)', 
          backgroundSize: '24px 24px',
          maskImage: 'linear-gradient(to bottom, black 40%, transparent 100%)',
          WebkitMaskImage: 'linear-gradient(to bottom, black 40%, transparent 100%)'
        }}
      ></div>

      {/* 2. Ambient Glowing Orbs */}
      <div className="absolute top-[-10%] left-[-10%] w-[40vw] h-[40vw] rounded-full bg-indigo-400/20 mix-blend-multiply blur-[100px] animate-pulse pointer-events-none duration-1000"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[40vw] h-[40vw] rounded-full bg-violet-400/20 mix-blend-multiply blur-[100px] animate-pulse pointer-events-none duration-1000 delay-500"></div>
      <div className="absolute top-[20%] left-[60%] w-[30vw] h-[30vw] rounded-full bg-blue-300/20 mix-blend-multiply blur-[100px] animate-pulse pointer-events-none duration-1000 delay-700"></div>

      {/* --- Main Login Card --- */}
      <div className="relative z-10 w-full max-w-[420px]">
        <div className="bg-white/70 backdrop-blur-2xl rounded-[2rem] shadow-[0_8px_40px_-12px_rgba(0,0,0,0.1)] border border-white p-8 sm:p-10 transition-all duration-300 hover:shadow-[0_16px_60px_-15px_rgba(0,0,0,0.1)]">
          
          {/* Header */}
          <div className="text-center mb-10">
            <div className="mx-auto w-14 h-14 bg-gradient-to-br from-indigo-500 to-violet-600 rounded-2xl flex items-center justify-center mb-6 shadow-lg shadow-indigo-500/30 transform hover:scale-105 transition-transform duration-300">
              <FiHexagon className="text-3xl text-white" />
            </div>
            <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">
              Welcome back
            </h2>
            <p className="mt-2.5 text-sm font-medium text-slate-500">
              Enter your credentials to access your account
            </p>
          </div>

          {/* Error Alert */}
          {error && (
            <div className="mb-6 p-4 rounded-2xl bg-red-50/80 backdrop-blur-sm border border-red-100 text-sm text-red-600 flex items-start gap-3 animate-fade-in font-medium">
              <FiAlertCircle className="text-lg shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleLogin} className="space-y-5">
            
            {/* Email Field */}
            <div className="space-y-1.5">
              <label className="block text-sm font-bold text-slate-700 ml-1">
                Email Address
              </label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400 group-focus-within:text-indigo-500 transition-colors">
                  <FiMail className="text-lg" />
                </div>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@company.com"
                  className="w-full pl-11 pr-4 py-3.5 bg-slate-50/50 hover:bg-slate-50 border border-slate-200 rounded-2xl text-slate-900 placeholder-slate-400 focus:outline-none focus:bg-white focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all duration-300"
                  disabled={loading}
                  required
                />
              </div>
            </div>

            {/* Password Field */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between ml-1">
                <label className="block text-sm font-bold text-slate-700">
                  Password
                </label>
                <button
                  type="button"
                  onClick={() => alert("Forgot password flow not yet implemented")}
                  className="text-xs font-bold text-indigo-600 hover:text-indigo-700 transition-colors"
                >
                  Forgot password?
                </button>
              </div>
              
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400 group-focus-within:text-indigo-500 transition-colors">
                  <FiLock className="text-lg" />
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-11 pr-12 py-3.5 bg-slate-50/50 hover:bg-slate-50 border border-slate-200 rounded-2xl text-slate-900 placeholder-slate-400 focus:outline-none focus:bg-white focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all duration-300"
                  disabled={loading}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-4 flex items-center text-slate-400 hover:text-slate-600 focus:outline-none transition-colors"
                >
                  {showPassword ? <FiEyeOff className="text-lg" /> : <FiEye className="text-lg" />}
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <div className="pt-3">
              <button
                type="submit"
                disabled={loading}
                className="relative w-full group overflow-hidden bg-slate-900 text-white font-bold py-4 px-4 rounded-2xl transition-all duration-300 active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed shadow-[0_4px_14px_0_rgb(0,0,0,0.1)] hover:shadow-[0_6px_20px_rgba(0,0,0,0.15)]"
              >
                {/* Beautiful Gradient Background that shifts on hover */}
                <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-indigo-600 via-violet-600 to-indigo-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300" style={{ backgroundSize: '200% auto' }}></div>
                
                <span className="relative flex justify-center items-center gap-2">
                  {loading ? (
                    <svg className="animate-spin h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                  ) : (
                    "Sign In"
                  )}
                </span>
              </button>
            </div>
          </form>

          {/* Footer */}
          <div className="mt-8 pt-6 border-t border-slate-100/60 text-center">
            <p className="text-sm font-medium text-slate-500">
              Don't have an account?{" "}
              <Link
                to="/register"
                className="font-bold text-indigo-600 hover:text-indigo-700 transition-colors"
              >
                Sign up for free
              </Link>
            </p>
          </div>
          
        </div>
        
        {/* Decorative shadow under the card */}
        <div className="absolute -bottom-4 inset-x-8 h-4 bg-slate-900/5 blur-xl -z-10 rounded-full"></div>
      </div>
    </div>
  );
};

export default Login;