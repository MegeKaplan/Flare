import React, { useEffect, useState } from "react";
import { FaHeart } from "react-icons/fa6";
import { FaEllipsis } from "react-icons/fa6";
import defaultProfilePicture from "../assets/images/default-profile-picture.webp";
import { useNavigate } from "react-router-dom";
import { MESSAGES } from "../constants/messages";
import { Link } from "react-router-dom";
import axios from "axios";

const CommentItem = ({ data, className }) => {
  if (data === undefined) {
    return null;
  }
  const [commentData, setCommentData] = useState(data);
  const [date, setDate] = useState(new Date(commentData.created_at));
  const navigate = useNavigate();
  const [commentMenuOpen, setCommentMenuOpen] = useState(false);

  //   const dateOptions = {
  //     day: "numeric",
  //     month: "long",
  //     year: "numeric",
  //     weekday: "long",
  //     hour: "2-digit",
  //     hour12: false,
  //     minute: "2-digit",
  //   };

  //   const formattedDate = date.toLocaleDateString("tr-TR", dateOptions);

  //   const timeAgo = (date) => {
  //     const now = new Date();
  //     const seconds = Math.floor((now - date) / 1000);

  //     const intervals = [
  //       { label: "yıl", seconds: 31536000 },
  //       { label: "ay", seconds: 2592000 },
  //       { label: "gün", seconds: 86400 },
  //       { label: "saat", seconds: 3600 },
  //       { label: "dakika", seconds: 60 },
  //       { label: "saniye", seconds: 1 },
  //     ];

  //     for (const interval of intervals) {
  //       const count = Math.floor(seconds / interval.seconds);
  //       if (count > 1) {
  //         return `${count} ${interval.label} önce`;
  //       } else if (count === 1) {
  //         return `1 ${interval.label} önce`;
  //       }
  //     }
  //     return "şimdi";
  //   };

  return (
    <div
      className={`w-full flex items-start justify-center m-1 min-h-1 bg-secondary-50 p-2 rounded-lg shadow-sm ${className}`}
    >
      <div className="h-full aspect-square mr-2 p-1 max-h-20">
        <img
          src={commentData.pp_url || defaultProfilePicture}
          alt={`profile picture of ${commentData.username}`}
          className="rounded-full select-none bg-secondary-100 shadow-sm"
        />
      </div>
      <div className="w-full">
        <Link
          to={`/profile/${commentData.user_id}`}
          className="w-full font-semibold block truncate"
        >
          {commentData.username}
        </Link>
        <span className="w-full text-sm">{commentData.comment}</span>
      </div>
    </div>
  );
};

export default CommentItem;
