import React from "react";
import { Link } from "react-router-dom";
import { GoHomeFill } from "react-icons/go";
import { FaSearch } from "react-icons/fa";
import { MdAddCircleOutline } from "react-icons/md";
import { FaCircleUser, FaCompass } from "react-icons/fa6";

const Nav = () => {
  return (
    <nav className="w-full flex items-center justify-evenly h-14 fixed bottom-0 left-0 shadow bg-white">
      <Link
        to={"/"}
        className="h-full aspect-square flex items-center justify-center"
      >
        <GoHomeFill size={25} />
      </Link>
      <Link
        to={"/search"}
        className="h-full aspect-square flex items-center justify-center"
      >
        <FaSearch size={20} />
      </Link>
      <Link
        to={"/new-post"}
        className="h-full aspect-square flex items-center justify-center"
      >
        <MdAddCircleOutline size={27} />
      </Link>
      <Link
        to={"/discover"}
        className="h-full aspect-square flex items-center justify-center"
      >
        <FaCompass size={20} />
      </Link>
      <Link
        to={"/profile"}
        className="h-full aspect-square flex items-center justify-center"
      >
        <FaCircleUser size={20} />
      </Link>
    </nav>
  );
};

export default Nav;
