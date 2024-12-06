import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { MESSAGES } from "../constants/messages";
import axios from "axios";
import Button from "../components/ui/Button";
import { useNavigate } from "react-router-dom";
import defaultBanner from "../assets/images/default-banner.jpg";
import defaultProfilePicture from "../assets/images/default-profile-picture.webp";

const EditProfile = () => {
  const [images, setImages] = useState({
    pp: undefined,
    banner: undefined,
  });
  const [userData, setUserData] = useState({
    email: "",
    username: "",
    bio: "",
    pp_url: "",
    banner_url: "",
  });
  const [newPassword, setNewPassword] = useState({
    password: "",
    repeatPassword: "",
  });
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_API_URL}/user/${
            JSON.parse(localStorage.getItem("userData")).id
          }`
        );
        setUserData({
          email: response.data.response.email,
          username: response.data.response.username,
          bio: response.data.response.bio,
          pp_url: response.data.response.pp_url,
          banner_url: response.data.response.banner_url,
        });
        setImages({
          pp: response.data.response.pp_url
            ? response.data.response.pp_url
            : defaultProfilePicture,
          banner: response.data.response.banner_url
            ? response.data.response.banner_url
            : defaultBanner,
        });
        setLoading(false);
      } catch (error) {
        toast.error(MESSAGES.ERROR_OCCURRED);
      }
    };
    fetchUser();
  }, []);

  const handleImageChange = (e) => {
    if (e.target.files) {
      setImages({ ...images, [e.target.name]: e.target.files[0] });
    }
  };

  const handleInputChange = (e) => {
    setUserData({ ...userData, [e.target.name]: e.target.value });
  };

  const handlePasswordChange = (e) => {
    setNewPassword({ ...newPassword, [e.target.name]: e.target.value });
  };

  const handleCheckboxChange = (e) => {
    const { name, checked } = e.target;
    setUserData({ ...userData, [name]: checked });
  };

  const validateUserData = (data) => {
    const errors = [];

    if (!data.username.trim()) {
      errors.push(MESSAGES.USERNAME_REQUIRED);
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!data.email.trim()) {
      errors.push(MESSAGES.EMAIL_REQUIRED);
    } else if (!emailRegex.test(data.email)) {
      errors.push(MESSAGES.EMAIL_INVALID);
    }

    if (newPassword.password != "" && newPassword.password.length < 6) {
      errors.push(MESSAGES.PASSWORD_LENGTH(6));
    }

    if (newPassword.password != newPassword.repeatPassword) {
      errors.push(MESSAGES.PASSWORDS_NOT_MATCH);
    }

    if (errors.length === 0) {
      return true;
    }
    return errors;
  };

  const handleUserSubmit = async (e) => {
    e.preventDefault();
    const errors = validateUserData(userData);
    if (errors.length > 0) {
      // errors.map((error) => toast.error(error)); // Throw all errors
      toast.error(errors[0]); // Throw only first error
    } else {
      try {
        if (typeof images.pp != "string" || typeof images.banner != "string") {
          if (typeof images.pp != "string") {
            const formData = new FormData();
            formData.append("files", images.pp);
            formData.append(
              "id",
              JSON.parse(localStorage.getItem("userData")).id
            );
            formData.append("tableName", "user_images");

            const imageUploadResponse = await axios.post(
              `${import.meta.env.VITE_API_URL}/storage`,
              formData,
              {
                headers: {
                  Authorization: `Bearer ${localStorage.getItem("token")}`,
                },
              }
            );
            const response = await axios.put(
              `${import.meta.env.VITE_API_URL}/user/${
                JSON.parse(localStorage.getItem("userData")).id
              }`,
              newPassword.password != ""
                ? {
                    ...userData,
                    password: newPassword.password,
                    pp_url: imageUploadResponse.data.response[0].url,
                  }
                : {
                    ...userData,
                    pp_url: imageUploadResponse.data.response[0].url,
                  },
              {
                headers: {
                  Authorization: `Bearer ${localStorage.getItem("token")}`,
                },
              }
            );
            if (response.status === 200) {
              toast.success(response.data.message);
              navigate(
                `/profile/${JSON.parse(localStorage.getItem("userData")).id}`
              );
            } else {
              toast.error(MESSAGES.ERROR_OCCURRED);
            }
          }
          if (typeof images.banner != "string") {
            const formData = new FormData();
            formData.append("files", images.banner);
            formData.append(
              "id",
              JSON.parse(localStorage.getItem("userData")).id
            );
            formData.append("tableName", "user_images");

            const imageUploadResponse = await axios.post(
              `${import.meta.env.VITE_API_URL}/storage`,
              formData,
              {
                headers: {
                  Authorization: `Bearer ${localStorage.getItem("token")}`,
                },
              }
            );
            const response = await axios.put(
              `${import.meta.env.VITE_API_URL}/user/${
                JSON.parse(localStorage.getItem("userData")).id
              }`,
              newPassword.password != ""
                ? {
                    ...userData,
                    password: newPassword.password,
                    banner_url: imageUploadResponse.data.response[0].url,
                  }
                : {
                    ...userData,
                    banner_url: imageUploadResponse.data.response[0].url,
                  },
              {
                headers: {
                  Authorization: `Bearer ${localStorage.getItem("token")}`,
                },
              }
            );
            if (response.status === 200) {
              toast.success(response.data.message);
              navigate(
                `/profile/${JSON.parse(localStorage.getItem("userData")).id}`
              );
            } else {
              toast.error(MESSAGES.ERROR_OCCURRED);
            }
          }
        } else {
          const response = await axios.put(
            `${import.meta.env.VITE_API_URL}/user/${
              JSON.parse(localStorage.getItem("userData")).id
            }`,
            newPassword.password != ""
              ? { ...userData, password: newPassword.password }
              : userData,
            {
              headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`,
              },
            }
          );
          if (response.status === 200) {
            toast.success(response.data.message);
            navigate(
              `/profile/${JSON.parse(localStorage.getItem("userData")).id}`
            );
          } else {
            toast.error(MESSAGES.ERROR_OCCURRED);
          }
        }
      } catch (error) {
        toast.error(error.response.data.message);
      }
    }
  };

  if (loading) return <h1>{MESSAGES.CONTENT_LOADING}</h1>;

  return (
    <div className="w-full h-auto flex items-center justify-center">
      <form
        onSubmit={handleUserSubmit}
        className="w-11/12 h-auto bg-secondary-100 p-2 mt-4 rounded-lg border max-h-[75vh] overflow-y-scroll"
      >
        <div className="relative mb-14 select-none">
          <div className="h-48 rounded-t-md overflow-hidden">
            <img
              src={
                typeof images.banner == "string"
                  ? images.banner
                  : URL.createObjectURL(images.banner)
              }
              alt="banner"
              className="w-full h-full object-cover hover:grayscale cursor-pointer"
            />
            <input
              type="file"
              name="banner"
              multiple
              accept="image/*"
              onChange={handleImageChange}
              className="w-full h-full cursor-pointer opacity-0 z-10 absolute top-0 left-0"
            />
          </div>
          <div className="absolute left-0 bottom-[-3.5rem] rounded-full flex items-center justify-center w-full z-20 hover:grayscale">
            <img
              src={
                typeof images.pp == "string"
                  ? images.pp
                  : URL.createObjectURL(images.pp)
              }
              alt={`profile picture of ${userData.username}`}
              className="size-28 object-cover rounded-full border-4 border-white"
            />
            <input
              type="file"
              name="pp"
              multiple
              accept="image/*"
              onChange={handleImageChange}
              className="size-28 cursor-pointer opacity-0 z-10 absolute"
            />
          </div>
        </div>

        <div>
          <label htmlFor="username" className="block font-semibold">
            Kullanıcı Adı
          </label>
          <input
            name="username"
            value={userData.username}
            onChange={handleInputChange}
            className="w-full mt-1 p-2 border rounded-md outline-none focus:ring-2 focus:ring-primary-400 mb-1"
          />
        </div>
        <div>
          <label htmlFor="email" className="block font-semibold">
            E-Posta
          </label>
          <input
            name="email"
            value={userData.email}
            onChange={handleInputChange}
            className="w-full mt-1 p-2 border rounded-md outline-none focus:ring-2 focus:ring-primary-400 mb-1"
          />
        </div>
        <div>
          <label htmlFor="password" className="block font-semibold">
            Yeni Şifre
          </label>
          <input
            name="password"
            value={newPassword.password}
            onChange={handlePasswordChange}
            className="w-full mt-1 p-2 border rounded-md outline-none focus:ring-2 focus:ring-primary-400 mb-1"
          />
        </div>
        <div>
          <label htmlFor="repeatPassword" className="block font-semibold">
            Şifre Doğrulaması
          </label>
          <input
            name="repeatPassword"
            value={newPassword.repeatPassword}
            onChange={handlePasswordChange}
            className="w-full mt-1 p-2 border rounded-md outline-none focus:ring-2 focus:ring-primary-400 mb-1"
          />
        </div>
        <div>
          <label htmlFor="bio" className="block font-semibold">
            Bio
          </label>
          <textarea
            name="bio"
            value={userData.bio}
            onChange={handleInputChange}
            className="w-full mt-1 p-2 border rounded-md min-h-16 outline-none focus:ring-2 focus:ring-primary-400 mb-1"
            rows={4}
          />
        </div>
        <div className="w-full p-2">
          <Button text="Güncelle" color="primary" />
        </div>
        <div className="w-full p-2">
          <Button
            text="Sil"
            color="danger"
            onClick={async () => {
              try {
                const response = await axios.delete(
                  `${import.meta.env.VITE_API_URL}/user/${
                    JSON.parse(localStorage.getItem("userData")).id
                  }`,
                  {
                    headers: {
                      Authorization: `Bearer ${localStorage.getItem("token")}`,
                    },
                  }
                );
                if (response.status === 200) {
                  toast.success(response.data.message);
                  navigate("/");
                } else {
                  toast.error(MESSAGES.ERROR_OCCURRED);
                }
              } catch (error) {
                toast.error(error.response.data.message);
              }
              localStorage.clear();
            }}
          />
        </div>
      </form>
    </div>
  );
};

export default EditProfile;