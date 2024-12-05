import React, { useEffect, useState } from "react";
import Button from "../components/ui/Button";
import { toast } from "react-toastify";
import { MESSAGES } from "../constants/messages";
import { useParams } from "react-router-dom";
import axios from "axios";
import defaultBanner from "../assets/images/default-banner.jpg";
import defaultProfilePicture from "../assets/images/default-profile-picture.webp";
import { Link } from "react-router-dom";

const Profile = () => {
  const [userData, setUserData] = useState();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [followed, setFollowed] = useState(false);
  const id = useParams().id ? useParams().id : localStorage.getItem("userId");
  const isMyProfile = id === localStorage.getItem("userId") || !id;
  const [posts, setPosts] = useState([]);
  const [refresh, setRefresh] = useState(false);

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
        setTimeout(() => {
          setRefresh(false);
        }, 100);
      } catch (error) {
        toast.error(MESSAGES.ERROR_OCCURRED);
        setError(true);
      }
    };
    fetchUser();
  }, [id, refresh]);

  useEffect(() => {
    const getPostsOfUser = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_API_URL}/posts?sender_id=${id}&is_story=0`
        );
        setPosts(response.data.response);
      } catch (error) {
        toast.error(MESSAGES.ERROR_OCCURRED);
      }
    };
    getPostsOfUser();
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
    <div className="m-2 rounded-lg overflow-hidden pb-16">
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
      <div className="flex items-center justify-center flex-col border-b">
        <h1 className="text-2xl">{userData.username}</h1>
        <p className="text-center">
          {userData.bio ? userData.bio : "Bu kullanıcı hakkında bilgi yok."}
        </p>
        <div className="w-full grid grid-cols-3 h-14 gap-1 my-2">
          <div className="rounded-md bg-secondary-50 p-2 col-span-1 hover:bg-primary-50 transition duration-300">
            <span className="flex items-center justify-center text-xl font-normal">
              {posts.length}
            </span>
            <span className="flex items-center justify-center text-sm font-light">
              Gönderi
            </span>
          </div>
          <div className="rounded-md bg-secondary-50 p-2 col-span-1 hover:bg-primary-50 transition duration-300">
            <span className="flex items-center justify-center text-xl font-normal">
              {userData.followers ? userData.followers.split(",").length : 0}
            </span>
            <span className="flex items-center justify-center text-sm font-light">
              Takipçi
            </span>
          </div>
          <div className="rounded-md bg-secondary-50 p-2 col-span-1 hover:bg-primary-50 transition duration-300">
            <span className="flex items-center justify-center text-xl font-normal">
              {userData.followings ? userData.followings.split(",").length : 0}
            </span>
            <span className="flex items-center justify-center text-sm font-light">
              Takip
            </span>
          </div>
        </div>
        <div className="flex items-center justify-center flex-row my-2 w-full gap-2">
          {isMyProfile ? (
            <>
              <Button
                text="Düzenle"
                color="primary"
                onClick={() => {
                  toast.warning("Bu özellik henüz aktif değil!");
                }}
              />
            </>
          ) : (
            <>
              {followed ? (
                <>
                  <Button
                    text="Takipten Çık"
                    color="primary"
                    onClick={() => {
                      unfollowUser();
                      setRefresh(true);
                    }}
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
                  onClick={() => {
                    followUser();
                    setRefresh(true);
                  }}
                />
              )}
            </>
          )}
        </div>
      </div>
      <div className="w-full grid grid-cols-3 min-h-12 gap-3 mt-2">
        {posts.length > 0 ? (
          posts.map((post) => (
            <Link
              to={`/post/${post.id}`}
              key={post.id}
              className="col-span-1 border-primary-400 border-2 aspect-square flex items-center justify-center rounded-md overflow-hidden shadow-sm hover:scale-95 transition duration-300"
            >
              <img
                src={post.images.split(",")[0]}
                alt={post.content}
                title={post.content}
                className="select-none object-cover size-full transition duration-300 filter hover:brightness-75"
              />
            </Link>
          ))
        ) : (
          <h1 className="col-span-3 text-center text-lg">
            Burada görebileceğiniz bir gönderi yok.
          </h1>
        )}
      </div>
    </div>
  );
};

export default Profile;
