import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { MESSAGES } from "../constants/messages";
import { useParams } from "react-router-dom";
import axios from "axios";
import Post from "../components/Post";

const ViewPost = () => {
  const [postData, setPostData] = useState();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const id = useParams().id || id;

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_API_URL}/post/${id}`
        );
        setPostData(response.data.response);
        setLoading(false);
      } catch (error) {
        toast.error(MESSAGES.ERROR_OCCURRED);
        setError(true);
      }
    };
    fetchPost();
  }, [id]);

  if (loading) return <h1>{MESSAGES.CONTENT_LOADING}</h1>;

  if (error) return <h1>{MESSAGES.ERROR_OCCURRED}</h1>;

  return (
    <div className="w-full flex justify-center pb-16 p-2">
      <Post data={postData} />
    </div>
  );
};

export default ViewPost;
