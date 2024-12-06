import React from "react";
import Feed from "../components/Feed";
import Stories from "../components/Stories";
import RestrictedPageMessage from "../components/RestrictedPageMessage";

const Home = () => {
  return (
    <>
      {localStorage.getItem("userId") ? (
        <>
          <Stories />
          <Feed page="home" />
        </>
      ) : (
        <RestrictedPageMessage />
      )}
    </>
  );
};

export default Home;
