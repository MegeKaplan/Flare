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
import { ToastContainer } from "react-toastify";
import { toastifyContainerConfig } from "./config/toastifyConfig";
import "react-toastify/dist/ReactToastify.css";
import ViewPost from "./pages/ViewPost";

function App() {
  return (
    <>
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/auth" element={<Auth />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="/search" element={<Search />} />
        <Route path="/new-post" element={<NewPost />} />
        <Route path="/edit-post/:id" element={<EditPost />} />
        <Route path="/discover" element={<Discover />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/profile/:id" element={<Profile />} />
        <Route path="/post/:id" element={<ViewPost />} />
      </Routes>
      <Nav />
      <ToastContainer {...toastifyContainerConfig} />
    </>
  );
}

export default App;
