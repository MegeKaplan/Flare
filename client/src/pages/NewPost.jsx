import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { MESSAGES } from "../constants/messages";
import { FaFileMedical } from "react-icons/fa6";
import { AiOutlineClear } from "react-icons/ai";
import axios from "axios";
import Button from "../components/ui/Button";
import { useNavigate } from "react-router-dom";
import RestrictedPageMessage from "../components/RestrictedPageMessage";

const NewPost = () => {
  const [images, setImages] = useState([]);
  const [postData, setPostData] = useState({
    content: "",
    is_story: false,
    is_public: false,
    sender_id: Number(localStorage.getItem("userId")),
  });
  const navigate = useNavigate();
  const [isClickedTheShareButton, setIsClickedTheShareButton] = useState(false);

  const handleImageChange = (e) => {
    if (e.target.files) {
      if (e.target.files.length > 3) {
        toast.error(MESSAGES.FILE_LIMIT(3));
      } else {
        setImages(Array.from(e.target.files));
      }
    }
  };

  const handleInputChange = (e) => {
    setPostData({ ...postData, [e.target.name]: e.target.value });
  };

  const handleCheckboxChange = (e) => {
    const { name, checked } = e.target;
    setPostData({ ...postData, [name]: checked });
  };

  const handlePostSubmit = async (e) => {
    e.preventDefault();
    if (images.length === 0) {
      toast.error(MESSAGES.IMAGE_REQUIRED);
      return;
    }
    // if (!postData.content.trim()) {
    //   toast.error(MESSAGES.POST_CONTENT_REQUIRED);
    //   return;
    // }

    setIsClickedTheShareButton(true);

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/posts`,
        postData,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      const formData = new FormData();
      images.forEach((image) => {
        formData.append("files", image);
      });
      formData.append("id", response.data.response);
      formData.append("tableName", "post_images");
      await axios.post(`${import.meta.env.VITE_API_URL}/storage`, formData, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      if (response.status === 201) {
        setImages([]);
        setPostData({
          content: "",
          is_story: false,
          sender_id: Number(localStorage.getItem("userId")),
        });
        toast.success(response.data.message);
        navigate(`/post/${response.data.response}`);
      }
    } catch (error) {
      toast.error(error.response.data.message);
    }
  };

  if (!localStorage.getItem("userId")) return <RestrictedPageMessage />;

  return (
    <div className="w-full h-auto flex items-center justify-center">
      <form
        onSubmit={handlePostSubmit}
        className="w-11/12 h-auto bg-secondary-100 p-2 mt-4 rounded-lg border max-h-[75vh] overflow-y-scroll"
      >
        <div className="w-auto p-2 flex items-center justify-center overflow-x-auto">
          {images.map((image, index) => (
            <img
              key={index}
              src={URL.createObjectURL(image)}
              alt={`Selected image ${index + 1}`}
              className="size-28 object-cover rounded-md m-1 border-2 border-primary-300 p-1"
              title={image.name}
            />
          ))}
        </div>
        {images.length === 0 ? (
          <div className="h-48 m-4 bg-secondary-50 border-dashed border-secondary-300 border-2 rounded-2xl flex items-center justify-center hover:border-primary-400 hover:bg-primary-50 relative transition cursor-pointer">
            <input
              type="file"
              name="images"
              multiple
              accept="image/*"
              onChange={handleImageChange}
              className="w-full h-full cursor-pointer opacity-0 z-10"
            />
            <div className="text-lg font-semibold text-secondary-500 absolute flex items-center justify-center flex-row cursor-pointer">
              <FaFileMedical size={25} />
              <span className="text-xl ml-1 mt-1">Resim Seç</span>
            </div>
          </div>
        ) : (
          <div
            className="h-20 m-4 bg-secondary-50 border-dashed border-secondary-300 border-2 rounded-2xl flex items-center justify-center hover:border-red-400 hover:bg-red-50 relative transition cursor-pointer"
            onClick={() => setImages([])}
          >
            <div className="text-lg font-semibold text-secondary-500 absolute flex items-center justify-center flex-row">
              <AiOutlineClear size={25} />
              <span className="text-xl ml-1">Seçilenleri Temizle</span>
            </div>
          </div>
        )}

        <div>
          <label htmlFor="content" className="block font-semibold">
            Açıklama
          </label>
          <textarea
            name="content"
            value={postData.content}
            onChange={handleInputChange}
            className="w-full mt-1 p-2 border rounded-md min-h-24 outline-none focus:ring-2 focus:ring-primary-400 mb-1 bg-secondary-50"
            rows={4}
          />
        </div>
        <div className="flex items-center mx-2 my-4">
          <input
            type="checkbox"
            name="is_public"
            id="is_public"
            checked={postData.is_public}
            onChange={handleCheckboxChange}
            className="appearance-none w-6 h-6 border border-secondary-300 rounded-md bg-secondary-50 checked:bg-primary-400 checked:border-primary-300 focus:outline-none focus:ring-2 focus:ring-primary-400 focus:ring-offset-1 hover:outline-none hover:ring-2 hover:ring-primary-400 mr-2"
          />
          <label htmlFor="is_public" className="font-semibold">
            Herkese Açık Olarak Paylaş
          </label>
        </div>
        <div className="flex items-center mx-2 my-4">
          <input
            type="checkbox"
            name="is_story"
            id="is_story"
            checked={postData.is_story}
            onChange={handleCheckboxChange}
            className="appearance-none w-6 h-6 border border-secondary-300 rounded-md bg-secondary-50 checked:bg-primary-400 checked:border-primary-300 focus:outline-none focus:ring-2 focus:ring-primary-400 focus:ring-offset-1 hover:outline-none hover:ring-2 hover:ring-primary-400 mr-2"
          />
          <label htmlFor="is_story" className="font-semibold">
            Story Olarak Paylaş
          </label>
        </div>
        {!isClickedTheShareButton ? (
          <div className="w-full p-2">
            <Button text="Paylaş" color="primary" />
          </div>
        ) : (
          <div className="w-full p-2">
            <div className="bg-secondary-300 p-2 rounded-lg flex items-center justify-center">
              Paylaşılıyor...
            </div>
          </div>
        )}
      </form>
    </div>
  );
};

export default NewPost;
