import React from "react";
import defaultProfilePicture from "../assets/images/default-profile-picture.webp";
import { Link } from "react-router-dom";
import { FaStar } from "react-icons/fa6";

const UserItem = ({ data, className, viewType }) => {
  viewType = viewType || "list";
  switch (viewType) {
    case "list":
      return (
        <Link
          to={`/profile/${data.id}`}
          key={data.id}
          className={`w-full bg-secondary-50 hover:bg-primary-50 transition rounded-sm p-2 h-20 flex items-center shadow-sm hover:shadow-md ${className}`}
        >
          <div className="aspect-square h-full flex items-center justify-center">
            <img
              src={data.pp_url || defaultProfilePicture}
              alt={`pp of ${data.username}`}
              className="h-full aspect-square rounded-full border-2 border-primary-500 shadow-sm"
            />
          </div>
          <div className="px-2 truncate">
            <h1 className="text-xl truncate flex items-center">
              {data.username}
              {data.is_verified ? (
                <FaStar
                  size={16}
                  className="text-yellow-400 text-xs ml-1 mb-[1px]"
                  title="Doğrulanmış Hesap"
                />
              ) : (
                ""
              )}
            </h1>
            <p className="text-sm truncate">{data.bio}</p>
          </div>
        </Link>
      );
    case "card":
      return (
        <Link
          to={`/profile/${data.id}`}
          key={data.id}
          className={`size-auto bg-secondary-50 hover:bg-primary-50 transition rounded-md p-1 flex items-center justify-center flex-col truncate pb-2 shadow-sm hover:shadow-md ${className}`}
        >
          <div className="h-full flex items-center justify-center">
            <img
              src={data.pp_url || defaultProfilePicture}
              alt={`pp of ${data.username}`}
              className="h-24 aspect-square rounded-full border-2 border-primary-500 shadow-md"
            />
          </div>
          <div className="w-full px-1 h-20 text-center">
            <h1 className="text-lg truncate flex flex-row items-center justify-center">
              {data.username}
              {data.is_verified ? (
                <FaStar
                  size={16}
                  className="text-yellow-400 text-xs ml-1 mb-[2px]"
                  title="Doğrulanmış Hesap"
                />
              ) : (
                ""
              )}
            </h1>
            <p className="text-sm truncate">{data.bio}</p>
          </div>
        </Link>
      );
  }
};

export default UserItem;
