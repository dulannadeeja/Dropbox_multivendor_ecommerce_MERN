<<<<<<< HEAD
import React, { useEffect } from "react";
import styles from "../../styles/styles";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { useSellerSignupContext } from "../../contexts/SellerSignupContext";

const StepControl = () => {
  const {
    currentStep,
    setCurrentStep,
    steps,
    firstStepCompleted,
    secondStepCompleted,
  } = useSellerSignupContext();

  const [allowNext, setAllowNext] = useState(true); // testing purposes only - remove later on when all steps are completed

  const handleNext = () => {
    console.log(currentStep);
    console.log(firstStepCompleted);
    // testing purposes only - remove later on when all steps are completed
    // if (currentStep === 1 && !firstStepCompleted) return;
    // if (currentStep === 2 && !secondStepCompleted) return;
    if (currentStep < steps.length) setCurrentStep(currentStep + 1);
    console.log(currentStep);
=======
import React from "react";
import styles from "../../styles/styles";

const StepControl = ({ allSteps, setCurrentStep, currentStep }) => {
  const handleNext = () => {
    console.log(currentStep);
    if (currentStep < allSteps.length) setCurrentStep(currentStep + 1);
>>>>>>> 576e884e8479516853b1675d158c83bb1d6956fa
  };

  const handleBack = () => {
    console.log(currentStep);
    if (currentStep > 1) setCurrentStep(currentStep - 1);
  };

<<<<<<< HEAD
  const handleCreateAccount = () => {
    console.log("Create Account");
  };

  useEffect(() => {
    // if (currentStep === 1 && firstStepCompleted) {
    //   setAllowNext(true);
    // } else if (currentStep === 2 && secondStepCompleted) {
    //   setAllowNext(true);
    // } else {
    //   setAllowNext(false);
    // }
  }, [firstStepCompleted, secondStepCompleted, currentStep]);

=======
>>>>>>> 576e884e8479516853b1675d158c83bb1d6956fa
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
<<<<<<< HEAD
        {currentStep < steps.length ? (
          <button
            disabled={!allowNext ? true : false}
            className={`${styles.button} ${
              allowNext ? "bg-slate-800" : "bg-slate-500 hover:bg-slate-500"
            }`}
            onClick={() => handleNext()}
          >
            Next
          </button>
        ) : (
          <button
            disabled={!allowNext ? true : false}
            className={`${styles.button} ${
              allowNext ? "bg-slate-800" : "bg-slate-500 hover:bg-slate-500"
            }`}
            onClick={() => handleCreateAccount()}
          >
            Create Account
          </button>
        )}
=======
        <button className={styles.button} onClick={() => handleNext()}>
          Next
        </button>
>>>>>>> 576e884e8479516853b1675d158c83bb1d6956fa
      </div>
    </div>
  );
};

export default StepControl;
