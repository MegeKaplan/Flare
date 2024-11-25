import React from "react";
import { Link } from "react-router-dom";
import { FaHeart } from "react-icons/fa6";

const Settings = () => {
  return (
    <>
      <div className="flex items-center justify-center flex-col p-2 w-full">
        <h1 className="text-3xl text-center py-5 bg-secondary-200 rounded-t-3xl w-full">
          Ayarlar
        </h1>
        <Link
          to={"/auth?page=register"}
          className="text-2xl p-3 bg-secondary-100 mt-2 w-full"
        >
          Kaydol
        </Link>
        <Link
          to={"/auth?page=login"}
          className="text-2xl p-3 bg-secondary-100 mt-2 w-full"
        >
          Giriş Yap
        </Link>
        <Link
          to={"https://github.com/MegeKaplan/Flare"}
          className="text-2xl p-3 bg-secondary-100 mt-2 w-full"
        >
          Bu Projeye Katkıda Bulun
        </Link>
      </div>
      <span className="flex items-center justify-center flex-row p-2 bg-white fixed bottom-16 w-full select-none">
        Made with
        <span className="mx-1">{<FaHeart color="red" />}</span>
        by
        <a
          className="mx-1 hover:underline"
          href="https://github.com/MegeKaplan"
        >
          MegeKaplan
        </a>
      </span>
    </>
  );
};

export default Settings;
