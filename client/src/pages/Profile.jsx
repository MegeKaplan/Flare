import React, { useEffect, useState } from "react";
import Button from "../components/ui/Button";
import { toast } from "react-toastify";
import { MESSAGES } from "../constants/messages";
import { useParams } from "react-router-dom";
import axios from "axios";
import defaultBanner from "../assets/images/default-banner.jpg";
import defaultProfilePicture from "../assets/images/default-profile-picture.webp";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import RestrictedPageMessage from "../components/RestrictedPageMessage";
import UserItem from "../components/UserItem";
import { FaStar } from "react-icons/fa6";

const Profile = () => {
  const [userData, setUserData] = useState();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [followed, setFollowed] = useState(false);
  const id = useParams().id ? useParams().id : localStorage.getItem("userId");
  const isMyProfile = id === localStorage.getItem("userId") || !id;
  const [posts, setPosts] = useState([]);
  const [refresh, setRefresh] = useState(false);
  const navigate = useNavigate();
  const [connections, setConnections] = useState({
    followers: [],
    following: [],
  });
  const [isSectionVisible, setIsSectionVisible] = useState({
    posts: true,
    followers: false,
    following: false,
  });
  const [viewType, setViewType] = useState("card");

  const toggleViewType = () => {
    setViewType((prev) => (prev == "card" ? "list" : "card"));
  };

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

  useEffect(() => {
    setConnections({
      followers: [],
      following: [],
    });
    getConnections("followers").then((followers) => {
      setConnections((prev) => {
        return { ...prev, followers };
      });
    });
    getConnections("following").then((following) => {
      setConnections((prev) => {
        return { ...prev, following };
      });
    });
  }, [id, refresh]);

  const getConnections = async (type) => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/user/${id}/connections?type=${type}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      return response.data.response;
    } catch (error) {}
  };

  const changeSectionVisibility = (section) => {
    setIsSectionVisible({
      posts: false,
      followers: false,
      following: false,
      [section]: true,
    });
  };

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

  if (!localStorage.getItem("userId")) return <RestrictedPageMessage />;
  else if (loading) return <h1>{MESSAGES.CONTENT_LOADING}</h1>;
  else if (error) return <h1>{MESSAGES.ERROR_OCCURRED}</h1>;

  return (
    <div className="m-2 rounded-lg overflow-hidden pb-16">
      <div className="relative mb-14 select-none">
        <div className="h-48">
          <img
            src={userData.banner_url || defaultBanner}
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
        <h1 className="text-2xl flex items-center justify-center relative group">
          {userData.username}
          {userData.is_verified ? (
            <FaStar
              size={16}
              className="text-yellow-400 text-xs ml-1"
              title="Doğrulanmış Hesap"
            />
          ) : (
            ""
          )}
          <span
            className={`bg-[${
              JSON.parse(userData.role).color
            }] text-xs p-1 rounded-sm bg-opacity-50 mx-2 absolute right-[-15px] translate-x-full select-none`}
            style={{
              backgroundColor: `rgba(${parseInt(
                JSON.parse(userData.role).color.slice(1, 3),
                16
              )}, ${parseInt(
                JSON.parse(userData.role).color.slice(3, 5),
                16
              )}, ${parseInt(
                JSON.parse(userData.role).color.slice(5, 7),
                16
              )}, 0.5)`,
            }}
          >
            {JSON.parse(userData.role).name}
            <span
              className={`w-36 sm:w-64 md:w-96 text-center absolute bottom-full left-1/2 transform -translate-x-1/2 -translate-y-1 p-2 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity duration-100 hover:hidden`}
              style={{
                backgroundColor: JSON.parse(userData.role).color,
              }}
            >
              {JSON.parse(userData.role).description}
            </span>
          </span>
        </h1>

        <p className="text-center">
          {userData.bio ? userData.bio : "Bu kullanıcı hakkında bilgi yok."}
        </p>
        <div className="w-full grid grid-cols-3 h-14 gap-1 my-2">
          <div
            className={`rounded-md p-2 col-span-1 hover:bg-primary-200 transition duration-300 cursor-pointer shadow-sm select-none ${
              isSectionVisible.posts ? "bg-primary-100" : "bg-secondary-50"
            }`}
            onClick={() => changeSectionVisibility("posts")}
          >
            <span className="flex items-center justify-center text-xl font-normal">
              {posts.length}
            </span>
            <span className="flex items-center justify-center text-sm font-light">
              Gönderi
            </span>
          </div>
          <div
            className={`rounded-md p-2 col-span-1 hover:bg-primary-200 transition duration-300 cursor-pointer shadow-sm select-none ${
              isSectionVisible.followers ? "bg-primary-100" : "bg-secondary-50"
            }`}
            onClick={() => changeSectionVisibility("followers")}
            onDoubleClick={() => toggleViewType(viewType)}
          >
            <span className="flex items-center justify-center text-xl font-normal">
              {userData.followers ? userData.followers.split(",").length : 0}
            </span>
            <span className="flex items-center justify-center text-sm font-light">
              Takipçi
            </span>
          </div>
          <div
            className={`rounded-md p-2 col-span-1 hover:bg-primary-200 transition duration-300 cursor-pointer shadow-sm select-none ${
              isSectionVisible.following ? "bg-primary-100" : "bg-secondary-50"
            }`}
            onClick={() => changeSectionVisibility("following")}
            onDoubleClick={() => toggleViewType(viewType)}
          >
            <span className="flex items-center justify-center text-xl font-normal">
              {userData.followings ? userData.followings.split(",").length : 0}
            </span>
            <span className="flex items-center justify-center text-sm font-light">
              Takip
            </span>
          </div>
        </div>
        {/* <div className="flex items-center justify-center flex-row my-2 w-full gap-2"> */}
        <div className="grid grid-cols-2 my-2 w-full gap-2">
          {isMyProfile ? (
            <>
              <Button
                className="col-span-2"
                text="Düzenle"
                color="primary"
                onClick={() => {
                  navigate(`/edit-profile`);
                }}
              />
            </>
          ) : (
            <>
              {followed ? (
                <>
                  <Button
                    className="col-span-1"
                    text="Takipten Çık"
                    color="primary"
                    onClick={() => {
                      unfollowUser();
                      setRefresh(true);
                    }}
                  />
                  <Button
                    className="col-span-1"
                    text="Sohbeti Başlat"
                    color="indigo"
                    onClick={() => {
                      navigate(`/profile/${id}/messages`);
                    }}
                  />
                </>
              ) : (
                <Button
                  className="col-span-2"
                  text="Takip Et"
                  color="primary"
                  onClick={() => {
                    followUser();
                    setRefresh(true);
                  }}
                />
              )}
              {["founder", "admin", "moderator"].includes(
                JSON.parse(JSON.parse(localStorage.getItem("userData")).role)
                  .slug
              ) && (
                <Button
                  className="col-span-2"
                  text="Kullanıcıyı Düzenle"
                  color="emerald"
                  onClick={() => {
                    navigate(`/edit-profile/${userData.id}/`);
                  }}
                />
              )}
              {/* {console.log(
                JSON.parse(
                  `[${JSON.parse(
                    localStorage.getItem("userData")
                  ).permissions.replace(/}\s*,\s*{/g, "}, {")}]`
                )
                  .map((permission) => permission.slug)
                  .includes("assign_role")
              )} */}
            </>
          )}
        </div>
      </div>
      <div
        className={`w-full min-h-12 gap-3 mt-2 ${
          isSectionVisible.posts
            ? "grid grid-cols-3"
            : viewType == "list"
            ? "grid grid-cols-1"
            : "grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5"
        }`}
      >
        {isSectionVisible.posts &&
          (posts.length > 0 ? (
            posts.map((post) => (
              <Link
                to={`/post/${post.id}`}
                key={post.id}
                className="col-span-1 border-primary-400 border-2 aspect-square flex items-center justify-center rounded-md overflow-hidden shadow-sm hover:scale-95 transition duration-300"
              >
                {["jpg", "jpeg", "png", "gif", "webp"].includes(
                  post.images.split(",")[0].match(/\.([a-zA-Z0-9]+)(?=\?|$)/)[1]
                ) ? (
                  <img
                    key={post.id}
                    src={`${
                      import.meta.env.VITE_CLOUDINARY_BASE_URL
                    }/image/upload/flare/posts/${String(post.id).padStart(
                      6,
                      "0"
                    )}${Number(post.id) > 300 ? "-01" : ""}.webp`}
                    alt={
                      post.content
                        ? post.content
                        : `post of ${userData.username}`
                    }
                    title={
                      post.content
                        ? post.content
                        : `post of ${userData.username}`
                    }
                    className="select-none object-cover size-full transition duration-300 filter hover:brightness-75"
                  />
                ) : (
                  <video
                    key={post.id}
                    muted
                    autoPlay={false}
                    className="select-none object-cover size-full transition duration-300 filter hover:brightness-75"
                  >
                    <source
                      src={`${
                        import.meta.env.VITE_CLOUDINARY_BASE_URL
                      }/video/upload/flare/posts/${String(post.id).padStart(
                        6,
                        "0"
                      )}${Number(post.id) > 300 ? "-01" : ""}.mp4`}
                      alt={
                        post.content
                          ? post.content
                          : `post of ${userData.username}`
                      }
                      title={
                        post.content
                          ? post.content
                          : `post of ${userData.username}`
                      }
                    />
                  </video>
                )}
              </Link>
            ))
          ) : (
            <h1 className="col-span-3 text-center text-lg">
              Burada görebileceğiniz bir gönderi yok.
            </h1>
          ))}
        {isSectionVisible.followers &&
          connections.followers.map((user) => (
            <UserItem key={user.id} data={user} viewType={viewType} />
          ))}
        {isSectionVisible.following &&
          connections.following.map((user) => (
            <UserItem key={user.id} data={user} viewType={viewType} />
          ))}
      </div>
    </div>
  );
};

export default Profile;
