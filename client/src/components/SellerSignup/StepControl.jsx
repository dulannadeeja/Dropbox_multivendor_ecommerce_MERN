import React, { useEffect } from "react";
import styles from "../../styles/styles";
import { useSellerSignupContext } from "../../contexts/SellerSignupContext";
import { useState } from "react";

const StepControl = ({ handleSubmit }) => {
  const {
    currentStep,
    setCurrentStep,
    steps,
    firstStepCompleted,
    secondStepCompleted,
    thirdStepCompleted,
    fourthStepCompleted,
  } = useSellerSignupContext();

  const [nextOptionEnabled, setNextOptionEnabled] = useState(false);

  const handleNext = () => {
    if (nextOptionEnabled && currentStep < steps.length)
      setCurrentStep(currentStep + 1);
  };

  const handleBack = () => {
    if (currentStep > 1) setCurrentStep(currentStep - 1);
  };

  const isNextOptionEnabled = () => {
    // next option will be send enabled as true if the current step is 1 and the first step is completed
    if (currentStep === 1 && firstStepCompleted) {
      return true;
    } else if (currentStep === 2 && secondStepCompleted) {
      return true;
    } else if (currentStep === 3 && thirdStepCompleted) {
      return true;
    } else if (currentStep === 4 && fourthStepCompleted) {
      return true;
    }
    return false;
  };

  useEffect(() => {
    console.log(currentStep);
    setNextOptionEnabled(isNextOptionEnabled());
  }, [
    currentStep,
    firstStepCompleted,
    secondStepCompleted,
    thirdStepCompleted,
    fourthStepCompleted,
  ]);

  return (
    <div className="flex justify-between items-center mt-10">
      <div>
        <button
          className={`${styles.button} bg-slate-500`}
          onClick={() => handleBack()}
        >
          Back
        </button>
      </div>
      <div>
        {currentStep !== steps.length ? (
          <button
            className={`${styles.button} ${nextOptionEnabled && "bg-red-500"}`}
            disabled={!nextOptionEnabled}
            onClick={() => handleNext()}
          >
            Next
          </button>
        ) : (
          <button
            className={`${styles.button} ${nextOptionEnabled && "bg-red-500"}`}
            disabled={!nextOptionEnabled}
            onClick={() => handleSubmit()}
          >
            Open Shop
          </button>
        )}
      </div>
    </div>
  );
};

export default StepControl;
