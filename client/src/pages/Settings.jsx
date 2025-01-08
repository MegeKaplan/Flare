import React from "react";
import { Link } from "react-router-dom";
import { FaHeart } from "react-icons/fa6";
import { toast } from "react-toastify";

const Settings = () => {
  return (
    <>
      <div className="flex items-center justify-center flex-col p-2 w-full">
        <h1
          className={`text-3xl text-center py-5 rounded-t-3xl w-full ${
            localStorage.getItem("userId") ? "bg-blue-200" : "bg-secondary-200"
          }`}
        >
          Ayarlar
        </h1>
        {!localStorage.getItem("userId") ? (
          <>
            <Link
              to={"/auth?page=register"}
              className="text-2xl p-3 bg-secondary-100 mt-2 w-full"
            >
              Kaydol
            </Link>
            <Link
              to={"/auth?page=login"}
              className="text-2xl p-3 bg-secondary-50 mt-2 w-full"
            >
              Giriş Yap
            </Link>
          </>
        ) : (
          <>
            <div className="w-full flex items-center justify-center flex-row gap-2">
              <Link
                to={"/profile/interactions?page=likes"}
                className="text-2xl p-3 bg-rose-100 mt-2 w-full text-center"
              >
                Beğeniler
              </Link>
              <Link
                to={"/profile/interactions?page=saves"}
                className="text-2xl p-3 bg-amber-100 mt-2 w-full text-center"
              >
                Kaydedilenler
              </Link>
            </div>
            <div className="w-full flex items-center justify-center flex-row gap-2">
              <Link
                to={"/profile/interactions?page=comments"}
                className="text-2xl p-3 bg-green-100 mt-2 w-full text-center"
              >
                Yorumlar
              </Link>
              <Link
                to={"/auth?page=login"}
                className="text-2xl p-3 bg-secondary-100 mt-2 w-full text-center"
                onClick={() => {
                  localStorage.clear();
                }}
              >
                Çıkış Yap
              </Link>
            </div>
          </>
        )}
        <Link
          to={"https://github.com/MegeKaplan/Flare"}
          className="text-2xl p-3 bg-indigo-100 mt-2 w-full text-center rounded-b-3xl"
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
