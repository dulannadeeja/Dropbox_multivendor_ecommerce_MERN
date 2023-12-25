import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import Styles from "../../../styles/styles";
import CategoryPopup from "./CategoryPopup";
import bannerPlaceholder from "../../../assets/placeholders/icons8-placeholder-48.png";
import { useCreateEventContext } from "../../../contexts/createEventContext";
import validateEventData from "../../../validations/eventDataValidation";
import styles from "../../../styles/styles";
import { hasValues } from "../../../utils/objectHelper";
import Loader from "../../Loader";
import axios from "axios";
import { useSelector } from "react-redux";
import { server } from "../../../server";

const CreateEvent = () => {
  const { token } = useSelector((state) => state.user);
  const {
    eventData,
    setEventData,
    allTypesOfEvents,
    allTypesOfVisibility,
    errors,
    setErrors,
    selectedCategories,
  } = useCreateEventContext();

  const [categoryPopup, setCategoryPopup] = useState(false);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [endDateEnabled, setEndDateEnabled] = useState(false);
  const [minEndDate, setMinEndDate] = useState(null);

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // set duration in the event data
    if (startDate && endDate) {
      setEventData({
        ...eventData,
        startDate: startDate.toISOString().slice(0, 10),
        endDate: endDate.toISOString().slice(0, 10),
      });
    }
  }, [startDate, endDate]);

  const handleOnChange = async (e) => {
    const { name, value } = e.target;

    console.log("name: ", name);

    if (name === "discountAmount" || name === "minPurchaseAmount") {
      // Check if the value is a valid number
      if (value === "" || isNaN(value)) {
        setEventData({ ...eventData, [name]: value });
        setErrors({ ...errors, [name]: "Please enter a valid number" });
        return;
      }
    }

    // Check if the input is valid
    const error = await validateInput(name, value);

    // If there is an error, set the error state
    if (error) {
      setErrors({ ...errors, [name]: error });
    }

    // If there is no error, remove the error state
    if (!error) {
      setErrors({ ...errors, [name]: "" });
    }

    // Update the state
    setEventData({ ...eventData, [name]: value });
  };

  const validateInput = async (name, value) => {
    // Validate the input asynchronously
    try {
      const error = await validateEventData(name, value);
      return error;
    } catch (error) {
      console.error("Error during validation:", error);
      return "An error occurred during validation";
    }
  };

  const handleStartDateChange = (e) => {
    // check if the value is a valid date
    if (isNaN(Date.parse(e.target.value))) {
      setStartDate(null);
      setEndDate(null);
      setEndDateEnabled(false);
      return;
    }

    const selectedStartDate = new Date(e.target.value);
    setStartDate(selectedStartDate);

    // Calculate the minimum end date based on the selected start date
    const minimumEndDate = new Date(selectedStartDate);
    minimumEndDate.setDate(selectedStartDate.getDate() + 3);

    setMinEndDate(minimumEndDate.toISOString().slice(0, 10));

    // If the current end date is before the minimum end date, update it
    if (endDate < minimumEndDate) {
      setEndDate(minimumEndDate);
    }
  };

  const handleEndDateChange = (e) => {
    // check if the value is a valid date
    if (isNaN(Date.parse(e.target.value))) {
      setStartDate(null);
      setEndDate(null);
      setEndDateEnabled(false);
      return;
    }
    const endDate = new Date(e.target.value);
    setEndDate(endDate);
  };

  useEffect(() => {
    if (startDate) {
      setEndDateEnabled(true);
    } else {
      setEndDateEnabled(false);
    }
  });

  const today = new Date().toISOString().slice(0, 10);

  const handleImageChange = (e) => {
    const selectedImage = e.target.files[0];

    // Validate file type
    const allowedTypes = ["image/jpeg", "image/png", "image/jpg"];
    if (selectedImage && allowedTypes.includes(selectedImage.type)) {
      setEventData({ ...eventData, banner: selectedImage });
    } else {
      // Handle invalid file type
      setEventData({ ...eventData, banner: null });
      toast.error("Please select an image file (jpeg, jpg or png)");
    }
  };

  const onClosePopup = () => {
    setCategoryPopup(false);
    // validate the selected categories
    if (selectedCategories.length === 0) {
      setErrors({
        ...errors,
        categories: "Please select at least one category",
      });
    } else {
      setErrors({ ...errors, categories: "" });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (hasValues(errors)) {
      toast.error("Please fill all the required fields");
      return;
    }

    // Check if the user has selected at least one category
    if (selectedCategories.length === 0) {
      toast.error("Please select at least one category");
      return;
    }

    // create form data
    const formData = new FormData();
    formData.append("title", eventData.title);
    formData.append("description", eventData.description);
    formData.append("eventType", eventData.eventType);
    formData.append("discountAmount", eventData.discountAmount);
    formData.append("categories", selectedCategories);
    formData.append("couponCode", eventData.couponCode);
    formData.append("minPurchaseAmount", eventData.minPurchaseAmount);
    formData.append("visibility", eventData.visibility);
    formData.append("banner", eventData.banner);
    formData.append("termsAndConditions", eventData.termsAndConditions);
    formData.append("startDate", eventData.startDate);
    formData.append("endDate", eventData.endDate);

    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "multipart/form-data",
      },
    };

    // send the data to the backend
    try {
      setLoading(true);
      const res = await axios.post(`${server}/event/create`, formData, config);

      if (res.status === 201) {
        toast.success(res.data.message);
        // reset the form
        setEventData({
          title: "",
          description: "",
          eventType: "",
          discountAmount: 0,
          categories: [],
          couponCode: "",
          minPurchaseAmount: 0,
          visibility: "",
          banner: "",
          termsAndConditions: "",
          startDate: "",
          endDate: "",
        });
        setStartDate(null);
        setEndDate(null);
        setEndDateEnabled(false);
        setMinEndDate(null);
        setErrors({});
        setCategoryPopup(false);
      }
    } catch (error) {
      console.log(error);
      toast.error(error?.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white h-full shadow rounded-[4px] p-3 overflow-y-scroll relative">
      {loading && (
        <div className="absolute top-0 left-0 w-full h-full bg-white bg-opacity-50 flex items-center justify-center">
          <Loader />
        </div>
      )}
      <h5 className="text-[30px] font-Poppins text-center">Create Event</h5>
      {/* create event form */}
      <form onSubmit={(e) => handleSubmit(e)}>
        <br />
        <div>
          <label className="pb-2">
            Event Title <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            name="title"
            value={eventData.title}
            className="mt-2 appearance-none block w-full px-3 h-[35px] border border-gray-300 rounded-[3px] placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            onChange={(e) => handleOnChange(e)}
            placeholder="Enter a descriptive title for your event..."
          />
          {/* form control error */}
          {errors && errors.title && (
            <p className={styles.formInputError}>{errors.title}</p>
          )}
        </div>
        <br />
        <div>
          <label className="pb-2">
            Description <span className="text-red-500">*</span>
          </label>
          <textarea
            cols="30"
            required
            rows="8"
            type="text"
            name="description"
            value={eventData.description}
            className="mt-2 appearance-none block w-full pt-2 px-3 border border-gray-300 rounded-[3px] placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            onChange={(e) => {
              handleOnChange(e);
            }}
            placeholder="Provide a detailed description of your event, including key information and highlights..."
          ></textarea>
          {/* form control error */}
          {errors && errors.description && (
            <p className={styles.formInputError}>{errors.description}</p>
          )}
        </div>
        <br />
        <div>
          <label className="pb-2">
            Duration <span className="text-red-500">*</span>
          </label>
          <div className="flex">
            <input
              type="date"
              name="startDate"
              value={startDate ? startDate.toISOString().slice(0, 10) : ""}
              className="mr-2 appearance-none w-full px-3 h-[35px] border border-gray-300 rounded-[3px] placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              onChange={handleStartDateChange}
              min={today}
            />
            {/* form control error */}
            {errors && errors.startDate && (
              <p className={styles.formInputError}>{errors.startDate}</p>
            )}
            <input
              type="date"
              name="endDate"
              disabled={endDateEnabled ? false : true}
              value={endDate ? endDate.toISOString().slice(0, 10) : ""}
              className="ml-2 appearance-none w-full px-3 h-[35px] border border-gray-300 rounded-[3px] placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              onChange={handleEndDateChange}
              min={minEndDate}
            />
            {/* form control error */}
            {errors && errors.endDate && (
              <p className={styles.formInputError}>{errors.endDate}</p>
            )}
          </div>
          <small className="text-gray-500">
            Please ensure that the duration of your event is at least 3 days.
          </small>
        </div>

        <br />
        <div>
          <label className="block pb-2">
            Event Type <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <select
              name="eventType"
              className="w-full mt-2 border h-[35px] rounded-[5px] appearance-none focus:outline-none focus:ring focus:border-blue-500 px-3"
              value={eventData.eventType}
              onChange={(e) => {
                handleOnChange(e);
              }}
            >
              {allTypesOfEvents.map((type) => {
                return (
                  <option key={type} value={type}>
                    {type}
                  </option>
                );
              })}
            </select>
          </div>
          {/* form control error */}
          {errors && errors.eventType && (
            <p className={styles.formInputError}>{errors.eventType}</p>
          )}
        </div>

        <div>
          <label className="block mt-5 pb-2">
            Discount Amount <span className="text-red-500">*</span>
          </label>
          <input
            type="number"
            name="discountAmount"
            value={eventData.discountAmount}
            className="mt-2 appearance-none block w-full px-3 h-[35px] border border-gray-300 rounded-[3px] placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            onChange={(e) => {
              handleOnChange(e);
            }}
            placeholder="Enter your discount amount..."
          />
          {/* form control error */}
          {errors && errors.discountAmount && (
            <p className={styles.formInputError}>{errors.discountAmount}</p>
          )}
        </div>

        <br />

        <br />
        <div>
          <div
            onClick={() => setCategoryPopup(true)}
            type="button"
            className={Styles.button}
          >
            Select Applicable Categories
          </div>
          {/* form control error */}
          {errors && errors.categories && (
            <p className={styles.formInputError}>{errors.categories}</p>
          )}
        </div>
        <br />
        <div>
          <label className="pb-2">Coupon Code</label>
          <input
            type="text"
            name="couponCode"
            value={eventData.couponCode}
            className="mt-2 appearance-none block w-full px-3 h-[35px] border border-gray-300 rounded-[3px] placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            onChange={(e) => {
              handleOnChange(e);
            }}
            placeholder="Enter your coupon code..."
          />
        </div>
        <br />
        <div>
          <label className="pb-2">Minimum Purchase Amount</label>
          <input
            type="number"
            name="minPurchaseAmount"
            value={eventData.minPurchaseAmount}
            className="mt-2 appearance-none block w-full px-3 h-[35px] border border-gray-300 rounded-[3px] placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            onChange={(e) => {
              handleOnChange(e);
            }}
            placeholder="Enter your minimum purchase amount..."
          />
          {/* form control error */}
          {errors && errors.minPurchaseAmount && (
            <p className={styles.formInputError}>{errors.minPurchaseAmount}</p>
          )}
        </div>
        <br />
        <div>
          <label className="pb-2">Visibility</label>
          <select
            name="visibility"
            className="w-full mt-2 border h-[35px] rounded-[5px]"
            value={eventData.visibility}
            onChange={(e) => {
              handleOnChange(e);
            }}
          >
            {/* default option */}
            <option value="" selected>
              Select Visibility
            </option>
            {allTypesOfVisibility.map((visibility) => {
              return (
                <option key={visibility} value={visibility}>
                  {visibility}
                </option>
              );
            })}
          </select>
          {/* form control error */}
          {errors && errors.visibility && (
            <p className={styles.formInputError}>{errors.visibility}</p>
          )}
        </div>
        <br />
        <div>
          <label className="pb-2">Banner Image Upload</label>
          <input
            type="file"
            name="banner"
            id="banner-image-upload"
            accept=".jpg, .jpeg, .png"
            className="mt-2 appearance-none block w-full px-3 h-[35px] border border-gray-300 rounded-[3px] placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            onChange={handleImageChange}
          />
          {/* form control error */}
          {errors && errors.banner && (
            <p className={styles.formInputError}>{errors.banner}</p>
          )}
          <div className="w-full flex items-center flex-wrap mt-2">
            {/* Display preview image here if available */}
            <img
              src={
                eventData.banner
                  ? URL.createObjectURL(eventData.banner)
                  : bannerPlaceholder
              }
              alt="Banner Image Preview"
              className="w-[100px] h-[100px] object-cover mr-2"
            />
          </div>
        </div>
        <br />
        <div>
          <label className="pb-2">Terms and Conditions</label>
          <textarea
            cols="30"
            rows="4"
            type="text"
            name="termsAndConditions"
            value={eventData.termsAndConditions}
            className="mt-2 appearance-none block w-full pt-2 px-3 border border-gray-300 rounded-[3px] placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            onChange={(e) => {
              handleOnChange(e);
            }}
            placeholder="Enter your terms and conditions..."
          ></textarea>
          {/* form control error */}
          {errors && errors.termsAndConditions && (
            <p className={styles.formInputError}>{errors.termsAndConditions}</p>
          )}
        </div>
        <br />
        <div>
          <input
            type="submit"
            value="Create Event"
            className="mt-2 cursor-pointer appearance-none text-center block w-full px-3 h-[35px] border border-gray-300 rounded-[3px] placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
          />
        </div>
      </form>

      {/* select products modal */}
      {categoryPopup && <CategoryPopup onClose={onClosePopup} />}
    </div>
  );
};

export default CreateEvent;
