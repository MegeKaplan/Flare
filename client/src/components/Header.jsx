import React from "react";
import { IoMdSettings } from "react-icons/io";
import { Link } from "react-router-dom";

const Header = () => {
  return (
    <header className="w-full h-14 flex items-center justify-between px-4 shadow-sm">
      <Link to={"/"} className="font-black text-3xl text-primary-500">
        Flare
      </Link>
      <Link to={"/settings"}>
        <IoMdSettings size={25} />
      </Link>
    </header>
  );
};

export default Header;
