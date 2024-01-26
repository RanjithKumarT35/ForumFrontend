import React, { useContext } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Navbar from "./Components/Layout/navbar";
import Register from "./Components/auth/Register";
import Login from "./Components/auth/Login";
import Home from "./Components/home";
import ThreadCreation from "./Components/createThread";
import AuthContext from "./context/authcontext";
import DetailedThread from "./Components/DetailedThread";
import EditThread from "./Components/editThread";
import ForgotPassword from "./Components/auth/forgotPassword";
import UpdateProfile from "./Components/auth/profileUpdate";
import NotificationsPage from "./Components/notifications";
import HeadingListPage from "./Components/forum";
function Router() {
  const { loggedIn } = useContext(AuthContext);
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route exact path="/" element={<Home />} />
        <Route path="/home/:heading" element={<Home />} />
        {loggedIn === false && (
          <>
            <Route path="/register" element={<Register />} />
            <Route path="/login" element={<Login />} />
          </>
        )}
        {loggedIn === true && (
          <>
            <Route path="/CreateThread" element={<ThreadCreation />} />
            <Route path="/edit-thread/:threadId" element={<EditThread />} />
            <Route path="/updateProfile" element={<UpdateProfile />} />
            <Route path="/user/notifications" element={<NotificationsPage />} />
          </>
        )}
        <Route path="/threads/:threadId" element={<DetailedThread />} />
        <Route path="/forgotPassword" element={<ForgotPassword />} />
        <Route path="/forum-list" element={<HeadingListPage />} />
      </Routes>
    </BrowserRouter>
  );
}
export default Router;
