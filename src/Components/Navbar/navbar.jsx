




import React, { useState, useEffect } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import handleLogout from "./log_out";

function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [showAuth, setShowAuth] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  
  const navigate = useNavigate();

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  // Check login status on mount and listen for changes
  useEffect(() => {
    const checkLogin = () => {
      const token = localStorage.getItem("accessToken");
      setIsLoggedIn(!!token);
    };

    checkLogin();

    // Listens for localStorage changes across different tabs
    window.addEventListener("storage", checkLogin);
    // Listens for our custom login/logout event in the SAME tab
    window.addEventListener("auth-change", checkLogin);
    
    return () => {
      window.removeEventListener("storage", checkLogin);
      window.removeEventListener("auth-change", checkLogin);
    }
  }, []);

  const logoutUser = async () => {
    const success = await handleLogout();
    if (success) {
      localStorage.removeItem("accessToken"); // Ensure token is removed
      window.dispatchEvent(new Event("auth-change")); // Tell Navbar to update!
      setIsLoggedIn(false);
      navigate("/login");
    }
  };

  const navStyle = ({ isActive }) =>
    `relative text-base font-semibold tracking-wide transition-colors py-2
  after:absolute after:bottom-0 after:left-1/2 after:h-[2px] after:-translate-x-1/2
  after:bg-blue-300 after:transition-all after:duration-300
  ${
    isActive
      ? "text-blue-600 after:w-full after:bg-blue-600"
      : "text-gray-500 after:w-0 hover:text-blue-600 hover:after:w-full"
  }`;

  const mobileNavStyle = ({ isActive }) =>
    `block px-4 py-3 rounded-xl text-base font-medium transition-all ${
      isActive
        ? "bg-blue-50 text-blue-700 shadow-sm"
        : "text-gray-600 hover:text-blue-600 hover:bg-gray-50"
    }`;

  return (
    <nav className="sticky top-0 z-50 w-full bg-white/80 backdrop-blur-md border-b border-gray-100 shadow-sm transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative flex justify-between items-center h-20">
          
          {/* Left side: Logo */}
          <div className="flex-shrink-0 flex items-center">
            <Link to="/" className="flex items-center gap-2 group">
              <div className="p-1.5 bg-blue-600 rounded-lg group-hover:bg-blue-700 transition-colors">
                <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <span className="text-2xl font-extrabold text-gray-900 tracking-tight">
                HIRE<span className="text-blue-600">HUB</span>
              </span>
            </Link>
          </div>

          {/* Center: Primary Navigation */}
          <div className="hidden md:flex absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 space-x-10">
            <NavLink to="/" className={navStyle}>Home</NavLink>
            <NavLink to="/find-jobs" className={navStyle}>Find Jobs</NavLink>
            <NavLink to="/profile" className={navStyle}>Profile</NavLink>
          </div>

          {/* Right Side: Actions (Desktop) */}
          <div className="hidden md:flex items-center space-x-6">
            {!isLoggedIn ? (
              <div className="relative">
                <button
                  onClick={() => setShowAuth(!showAuth)}
                  onBlur={() => setTimeout(() => setShowAuth(false), 200)}
                  className="relative text-base font-semibold hover:cursor-pointer text-gray-600 hover:text-blue-600 transition-colors flex items-center gap-1"
                >
                  Login / Register
                  <svg className={`w-4 h-4 transition-transform duration-200 ${showAuth ? "rotate-180" : ""}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                  </svg>
                </button>

                {showAuth && (
                  <div className="absolute right-0 mt-4 z-50 w-40 rounded-xl border border-gray-100 bg-white p-2 shadow-xl hover:cursor-pointer">
                    <Link to="/login" onClick={() => setShowAuth(false)} className="block rounded-md px-4 py-2.5 text-sm font-semibold hover:cursor-pointer text-gray-600 hover:bg-blue-50 hover:text-blue-600 transition-colors">
                      Login
                    </Link>
                    <Link to="/register" onClick={() => setShowAuth(false)} className="block rounded-md px-4 py-2.5 text-sm font-semibold text-gray-600 hover:bg-blue-50 hover:text-blue-600 transition-colors">
                      Register
                    </Link>
                  </div>
                )}
              </div>
            ) : (
              <button onClick={logoutUser} className="text-base font-semibold text-gray-600 hover:text-red-600 cursor-pointer transition-colors">
                Logout
              </button>
            )}
            
            <Link to="/post-job" className="inline-flex items-center justify-center bg-blue-600 hover:bg-blue-700 text-white px-6 py-2.5 rounded-full text-sm font-bold transition-all shadow-md hover:shadow-lg transform hover:-translate-y-0.5">
              Post Job
            </Link>
          </div>

          {/* Mobile menu button */}
          <div className="flex items-center md:hidden">
            <button
              onClick={toggleMobileMenu}
              type="button"
              className="text-gray-500 hover:text-gray-900 hover:bg-gray-100 p-2 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-600"
              aria-expanded={isMobileMenuOpen}
            >
              <span className="sr-only">Open main menu</span>
              {!isMobileMenuOpen ? (
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              ) : (
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {isMobileMenuOpen && (
        <div className="md:hidden absolute w-full bg-white/95 backdrop-blur-xl shadow-xl border-b border-gray-100 rounded-b-2xl transition-all">
          <div className="px-4 pt-4 pb-6 space-y-2">
            <NavLink to="/" onClick={toggleMobileMenu} className={mobileNavStyle}>Home</NavLink>
            <NavLink to="/find-jobs" onClick={toggleMobileMenu} className={mobileNavStyle}>Find Jobs</NavLink>
            <NavLink to="/profile" onClick={toggleMobileMenu} className={mobileNavStyle}>Profile</NavLink>
            
            <hr className="border-gray-100 my-4" />
            
            <div className="flex flex-col gap-3 pt-2">
              {!isLoggedIn ? (
                <div className="grid grid-cols-2 gap-3">
                  <Link to="/login" onClick={toggleMobileMenu} className="flex items-center justify-center w-full bg-blue-50 hover:bg-blue-100 text-blue-700 px-4 py-3 rounded-xl text-base font-bold transition-all">
                    Login
                  </Link>
                  <Link to="/register" onClick={toggleMobileMenu} className="flex items-center justify-center w-full bg-blue-50 hover:bg-blue-100 text-blue-700 px-4 py-3 rounded-xl text-base font-bold transition-all">
                    Register
                  </Link>
                </div>
              ) : (
                <button onClick={() => { logoutUser(); toggleMobileMenu(); }} className="flex items-center justify-center w-full bg-red-50 hover:bg-red-100 text-red-700 px-4 py-3 rounded-xl text-base font-bold transition-all">
                  Logout
                </button>
              )}

              <Link to="/post-job" onClick={toggleMobileMenu} className="flex items-center justify-center w-full bg-blue-600 hover:bg-blue-700 text-white px-4 py-3 rounded-xl text-base font-bold transition-all shadow-md">
                Post Job
              </Link>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}

export default Navbar;