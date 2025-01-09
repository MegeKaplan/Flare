import axios from "axios";
import React, { useEffect, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { MESSAGES } from "../constants/messages";

const UserInteractions = () => {
  const [searchParams] = useSearchParams();
  const [page, setPage] = useState(
    ["likes", "saves", "comments"].includes(searchParams.get("page"))
      ? searchParams.get("page")
      : undefined
  );
  const [interactions, setInteractions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLikes = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_API_URL}/user/${localStorage.getItem(
            "userId"
          )}/interactions?action=${page && page.slice(0, -1)}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        setInteractions(response.data.response);
        setLoading(false);
      } catch (error) {
        console.error(error);
      }
    };
    fetchLikes();
  }, [page]);

  if (loading) return <h1>{MESSAGES.CONTENT_LOADING}</h1>;

  return (
    <div className="w-full p-4 mb-10">
      {interactions.length > 0 ? (
        interactions
          .filter((interaction) => interaction.is_story == false)
          .map((interaction) => (
            <Link
              key={interaction.id}
              to={`/post/${interaction.id}`}
              className={`w-full flex p-4 shadow-sm mb-2 rounded-md ${
                interaction.content
                  ? "text-secondary-800"
                  : "text-secondary-400"
              } ${
                page == "likes"
                  ? "bg-rose-50"
                  : page == "saves"
                  ? "bg-amber-50"
                  : "bg-green-50"
              }`}
            >
              {page != "comments"
                ? interaction.content
                  ? interaction.content
                  : "( Gönderi yazısı bulunamadı... )"
                : interaction.user_comment}
            </Link>
          ))
      ) : (
        <h1 className="text-center">Kullanıcı etkileşimi bulunamadı!</h1>
      )}
    </div>
  );
};

export default UserInteractions;
