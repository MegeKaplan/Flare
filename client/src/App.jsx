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
        <Route path="/discover" element={<Discover />} />
        <Route path="/profile" element={<Profile />} />
      </Routes>
      <Nav />
    </>
  );
}

export default App;
