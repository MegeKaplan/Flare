import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { toastifyEmitterConfig } from "../config/toastifyConfig";
import { MESSAGES } from "../constants/messages";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Auth = () => {
  const [signUp, setSignUp] = useState(false);
  const [authData, setAuthData] = useState({
    username: "",
    email: "",
    password: "",
  });
  const [isValid, setIsValid] = useState(false);
  const navigate = useNavigate();

  const formSubmitHandler = async (e) => {
    e.preventDefault();
    const errors = validateAuthData(authData);
    if (errors.length > 0) {
      // errors.map((error) => toast.error(error)); // Throw all errors
      toast.error(errors[0]); // Throw only first error
    } else {
      try {
        const response = signUp
          ? await axios.post(
              `${import.meta.env.VITE_API_URL}/auth/register`,
              authData
            )
          : await axios.post(
              `${import.meta.env.VITE_API_URL}/auth/login`,
              authData
            );

        if (response.status === 201 || response.status === 200) {
          toast.success(response.data.message);
          localStorage.setItem("token", response.data.response.token);
          localStorage.setItem("userId", response.data.response.userId);
          setTimeout(() => {
            navigate("/");
          }, Number(toastifyEmitterConfig.autoClose));
        } else {
          toast.error(response.data);
        }
      } catch (error) {
        toast.error(error.response.data.message);
      }
    }
  };

  const onChangeHandler = (e) => {
    setAuthData({ ...authData, [e.target.name]: e.target.value });
  };

  const validateAuthData = (data) => {
    const errors = [];

    if (!data.username.trim() && signUp) {
      errors.push(MESSAGES.USERNAME_REQUIRED);
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!data.email.trim()) {
      errors.push(MESSAGES.EMAIL_REQUIRED);
    } else if (!emailRegex.test(data.email)) {
      errors.push(MESSAGES.EMAIL_INVALID);
    }

    if (!data.password.trim()) {
      errors.push(MESSAGES.PASSWORD_REQUIRED);
    } else if (data.password.length < 6) {
      errors.push(MESSAGES.PASSWORD_LENGTH(6));
    }

    if (errors.length === 0) {
      setIsValid(true);
    }
    return errors;
  };

  return (
    <div className="w-full flex items-center justify-center">
      <div className="w-11/12 bg-secondary-100 h-auto p-2 flex items-center justify-center mt-4 rounded-lg flex-col border">
        <h1 className="font-bold text-4xl m-5">
          {signUp ? "Kaydol" : "Giriş Yap"}
        </h1>
        <form onSubmit={formSubmitHandler} className="w-full h-auto">
          {signUp && (
            <div className="flex-col p-2 mb-2">
              <label className="font-semibold" htmlFor="username">
                Kullanıcı Adı
              </label>
              <input
                className="w-full p-2 outline-none rounded bg-none mt-1 focus:ring-2 focus:ring-primary-400"
                value={authData.username}
                onChange={onChangeHandler}
                name="username"
                type="text"
                placeholder="Kullanıcı adınızı girin"
              />
            </div>
          )}
          <div className="flex-col p-2 mb-2">
            <label className="font-semibold" htmlFor="email">
              E-Posta
            </label>
            <input
              className="w-full p-2 outline-none rounded bg-none mt-1 focus:ring-2 focus:ring-primary-400"
              value={authData.email}
              onChange={onChangeHandler}
              name="email"
              type="text"
              placeholder="E-Posta adresinizi girin"
            />
          </div>
          <div className="flex-col p-2 mb-2">
            <label className="font-semibold" htmlFor="password">
              Şifre
            </label>
            <input
              className="w-full p-2 outline-none rounded bg-none mt-1 focus:ring-2 focus:ring-primary-400"
              value={authData.password}
              onChange={onChangeHandler}
              name="password"
              type="password"
              placeholder="Şifrenizi girin"
            />
          </div>
          <div className="w-full p-2">
            <button className="w-full p-2 outline-none rounded bg-primary-400 hover:bg-primary-500 transition">
              {signUp ? "Kayıt Ol" : "Giriş Yap"}
            </button>
          </div>
          <span className="flex items-center justify-center m-1">
            <span className="mr-1">
              {signUp ? "Zaten hesabın var mı?" : "Bir hesabın yok mu?"}
            </span>
            <span
              className="text-primary-600 cursor-pointer"
              onClick={() => setSignUp(!signUp)}
            >
              {signUp ? "Giriş Yap" : "Şimdi Kayıt Ol"}
            </span>
            !
          </span>
        </form>
      </div>
    </div>
  );
};

export default Auth;
