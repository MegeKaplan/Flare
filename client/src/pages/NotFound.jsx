import React from "react";

const NotFound = () => {
  return (
    <div className="w-full absolute top-1/2 left-0 translate-y-[-50%] flex items-center justify-center flex-col">
      <h1 className="text-7xl text-primary-500 font-bold">404</h1>
      <h2 className="text-xl text-primary-500">Sayfa Bulunamadı!</h2>
    </div>
  );
};

export default NotFound;
