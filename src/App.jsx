import { Routes, Route } from "react-router-dom";

import Home from "./Components/Navbar/home";  
import FindJob from "./Components/Navbar/find_jobs";
import MyProfile from "./Components/Navbar/my_profile";
import Login from "./Components/Navbar/login";
import PostJob from "./Components/Navbar/post_jobs";
import Navbar from "./Components/Navbar/navbar";
import Register from "./Components/Navbar/register";
import VerifyEmail from "./Components/Verify_email/verify_email";
import handleLogout from "./Components/Navbar/log_out";
import ProtectedRoute from "./Protected_Route/protected_route";
import CreateProfile from "./Pages/create_profile";
import EditProfile from "./Pages/Edit_seeker_Profile/edit_profile";
import CreateResume from "./Pages/Resume/resume_bbuilder";
import RecruiterProfile from "./Components/Profiles/create_recruiter_profile";
import RecruiterRoute from "./Components/Route/recruiter_route";
import EditRecruiterProfile from "./Pages/Recruiter/edit_recuirter_profile";
import EditJobs from "./Pages/Recruiter/edit_job_by_recuirter";
function App() {
  return (
    <>
    <Navbar />
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/find-jobs" element={<FindJob />} />
     <Route
  path="/profile"
  element={
    <ProtectedRoute>
      <MyProfile />
    </ProtectedRoute>
  }
/>
    <Route
  path="/create-profile"
  element={
    <ProtectedRoute>
      <CreateProfile/>
    </ProtectedRoute>
  }
/>
   <Route path="/create-resume" element= {<ProtectedRoute><CreateResume/></ProtectedRoute>
   }/>

{/* <Route element={<RecruiterRoute />}>
  <Route path="/post-job" element={<PostJob />} />
</Route> */}

      <Route path="/post-job" element={<ProtectedRoute allowedRole="RECRUITER"> <PostJob /> </ProtectedRoute>} />

 <Route path="/create-recruiter-profile" element ={<ProtectedRoute> <RecruiterProfile/></ProtectedRoute>}/>


//edit recuirter profile
 <Route path="/edit-recuirter-profile" element ={<ProtectedRoute> <EditRecruiterProfile/></ProtectedRoute>}/>

//edit jobs by recuirter
 <Route path="/profile/edit-job/:id" element ={<ProtectedRoute> <EditJobs/></ProtectedRoute>}/>

  
      <Route path="/login" element={<Login />} />
   <Route path="/register" element={<Register/>}/>
   <Route path="/verify-email" element={<VerifyEmail/>}/>
   <Route path="/logout" element={<handleLogout/>}/>
   <Route path="/update-profile" element={<EditProfile/>}/>
    </Routes>
    </>
  );
}

export default App;