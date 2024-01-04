import React, { useCallback, useEffect, useState } from "react";
import { useDropzone } from "react-dropzone";
import styles from "../../styles/styles";
import { useSellerSignupContext } from "../../contexts/SellerSignupContext";
import { hasValues } from "../../utils/objectHelper";

const ShopSetup = () => {
  const {
    setFourthStepInfo,
    fourthStepInfo,
    errors,
    setErrors,
    setFourthStepCompleted,
  } = useSellerSignupContext();

  const [bannerImage, setBannerImage] = useState("");
  const [shopDescription, setShopDescription] = useState("");
  const [logoImage, setLogoImage] = useState("");

  useEffect(() => {
    setFourthStepInfo({
      ...fourthStepInfo,
      shopBanner: bannerImage,
      shopLogo: logoImage,
      shopDescription,
    });
  }, [bannerImage, logoImage, shopDescription]);

  // Hooks to handle form re rendering
  useEffect(() => {
    if (!hasValues(errors) && shopDescription.length >= 10) {
      setFourthStepCompleted(true);
    } else {
      setFourthStepCompleted(false);
    }
  }),
    [errors, fourthStepInfo];

  // if user comes from another step, then set the values
  useEffect(() => {
    if (fourthStepInfo.shopDescription) {
      setShopDescription(fourthStepInfo.shopDescription);
    }
    if (fourthStepInfo.shopBanner) {
      setBannerImage(fourthStepInfo.shopBanner);
    }
    if (fourthStepInfo.shopLogo) {
      setLogoImage(fourthStepInfo.shopLogo);
    }
  }, []);

  const onDropLogo = useCallback((acceptedFiles) => {
    setLogoImage(acceptedFiles[0]);
  }, []);

  const onDropBanner = useCallback((acceptedFiles) => {
    setBannerImage(acceptedFiles[0]);
  }, []);

  const bannerDropzone = useDropzone({
    onDrop: onDropBanner,
    accept: "image/*",
  });

  const logoDropzone = useDropzone({
    onDrop: onDropLogo,
    accept: "image/*",
  });

  const onDescriptionChange = (value) => {
    setShopDescription(value);
    if (!value || value.trim() === "") {
      setErrors({ ...errors, shopDescription: "Shop description is required" });
    } else if (value.length < 10) {
      setErrors({
        ...errors,
        shopDescription: "Shop description must be at least 10 characters long",
      });
    } else {
      setErrors({ ...errors, shopDescription: "" });
    }
  };

  return (
    <div className="min-h-scree flex flex-col justify-center items-center sm:p-2 md:p-5 lg:p-10">
      <div className="self-start mt-10">
        <h2 className="text-xl font-bold text-gray-700">Shop Setup</h2>
        <p className="text-gray-500 mt-2">
          Enter your shop information. This information will be used to create
          your shop. Please ensure that the information is correct.
        </p>
      </div>

      <div className="self-start w-full mt-10 mb-10">
        {/* write a shop description */}
        <label htmlFor="shopDescription" className={styles.formLabel}>
          Shop Description
        </label>
        <p className="text-gray-500 mb-2">
          Tell us about your shop. This will appear on your shop page.
        </p>
        <textarea
          value={shopDescription}
          onChange={(e) => onDescriptionChange(e.target.value)}
          type="text"
          rows={5}
          name="shopDescription"
          required
          placeholder="e.g. We sell the best products in the world!"
          className={styles.formInput}
        />
        {/* form control error */}
        {errors && errors.shopDescription && (
          <p className={styles.formInputError}>{errors.shopDescription}</p>
        )}
      </div>

      <div className="max-w-xl relative w-full self-start mb-20">
        <label
          {...bannerDropzone.getRootProps()}
          className="flex flex-col rounded-lg overflow-hidden border-4 border-dashed w-full aspect-video group text-center"
        >
          <div className="relative h-full w-full text-center flex flex-col items-center justify-center">
            <div className="w-full h-full">
              {bannerImage ? (
                <img
                  className="w-full h-full object-cover opacity-50 group-hover:opacity-75 transition duration-150 ease-in-out"
                  src={URL.createObjectURL(bannerImage)}
                />
              ) : (
                <img
                  className="w-full h-full object-cover opacity-20 group-hover:opacity-75 transition duration-150 ease-in-out"
                  src="../../assets/placeholders/14054.jpg"
                />
              )}
            </div>
            <p className="pointer-none text-gray-500 absolute top-50 left-50">
              <span className="text-sm">Drag and drop</span> files here <br />{" "}
              or{" "}
              <span className="text-blue-600 hover:underline">
                select a file
              </span>{" "}
              from your computer
            </p>
          </div>
        </label>
        {/* logo */}
        <label
          {...logoDropzone.getRootProps()}
          className="z-10 bg-white bottom--1/2 -translate-y-1/2 absolute left-1/2 transform -translate-x-1/2 items-center justify-center flex flex-col rounded-full overflow-hidden border-4 border-dashed w-60 aspect-square group text-center"
        >
          <div className="relative h-full w-full text-center flex flex-col items-center justify-center">
            <div className="w-full h-full">
              {logoImage ? (
                <img
                  className="w-full h-full object-cover opacity-50 group-hover:opacity-75 transition duration-150 ease-in-out"
                  src={URL.createObjectURL(logoImage)}
                />
              ) : (
                <img
                  className="w-full h-full object-cover opacity-50 group-hover:opacity-75 transition duration-150 ease-in-out"
                  src="../../assets/placeholders/placeholder.jpg"
                />
              )}
            </div>
          </div>
        </label>
      </div>
    </div>
  );
};

export default ShopSetup;
