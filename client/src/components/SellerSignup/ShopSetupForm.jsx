// ShopSetup.js

import React, { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import styles from "../../styles/styles";

const ShopSetup = () => {
  const [bannerImage, setBannerImage] = useState(null);
  const [logoImage, setLogoImage] = useState(null);

  const onDropBanner = useCallback((acceptedFiles) => {
    const file = acceptedFiles[0];
    setBannerImage(file);
  }, []);

  const onDropLogo = useCallback((acceptedFiles) => {
    const file = acceptedFiles[0];
    setLogoImage(file);
  }, []);

  const renderImagePreview = (image) => {
    return (
      <div>
        <img
          src={URL.createObjectURL(image)}
          alt="Image Preview"
          className="mt-2 max-w-full h-auto"
        />
      </div>
    );
  };

  const bannerDropzone = useDropzone({
    onDrop: onDropBanner,
    accept: "image/*",
  });

  const logoDropzone = useDropzone({
    onDrop: onDropLogo,
    accept: "image/*",
  });

  return (
    <div className="min-h-screen flex flex-col justify-center py-12 sm:px-6 lg:px-10 800px:w-full">
      <div className="sm:w-full">
        <h2 className="text-xl font-bold text-gray-700 mt-10">Shop Setup</h2>
        <p className="text-gray-500 mt-5">
          Upload a banner and logo for your shop using drag and drop.
        </p>
      </div>
      <div className="mt-8 sm:mx-auto sm:w-full">
        <div>
          <form className="space-y-6">
            {/* Banner Upload */}
            <div className="mb-4">
              <label
                htmlFor="bannerImage"
                className={`${styles.formLabel} block text-sm font-medium text-gray-700`}
              >
                Shop Banner
              </label>
              <div
                {...bannerDropzone.getRootProps()}
                className={`${styles.formInput} mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md relative`}
              >
                <input {...bannerDropzone.getInputProps()} />
                {bannerDropzone.isDragActive ? (
                  <p className="text-gray-500">Drop the image here ...</p>
                ) : (
                  <p className="text-gray-500">
                    Drag 'n' drop a rectangular image here, or click to select
                    one
                  </p>
                )}
                {bannerImage && renderImagePreview(bannerImage)}
              </div>
            </div>

            {/* Logo Upload */}
            <div className="mb-4">
              <label
                htmlFor="logoImage"
                className={`${styles.formLabel} block text-sm font-medium text-gray-700`}
              >
                Shop Logo
              </label>
              <div
                {...logoDropzone.getRootProps()}
                className={`${styles.formInput} mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-full relative`}
              >
                <input {...logoDropzone.getInputProps()} />
                {logoDropzone.isDragActive ? (
                  <p className="text-gray-500">Drop the image here ...</p>
                ) : (
                  <p className="text-gray-500">
                    Drag 'n' drop a rounded image here, or click to select one
                  </p>
                )}
                {logoImage && renderImagePreview(logoImage)}
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ShopSetup;
