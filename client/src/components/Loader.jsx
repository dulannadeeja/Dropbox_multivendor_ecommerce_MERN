import React from "react";
import Lottie from "lottie-react";
import animationData from "../assets/animations/Animation - 1703057192210.json";

const Loader = () => {
  const defaultOptions = {
    loop: true,
    autoplay: true,
    animationData: animationData,
    rendererSettings: {
      preserveAspectRatio: "xMidYMid slice",
    },
  };

  return (
    <div className="fixed top-0 left-0 bg-transparent w-full h-full flex flex-col items-center justify-center">
      <Lottie
        animationData={animationData}
        options={defaultOptions}
        height={400}
        width={400}
      />
    </div>
  );
};

export default Loader;
