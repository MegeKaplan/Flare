import React, { useEffect, useState } from "react";
import axios from "axios";
import { MESSAGES } from "../constants/messages";
import { toast } from "react-toastify";
import Post from "../components/Post";
import Button from "../components/ui/Button";

const Feed = ({ page }) => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [offset, setOffset] = useState(
    page != "home" ? localStorage.getItem("offset") || 0 : 0
  );
  const [limit] = useState(4);
  const [postsEmpty, setPostsEmpty] = useState(false);

  const fetchPosts = async (newOffset) => {
    try {
      setLoadingMore(true);
      const response = await axios.get(
        `${
          import.meta.env.VITE_API_URL
        }/posts?offset=${newOffset}&limit=${limit}&is_story=0`
      );

      let fetchedPosts = response.data.response;

      if (page == "home") {
        try {
          fetchedPosts = response.data.response.filter((post) =>
            JSON.parse(localStorage.getItem("userData"))
              .followings.split(",")
              .map((id) => parseInt(id))
              .includes(post.sender_id)
          );
        } catch (error) {
          setPostsEmpty(true);
          fetchedPosts = [];
        }
      }

      if (fetchedPosts.length > 0) {
        setPosts((prevPosts) => {
          const newPosts = fetchedPosts.filter(
            (newPost) => !prevPosts.some((post) => post.id === newPost.id)
          );
          return [...prevPosts, ...newPosts];
        });
        setOffset(newOffset + 1);
        localStorage.setItem("offset", newOffset + 1);
      }
      setLoading(false);
      setLoadingMore(false);
    } catch (error) {
      toast.error(MESSAGES.ERROR_OCCURRED);
      setLoadingMore(false);
    }
  };

  useEffect(() => {
    fetchPosts(offset);
  }, []);

  const handleScroll = () => {
    if (
      window.innerHeight + window.scrollY >=
        document.documentElement.scrollHeight - 10 &&
      !loadingMore
    ) {
      const newOffset = offset + limit;
      fetchPosts(newOffset);
    }
  };

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [offset, loadingMore]);

  if (loading) return <h1>{MESSAGES.CONTENT_LOADING}</h1>;

  return (
    <div className="w-full flex items-center justify-center flex-col box-border pb-16 p-2">
      {posts
        .filter((post) => post.is_public == true)
        .map((post) => (
          <Post key={post.id} data={post} className="mb-8" />
        ))}
      {loadingMore && <h1>{MESSAGES.CONTENT_LOADING}</h1>}
      {page != "home" && (
        <Button
          text="Eski Gönderileri Yükle"
          color="primary"
          className="mb-6"
          onClick={() => {
            setPosts([]);
            fetchPosts(0);
          }}
        />
      )}
      {postsEmpty && <h1>Gönderileri görmek için birini takip etmeyi dene.</h1>}
    </div>
  );
};

export default Feed;
