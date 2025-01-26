import React, { useEffect, useRef, useState } from "react";
import { FaHeart } from "react-icons/fa6";
import { FaComment } from "react-icons/fa6";
import { FaShare } from "react-icons/fa6";
import { FaBookmark } from "react-icons/fa6";
import { FaEllipsis } from "react-icons/fa6";
import { FaPaperPlane } from "react-icons/fa6";
import defaultProfilePicture from "../assets/images/default-profile-picture.webp";
import { toast } from "react-toastify";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { MESSAGES } from "../constants/messages";
import { Link } from "react-router-dom";
import CommentItem from "./CommentItem";
import Button from "./ui/Button";

const Post = ({ data, className }) => {
  if (data === undefined) {
    // toast.error(MESSAGES.POST_NOT_FOUND);
    return <h1>{MESSAGES.POST_NOT_FOUND}</h1>;
  }
  const [postData, setPostData] = useState({
    ...data,
    sender: JSON.parse(data.sender),
  });
  const [date, setDate] = useState(new Date(postData.created_at));
  const [showFullDate, setShowFullDate] = useState(false);
  const [refreshPostData, setRefreshPostData] = useState(false);
  const navigate = useNavigate();
  const [postMenuOpen, setPostMenuOpen] = useState(false);
  const [isCommentsDrawerOpen, setIsCommentsDrawerOpen] = useState(false);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [isVideoVisible, setIsVideoVisible] = useState(false);
  const videoRef = useRef(null);

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

  const handleAction = async (action) => {
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/post/${postData.id}?action=${action}`,
        { userId: localStorage.getItem("userId") },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      setRefreshPostData(true);
    } catch (error) {
      toast.error(error.response.data.message);
    }
  };

  const handleShare = async () => {
    const textToCopy = `${window.location.origin}/post/${postData.id}`;
    try {
      navigator.clipboard
        .writeText(textToCopy)
        .then(() => {
          toast.info(MESSAGES.LINK_COPIED_TO_CLIPBOARD);
        })
        .catch((err) => {
          toast.error(MESSAGES.ERROR_OCCURRED);
        });
    } catch (error) {
      toast.error(MESSAGES.ERROR_OCCURRED);
    }
  };

  const handleCommentChange = (e) => {
    setNewComment(e.target.value);
  };

  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    setRefreshPostData(true);
    if (!newComment.trim()) {
      toast.warning(MESSAGES.POST_CONTENT_REQUIRED);
      return false;
    }
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/post/${
          postData.id
        }?action=comment&operation=add`,
        { userId: localStorage.getItem("userId"), comment: newComment },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      setNewComment("");
      toast.success(response.data.response.message);
    } catch (error) {
      // toast.error(error.response.data.message);
    } finally {
      setRefreshPostData(false);
    }
  };

  useEffect(() => {
    if (refreshPostData) {
      const fetchPost = async () => {
        try {
          const response = await axios.get(
            `${import.meta.env.VITE_API_URL}/post/${postData.id}`
          );
          setPostData({
            ...response.data.response,
            sender: JSON.parse(response.data.response.sender),
          });
          setDate(new Date(response.data.response.created_at));
        } catch (error) {
          toast.error();
        } finally {
          setRefreshPostData(false);
        }
      };
      fetchPost();
    }
  }, [refreshPostData, postData.id]);

  const getComments = async () => {
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/post/${
          postData.id
        }?action=comment&operation=get`,
        { userId: localStorage.getItem("userId") },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      setComments(response.data.response);
    } catch (error) {
      toast.error(error.response.data.message);
    }
  };

  useEffect(() => {
    if (isCommentsDrawerOpen) {
      getComments();
    }
  }, [isCommentsDrawerOpen, refreshPostData]);

  useEffect(() => {
    if (!videoRef.current) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVideoVisible(true);
          videoRef.current.play();
        } else {
          setIsVideoVisible(false);
          videoRef.current.pause();
        }
      },
      {
        root: null,
        threshold: 0.9,
      }
    );

    observer.observe(videoRef.current);

    return () => {
      if (videoRef.current) {
        observer.unobserve(videoRef.current);
      }
    };
  }, [videoRef]);

  return (
    <>
      <div
        className={`shadow-md w-full sm:w-96 rounded-md h-auto p-2 relative ${className}`}
        onDoubleClick={() => handleAction("like")}
      >
        <div className="h-16 flex items-center">
          <Link
            to={`/profile/${postData.sender_id}`}
            className="h-full aspect-square flex items-center justify-center"
          >
            <img
              src={postData.sender.pp_url || defaultProfilePicture}
              alt={`profile picture of ${postData.sender.username}`}
              className="size-14 rounded-full select-none bg-secondary-100 shadow-sm"
            />
          </Link>
          <div className="flex justify-center flex-col ml-2 truncate w-full">
            <Link
              to={`/profile/${postData.sender_id}`}
              className="text-xl text-secondary-900 truncate"
            >
              {postData.sender.username}
            </Link>
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
            <FaEllipsis
              size={21}
              className="text-secondary-700"
              onClick={() => setPostMenuOpen((prev) => !prev)}
            />
          </div>
        </div>
        {postMenuOpen && (
          <div className="absolute top-2 right-14 w-auto h-auto bg-secondary-50 rounded-md shadow-md flex items-center justify-center flex-col py-2">
            <button
              className="w-full px-4 py-2 flex items-center justify-center"
              onClick={() => {
                navigate(`/post/${postData.id}`);
                setPostMenuOpen(false);
              }}
            >
              Gönderiyi Görüntüle
            </button>
            {postData.sender_id === Number(localStorage.getItem("userId")) && (
              <button
                className="w-full px-4 py-2 flex items-center justify-center"
                onClick={() => {
                  navigate(`/edit-post/${postData.id}`);
                  setPostMenuOpen(false);
                }}
              >
                Gönderiyi Düzenle
              </button>
            )}
          </div>
        )}
        <p className="indent-2 py-2 text-[16px] leading-tight">
          {postData.content}
        </p>
        <div className="aspect-square flex items-center justify-center rounded-xl overflow-hidden my-2 bg-secondary-100 shadow-sm">
          {postData.images &&
          ["jpg", "jpeg", "png", "gif", "webp"].includes(
            postData.images.split(",")[0].match(/\.([a-zA-Z0-9]+)(?=\?|$)/)[1]
          ) ? (
            <img
              src={`${
                import.meta.env.VITE_CLOUDINARY_BASE_URL
              }/image/upload/flare/posts/${String(postData.id).padStart(
                6,
                "0"
              )}${Number(postData.id) > 300 ? "-01" : ""}.webp`}
              // src={`${
              //   import.meta.env.VITE_CLOUDINARY_BASE_URL
              // }/image/upload/flare/posts/${postData.filenames.split(",")[0]}`}
              alt="Resim Yükleniyor..."
              className="select-none object-cover size-full hover:object-fill hover:scale-95 transition duration-300 rounded-xl"
            />
          ) : (
            <video
              ref={videoRef}
              loop
              autoPlay={isVideoVisible}
              className="select-none object-cover size-full hover:object-fill hover:scale-95 transition duration-300 rounded-xl"
            >
              <source
                // src={postData.images && postData.images.split(",")[0]}
                src={`${
                  import.meta.env.VITE_CLOUDINARY_BASE_URL
                }/video/upload/flare/posts/${String(postData.id).padStart(
                  6,
                  "0"
                )}${Number(postData.id) > 300 ? "-01" : ""}.mp4`}
                // src={`${
                //   import.meta.env.VITE_CLOUDINARY_BASE_URL
                // }/image/upload/flare/posts/${postData.filenames.split(",")[0]}`}
                alt="Video Yükleniyor..."
              />
              Your browser does not support the video tag.
            </video>
          )}
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
                onClick={() => handleAction("like")}
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
                  comments
                    .map((comment) => comment.user_id)
                    .includes(Number(localStorage.getItem("userId")))
                    ? comments
                        .map((comment) => comment.user_id)
                        .includes(Number(localStorage.getItem("userId"))) &&
                      "green"
                    : undefined
                }
                onClick={() => setIsCommentsDrawerOpen(true)}
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
                onClick={() => handleAction("save")}
              />
              <span className="ml-2 text-xl font-bold select-none">
                {postData.saves ? postData.saves.split(",").length : 0}
              </span>
            </div>
          </div>
          <div className="h-full flex items-center justify-center flex-row">
            <div className="flex items-center justify-center flex-row h-full p-2 text-secondary-700">
              <FaShare
                size={25}
                className="ml-2 cursor-pointer"
                onClick={handleShare}
              />
              {/* <span className="ml-2 text-xl font-bold select-none">
              {postData.shares ? postData.shares.split(",").length : 0}
            </span> */}
            </div>
          </div>
        </div>
      </div>
      {isCommentsDrawerOpen && (
        <div className="w-full h-4/5 fixed bg-secondary-100 left-0 bottom-0 rounded-t-2xl z-30 overflow-y-scroll pb-20">
          <div className="w-full h-14 flex items-center justify-center sticky top-0 bg-secondary-100">
            <span
              className="bg-secondary-150 p-2 rounded-full cursor-pointer"
              onClick={() => setIsCommentsDrawerOpen(false)}
            >
              Yorumları Kapat
            </span>
          </div>
          <div className="w-full min-h-full h-auto flex items-center justify-start flex-col px-2">
            {comments.length > 0 ? (
              comments.map((comment) => (
                <CommentItem key={comment.id} data={comment} />
              ))
            ) : (
              <h1>Bu gönderiye hiç yorum yapılmamış...</h1>
            )}
          </div>
          <div className="fixed bottom-0 left-0 w-full h-20 p-2 bg-secondary-50">
            <form
              className="flex items-center justify-center flex-row h-full w-full"
              onSubmit={handleCommentSubmit}
            >
              <textarea
                name="content"
                value={newComment}
                onChange={handleCommentChange}
                className="w-full mt-1 p-2 border rounded-md min-h-full outline-none focus:ring-2 focus:ring-primary-400 mb-1 bg-secondary-50 text-sm resize-none rounded-tr-none rounded-br-none"
                rows={1}
              />
              <Button
                text={
                  <FaPaperPlane
                    size={50}
                    className="p-3 bg-secondary-50 text-primary-400 rounded-md"
                  />
                }
                color="primary"
                className="max-w-20 h-full rounded-tl-none rounded-bl-none flex items-center justify-center"
              />
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default Post;
