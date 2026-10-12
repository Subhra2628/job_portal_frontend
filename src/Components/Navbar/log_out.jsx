import api from "../../../API/api";

const handleLogout = async () => {
   const confirmed = window.confirm("Are you sure you want to log out?");
    // 2. If user clicks Cancel
  if (!confirmed) {
    return false;
  }
  try {
    // 1. Tell the backend to log out
    await api.post("/auth/loggedout");

    // 2. Remove token from storage
    localStorage.removeItem("accessToken");
    
    // 3. Dispatch event to instantly update the Navbar UI
    window.dispatchEvent(new Event("auth-change"));
    
    return true;
  } catch (error) {
    console.log(error);
    
    // Fallback: Even if the server request fails, log the user out locally
    localStorage.removeItem("accessToken");
    window.dispatchEvent(new Event("auth-change"));
    
    return true;
  }
};

export default handleLogout;