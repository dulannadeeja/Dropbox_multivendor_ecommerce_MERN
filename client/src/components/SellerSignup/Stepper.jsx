import React from "react";
import { TiTick } from "react-icons/ti";
import { useSellerSignupContext } from "../../contexts/SellerSignupContext";

const Stepper = () => {
  const { currentStep, steps } = useSellerSignupContext();

  return (
    <div className="">
      <div className="flex justify-between items-cente w-full relative">
        {steps.map((step, index) => (
          <div className="flex flex-col items-center gap-2" key={index}>
            <div
              className={
                currentStep > index + 1
                  ? "flex items-center justify-center w-10 h-10 border-2 border-slate-50 rounded-full bg-indigo-500 text-white z-10"
                  : currentStep === index + 1
                  ? "flex items-center justify-center w-10 h-10 border-2 border-white text-white rounded-full bg-slate-800 bg-your-color text-your-text-color z-10"
                  : "flex items-center justify-center w-10 h-10 border-2 border-slate-500 rounded-full bg-white text-slate-500 z-10"
              }
            >
              {index + 1}
            </div>
            <div className="text-sm">{step}</div>
          </div>
        ))}
        <div className="absolute top-5 left-1/2 transform -translate-x-1/2 w-[95%] h-1 bg-slate-500"></div>
        {currentStep == 2 && (
          <div className="absolute top-5 left-10 transform w-[32%] h-1 bg-indigo-500"></div>
        )}
        {currentStep == 3 && (
          <div className="absolute top-5 left-10 transform w-[64%] h-1 bg-indigo-500"></div>
        )}
        {currentStep == 4 && (
          <div className="absolute top-5 left-10 transform w-[96%] h-1 bg-indigo-500"></div>
        )}
      </div>
    </div>
  );
};

export default Stepper;
