import React from "react";
import styles from "../../styles/styles";

const StepControl = ({ allSteps, setCurrentStep, currentStep }) => {
  const handleNext = () => {
    console.log(currentStep);
    if (currentStep < allSteps.length) setCurrentStep(currentStep + 1);
  };

  const handleBack = () => {
    console.log(currentStep);
    if (currentStep > 1) setCurrentStep(currentStep - 1);
  };

  return (
    <div className="flex justify-between items-center">
      <div>
        <button
          className={`${styles.button} bg-slate-500`}
          onClick={() => handleBack()}
        >
          Back
        </button>
      </div>
      <div>
        <button className={styles.button} onClick={() => handleNext()}>
          Next
        </button>
      </div>
    </div>
  );
};

export default StepControl;
