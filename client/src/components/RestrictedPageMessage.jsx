import React from "react";
import Button from "../components/ui/Button";
import { Link } from "react-router-dom";

const RestrictedPageMessage = () => {
  return (
    <div className="w-full flex items-center justify-center flex-col p-3">
      <p className="text-secondary-800 text-center m-4">
        Giriş yapmamış gibi görünüyorsunuz. Hadi bir hesap oluşturun ve
        keşfetmeye başlayın!
      </p>
      <Link to={"/auth?page=register"} className="w-full">
        <Button text="Hadi Başlayalım!" />
      </Link>
    </div>
  );
};

export default RestrictedPageMessage;
