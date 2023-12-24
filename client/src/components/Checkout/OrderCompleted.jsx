import React from "react";
import Lottie from "lottie-react";
import animationData from "../../assets/animations/Animation - 1703406572704.json";

const OrderCompleted = () => {
  const defaultOptions = {
    loop: true,
    autoplay: true,
    animationData: animationData,
    rendererSettings: {
      preserveAspectRatio: "xMidYMid slice",
    },
  };

  return (
    <div className="w-full h-full flex justify-center items-center">
      <Lottie
        animationData={animationData}
        options={defaultOptions}
        height={400}
        width={400}
      />
    </div>
  );
};

export default OrderCompleted;
