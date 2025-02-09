import React from 'react'

const Forbidden = () => {
  return (
    <div className="w-full absolute top-1/2 left-0 translate-y-[-50%] flex items-center justify-center flex-col">
      <h1 className="text-7xl text-primary-500 font-bold">403</h1>
      <h2 className="text-xl text-primary-500 text-center px-2">Bu sayfaya erişmek için yeterli yetkiye sahip değilsiniz!</h2>
    </div>
  );
}

export default Forbidden