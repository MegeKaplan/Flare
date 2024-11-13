import React, { useState } from "react";
import { FaHeart } from "react-icons/fa6";
import { FaComment } from "react-icons/fa6";
import { FaShare } from "react-icons/fa6";
import { FaBookmark } from "react-icons/fa6";
import { FaEllipsis } from "react-icons/fa6";
import defaultProfilePicture from "../assets/images/default-profile-picture.webp";

const Post = ({ data }) => {
  const [postData, setPostData] = useState({
    ...data,
    sender: JSON.parse(data.sender),
  });
  const [date, setDate] = useState(new Date(postData.created_at));
  const [showFullDate, setShowFullDate] = useState(false);

  // setTimeout(() => {
  //   setDate(new Date(postData.created_at));
  // }, 5000);

  const dateOptions = {
    day: "numeric",
    month: "long",
    year: "numeric",
    weekday: "long",
    hour: "2-digit",
    hour12: false,
    minute: "2-digit",
    // second: "2-digit",
    // timeZone: "Europe/Istanbul",
    // timeZoneName: "short",
  };

  const formattedDate = date.toLocaleDateString("tr-TR", dateOptions);

  const timeAgo = (date) => {
    const now = new Date();
    const seconds = Math.floor((now - date) / 1000);

    const intervals = [
      { label: "yıl", seconds: 31536000 },
      { label: "ay", seconds: 2592000 },
      { label: "gün", seconds: 86400 },
      { label: "saat", seconds: 3600 },
      { label: "dakika", seconds: 60 },
      { label: "saniye", seconds: 1 },
    ];

    for (const interval of intervals) {
      const count = Math.floor(seconds / interval.seconds);
      if (count > 1) {
        return `${count} ${interval.label} önce`;
      } else if (count === 1) {
        return `1 ${interval.label} önce`;
      }
    }
    return "şimdi";
  };

  return (
    <div className="bg-secondary-100 w-full m-4 sm:w-96 rounded-md h-auto p-2">
      <div className="h-16 flex items-center">
        <img
          src={postData.sender.pp_url || defaultProfilePicture}
          alt={`profile picture of ${postData.sender.username}`}
          className="size-14 rounded-full select-none"
        />
        <div className="flex justify-center flex-col ml-2 truncate w-full">
          <h1 className="text-xl text-secondary-900 truncate">
            {postData.sender.username}
          </h1>
          {showFullDate ? (
            <span
              className="text-sm text-secondary-500 truncate"
              onClick={() => setShowFullDate(false)}
            >
              {formattedDate}
            </span>
          ) : (
            <span
              className="text-sm text-secondary-500 truncate"
              onClick={() => setShowFullDate(true)}
            >
              {timeAgo(date)}
            </span>
          )}
        </div>
        <div className="aspect-square h-3/5 flex items-center justify-center cursor-pointer">
          <FaEllipsis size={21} className="text-secondary-700" />
        </div>
      </div>
      <div className="aspect-square flex items-center justify-center rounded-xl overflow-hidden my-2 bg-secondary-150">
        <img
          src={postData.images.split(",")[0]}
          alt="image of the post"
          className="select-none object-cover size-full hover:object-fill hover:scale-95 transition duration-300 rounded-xl"
        />
      </div>
      <div className="h-14 flex items-center justify-between">
        <div className="h-full flex items-center justify-center flex-row">
          <div className="flex items-center justify-center flex-row h-full p-2 text-secondary-700">
            <FaHeart
              size={25}
              className="ml-2 cursor-pointer"
              color={
                postData.likes
                  ? postData.likes
                      .split(",")
                      .includes(localStorage.getItem("userId")) && "red"
                  : undefined
              }
            />
            <span className="ml-2 text-xl font-bold select-none">
              {postData.likes ? postData.likes.split(",").length : 0}
            </span>
          </div>
          <div className="flex items-center justify-center flex-row h-full p-2 text-secondary-700">
            <FaComment
              size={25}
              className="ml-2 cursor-pointer"
              color={
                postData.comments
                  ? postData.comments
                      .split(",")
                      .includes(localStorage.getItem("userId")) && "green"
                  : undefined
              }
            />
            <span className="ml-2 text-xl font-bold select-none">
              {postData.comments ? postData.comments.split(",").length : 0}
            </span>
          </div>
          <div className="flex items-center justify-center flex-row h-full p-2 text-secondary-700">
            <FaBookmark
              size={25}
              className="ml-2 cursor-pointer"
              color={
                postData.saves
                  ? postData.saves
                      .split(",")
                      .includes(localStorage.getItem("userId")) && "orange"
                  : undefined
              }
            />
            <span className="ml-2 text-xl font-bold select-none">
              {postData.saves ? postData.saves.split(",").length : 0}
            </span>
          </div>
        </div>
        <div className="h-full flex items-center justify-center flex-row">
          <div className="flex items-center justify-center flex-row h-full p-2 text-secondary-700">
            <FaShare size={25} className="ml-2 cursor-pointer" />
            {/* <span className="ml-2 text-xl font-bold select-none">
              {postData.shares ? postData.shares.split(",").length : 0}
            </span> */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Post;
