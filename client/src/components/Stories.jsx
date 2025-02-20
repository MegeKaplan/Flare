import axios from "axios";
import React, { useEffect, useRef, useState } from "react";
import { toast } from "react-toastify";
import { MESSAGES } from "../constants/messages";
import { Link } from "react-router-dom";

const Stories = () => {
  const [stories, setStories] = useState([]);
  const scrollRef = useRef();

  const handleScroll = (e) => {
    if (scrollRef.current) {
      scrollRef.current.scrollLeft -= (e.deltaY * 40) / 10;
    }
  };

  try {
    useEffect(() => {
      const fetchStories = async () => {
        const response = await axios.get(
          `${import.meta.env.VITE_API_URL}/posts?is_story=1`
        );

        const userFollowing = localStorage.getItem("userData")
          ? JSON.parse(localStorage.getItem("userData")).followings +
            "," +
            JSON.parse(localStorage.getItem("userData")).id
          : "";

        var fetchedStories = response.data.response
          .filter((story) => {
            const storyDate = new Date(story.created_at);
            const now = new Date();
            const timeDifference = now - storyDate;
            return timeDifference <= 24 * 60 * 60 * 1000;
          })
          .filter((story) =>
            userFollowing
              .split(",")
              .map((id) => parseInt(id))
              .includes(story.sender_id)
          );

        setStories(fetchedStories);
      };
      fetchStories();
    }, []);
  } catch (error) {
    // toast.error(MESSAGES.ERROR_OCCURRED);
  }

  return (
    <div
      className="w-full select-none bg-secondary-50 shadow-inner h-auto py-2 flex items-center justify-start overflow-x-scroll scroll-smooth scrollbar-hide"
      onWheel={handleScroll}
      ref={scrollRef}
      style={{
        scrollbarWidth: "none",
        msOverflowStyle: "none",
      }}
    >
      <div className="flex items-center justify-center">
        <Link
          to={"/new-post"}
          className="flex items-center justify-center border-primary-400 border-[3px] rounded-2xl p-[2px] mx-1 size-16 cursor-pointer"
        >
          <span className="rounded-xl flex items-center justify-center text-4xl size-full text-primary-400 hover:bg-primary-400 hover:text-white transition">
            +
          </span>
        </Link>
        {stories.map((story) => (
          <Link
            to={`/post/${story.id}`}
            key={story.id}
            className="flex items-center justify-center border-primary-400 border-[3px] rounded-2xl p-[2px] mx-1 size-16 whitespace-nowrap"
          >
            {["jpg", "jpeg", "png", "gif", "webp"].includes(
              story.images.split(",")[0].match(/\.([a-zA-Z0-9]+)(?=\?|$)/)[1]
            ) ? (
              <img
                key={story.id}
                src={story.images ? story.images.split(",")[0] : ""}
                alt={story.content ? story.content : "story"}
                className="size-14 rounded-xl"
              />
            ) : (
              <video
                key={story.id}
                muted
                autoPlay={false}
                className="size-14 rounded-xl"
              >
                <source
                  src={story.images.split(",")[0]}
                  alt={story.content ? story.content : "story"}
                />
              </video>
            )}
          </Link>
        ))}
      </div>
    </div>
  );
};

export default Stories;
