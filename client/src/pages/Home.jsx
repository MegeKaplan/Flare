import React from "react";
import Feed from "../components/Feed";
import Stories from "../components/Stories";

const Home = () => {
  return (
    <>
      <Stories />
      <Feed page="home" />
    </>
  );
};

export default Home;
