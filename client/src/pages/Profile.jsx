import React, { useEffect, useState } from "react";
import Button from "../components/ui/Button";
import { toast } from "react-toastify";
import { MESSAGES } from "../constants/messages";
import { useParams } from "react-router-dom";
import axios from "axios";
import defaultBanner from "../assets/images/default-banner.jpg";
import defaultProfilePicture from "../assets/images/default-profile-picture.webp";

const Profile = () => {
  const [userData, setUserData] = useState();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [followed, setFollowed] = useState(false);
  const id = useParams().id ? useParams().id : localStorage.getItem("userId");
  const isMyProfile = id === localStorage.getItem("userId") || !id;

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_API_URL}/user/${id}`
        );
        setUserData(response.data.response);
        setFollowed(
          response.data.response.followers !== null &&
            response.data.response.followers
              .split(",")
              .includes(localStorage.getItem("userId"))
        );
        setLoading(false);
      } catch (error) {
        toast.error(MESSAGES.ERROR_OCCURRED);
        setError(true);
      }
    };
    fetchUser();
  }, [id]);

  const followUser = async () => {
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/user/follow`,
        {
          followerId: localStorage.getItem("userId"),
          followingId: id,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      toast.success(response.data.message);
      setFollowed(true);
    } catch (error) {
      toast.error(error.response.data.message);
    }
  };

  const unfollowUser = async () => {
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/user/unfollow`,
        {
          followerId: localStorage.getItem("userId"),
          followingId: id,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      toast.success(response.data.message);
      setFollowed(false);
    } catch (error) {
      toast.error(error.response.data.message);
    }
  };

  if (loading) return <h1>{MESSAGES.CONTENT_LOADING}</h1>;

  if (error) return <h1>{MESSAGES.ERROR_OCCURRED}</h1>;

  return (
    <div className="m-2 rounded-lg overflow-hidden">
      <div className="relative mb-14 select-none">
        <div className="h-48">
          <img
            src={userData.bannerUrl || defaultBanner}
            alt="banner"
            className="w-full h-full object-cover"
          />
        </div>
        <div className="absolute left-0 bottom-[-3.5rem] rounded-full flex items-center justify-center w-full">
          <img
            src={userData.pp_url || defaultProfilePicture}
            alt={`profile picture of ${userData.username}`}
            className="size-28 object-cover rounded-full border-4 border-white"
          />
        </div>
      </div>
      <div className="flex items-center justify-center flex-col">
        <h1 className="text-2xl">{userData.username}</h1>
        <p className="text-center">
          {userData.bio ? userData.bio : "Bu kullanıcı hakkında bilgi yok."}
        </p>
        <div className="flex items-center justify-center flex-row my-2 w-full gap-2">
          {isMyProfile ? (
            <>
              <Button text="Düzenle" color="primary" />
            </>
          ) : (
            <>
              {followed ? (
                <>
                  <Button
                    text="Takipten Çık"
                    color="primary"
                    onClick={() => unfollowUser()}
                  />
                  <Button
                    text="Sohbeti Başlat"
                    color="indigo"
                    onClick={() => {
                      toast.warning("Bu özellik henüz aktif değil!");
                    }}
                  />
                </>
              ) : (
                <Button
                  text="Takip Et"
                  color="primary"
                  onClick={() => followUser()}
                />
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;
