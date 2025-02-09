import { Route, Routes } from "react-router-dom";
import Header from "./components/Header";
import Nav from "./components/Nav";
import Home from "./pages/Home";
import Auth from "./pages/Auth";
import Settings from "./pages/Settings";
import Search from "./pages/Search";
import NewPost from "./pages/NewPost";
import Discover from "./pages/Discover";
import Profile from "./pages/Profile";
import EditPost from "./pages/EditPost";
import { toast, ToastContainer } from "react-toastify";
import { toastifyContainerConfig } from "./config/toastifyConfig";
import "react-toastify/dist/ReactToastify.css";
import ViewPost from "./pages/ViewPost";
import { useEffect, useState } from "react";
import axios from "axios";
import EditProfile from "./pages/EditProfile";
import NotFound from "./pages/NotFound";
import UserInteractions from "./pages/UserInteractions";
import Messages from "./pages/Messages";
import Forbidden from "./pages/Forbidden";

function App() {
  const [userData, setUserData] = useState(
    localStorage.getItem("userData") || null
  );

  useEffect(() => {
    const fetchUser = async (userId) => {
      try {
        userId &&
          localStorage.setItem(
            "userData",
            JSON.stringify(
              (
                await axios.get(
                  `${import.meta.env.VITE_API_URL}/user/${userId}`
                )
              ).data.response
            )
          );
      } catch (error) {
        console.error(error);
      }
    };
    fetchUser(localStorage.getItem("userId"));
  }, [localStorage.getItem("userId")]);

  return (
    <>
      <Header />
      <Routes>
        <Route path="*" element={<NotFound />} />
        <Route path="/" element={<Home />} />
        <Route path="/auth" element={<Auth />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="/search" element={<Search />} />
        <Route path="/new-post" element={<NewPost />} />
        <Route path="/edit-post/:id" element={<EditPost />} />
        <Route path="/discover" element={<Discover />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/profile/interactions" element={<UserInteractions />} />
        <Route path="/profile/:id" element={<Profile />} />
        <Route path="/profile/:id/messages" element={<Messages />} />
        <Route path="/edit-profile" element={<EditProfile />} />
        <Route path="/edit-profile/:id" element={<EditProfile />} />
        <Route path="/post/:id" element={<ViewPost />} />
        <Route path="/forbidden" element={<Forbidden />} />
      </Routes>
      <Nav />
      <ToastContainer {...toastifyContainerConfig} />
    </>
  );
}

export default App;
