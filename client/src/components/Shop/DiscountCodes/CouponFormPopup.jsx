import React, { useEffect } from "react";
import { useCreateCouponContext } from "../../../contexts/CreateCouponContext";
import Loader from "../../Loader";
import styles from "../../../styles/styles";
import { RxCross1 } from "react-icons/rx";
import validateCouponData from "../../../validations/couponValidation";
import { hasValues } from "../../../utils/objectHelper";
import { toast } from "react-toastify";
import { useSelector } from "react-redux";
import { server } from "../../../server";
import axios from "axios";

const CouponFormPopup = ({ setOpen }) => {
  const { token } = useSelector((state) => state.user);
  const { shop } = useSelector((state) => state.shop);
  const {
    couponData,
    setCouponData,
    errors,
    setErrors,
    allCouponTypes,
    allCategoriesData,
  } = useCreateCouponContext();
  const [loading, setLoading] = React.useState(false);

  const [allCategories, setAllCategories] = React.useState([]);
  const [selectedCategories, setSelectedCategories] = React.useState([]);

  const { allCoupons, setAllCoupons } = useCreateCouponContext();

  useEffect(() => {
    setLoading(true);
    if (allCategoriesData.length > 0) {
      setAllCategories(allCategoriesData);
    }
    setLoading(false);

    // Get the current date
    const currentDate = new Date();

    // Calculate the minimum date (next day)
    currentDate.setDate(currentDate.getDate() + 1);
    const minDate = currentDate.toISOString().split("T")[0]; // Format as YYYY-MM-DD

    // Set the minimum date for the input field
    document.getElementById("expirationDate").min = minDate;
    document.getElementById("startDate").min = minDate;
  }, []);

  const handleCategorySelect = (category) => {
    // Check if the category is not already selected
    if (!selectedCategories.includes(category)) {
      setSelectedCategories([...selectedCategories, category]);
    }
  };

  const handleRemoveCategory = (category) => {
    setSelectedCategories((prevCategories) =>
      prevCategories.filter((c) => c !== category)
    );
  };

  useEffect(() => {
    setCouponData({ ...couponData, categories: selectedCategories });
  }, [selectedCategories]);

  const validateInput = async (name, value) => {
    // Validate the input asynchronously
    try {
      const error = await validateCouponData(name, value);
      return error;
    } catch (error) {
      console.error("Error during validation:", error);
      return "An error occurred during validation";
    }
  };

  const handleOnChange = async (e) => {
    const { name, value } = e.target;

    if (
      name === "discountAmount" ||
      name === "maxDiscountAmount" ||
      name === "minOrderAmount"
    ) {
      if (value === "" || value === null || value === undefined) {
        setCouponData({ ...couponData, [name]: "" });
        setErrors({ ...errors, [name]: "Please enter a valid number" });
        return;
      }
    }

    if (name === "type") {
      if (value === "") {
        setCouponData({ ...couponData, [name]: "" });
        setErrors({ ...errors, [name]: "Please select a coupon type" });
        return;
      }

      // clear discount amount and max discount amount and min order amount if type is changed
      setCouponData({
        ...couponData,
        [name]: value,
        discountAmount: "",
        maxDiscountAmount: "",
        minOrderAmount: "",
      });
      setErrors({
        ...errors,
        maxDiscountAmount: "",
        minOrderAmount: "",
        discountAmount: "",
      });
      return;
    }

    // update coupon data
    setCouponData({ ...couponData, [name]: value });

    // validate input
    const validationError = await validateInput(name, value);

    console.log(validationError);

    if (validationError) {
      setErrors({ ...errors, [name]: validationError });
    } else {
      setErrors({ ...errors, [name]: "" });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (hasValues(errors)) {
      toast.error("Please fill all the required fields");
      return;
    }

    const newFormData = new FormData();

    newFormData.append("shopId", shop._id);
    newFormData.append("code", couponData.code);
    newFormData.append("type", couponData.type);
    newFormData.append("discountAmount", couponData.discountAmount);
    newFormData.append("maxDiscountAmount", couponData.maxDiscountAmount);
    newFormData.append("minOrderAmount", couponData.minOrderAmount);
    newFormData.append("expirationDate", couponData.expirationDate);
    newFormData.append("startDate", couponData.startDate);
    newFormData.append("categories", couponData.categories);

    setLoading(true);

    // send axios request to create coupon
    try {
      const config = {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      };

      const res = await axios.post(
        `${server}/coupon/create`,
        newFormData,
        config,
        {
          withCredentials: true,
        }
      );

      if (res.status === 201) {
        toast.success("Coupon created successfully");
        setAllCoupons([...allCoupons, res.data.coupon]);
        setOpen(false);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    // JSX code goes here
    <div className="bg-white shadow rounded-[4px] p-3 relative">
      {loading && (
        <div className="absolute top-0 left-0 w-full h-full bg-white bg-opacity-50 flex items-center justify-center">
          <Loader />
        </div>
      )}
      <h5 className="text-[30px] font-Poppins text-center">Create Coupon</h5>
      {/* create Coupon form */}
      <form onSubmit={(e) => handleSubmit(e)}>
        {/* coupon code */}
        <div>
          <label className="pb-2">
            Coupon Code <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            name="code"
            value={couponData.code}
            className="mt-2 appearance-none block w-full px-3 h-[35px] border border-gray-300 rounded-[3px] placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            onChange={(e) => handleOnChange(e)}
            placeholder="Enter your coupon code... (e.g. 10OFF)"
          />
          {/* form control error */}
          {errors && errors.code && (
            <p className={styles.formInputError}>{errors.code}</p>
          )}
        </div>
        {/* Select Coupon Type */}
        <div className="mt-5">
          <label className="pb-2">
            Coupon Type <span className="text-red-500">*</span>
          </label>
          <select
            name="type"
            value={couponData.type}
            onChange={(e) => handleOnChange(e)}
            className="w-full h-[35px] border border-gray-300 rounded-[3px]"
          >
            <option value="">Select Coupon Type</option>
            {allCouponTypes.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>
        </div>

        {couponData.type === "Percentage Off" && (
          <div className="mt-5">
            <label className="pb-2">
              Discount Percentage <span className="text-red-500">*</span>
            </label>
            <p className="text-sm text-gray-500 mt-1">
              Set the percentage of discount from the original price.
            </p>
            <input
              type="number"
              name="discountAmount"
              value={couponData.discountAmount}
              onChange={(e) => handleOnChange(e)}
              className="mt-2 appearance-none block w-full px-3 h-[35px] border border-gray-300 rounded-[3px] placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              placeholder="Enter discount percentage..."
            />

            {/* form control error */}
            {errors && errors.discountAmount && (
              <p className={styles.formInputError}>{errors.discountAmount}</p>
            )}
          </div>
        )}

        {/* if Percentage Off enter set the maximum amout of discount */}
        {couponData.type === "Percentage Off" && (
          <div className="mt-5">
            <label className="pb-2">
              Maximum Discount Amount (USD){" "}
              <span className="text-red-500">*</span>
            </label>
            <p className="text-sm text-gray-500 mt-1">
              Set the maximum amount of discount in USD.
            </p>
            <input
              type="number"
              name="maxDiscountAmount"
              value={couponData.maxDiscountAmount}
              onChange={(e) => handleOnChange(e)}
              className="mt-2 appearance-none block w-full px-3 h-[35px] border border-gray-300 rounded-[3px] placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              placeholder="Enter maximum discount amount in USD..."
            />
            {/* form control error */}
            {errors && errors.maxDiscountAmount && (
              <p className={styles.formInputError}>
                {errors.maxDiscountAmount}
              </p>
            )}
          </div>
        )}

        {couponData.type === "Fixed Amount Off" && (
          <div className="mt-5">
            <label className="pb-2">
              Discount Amount (USD) <span className="text-red-500">*</span>
            </label>
            <p className="text-sm text-gray-500 mt-1">
              Set the fixed amount of discount in USD.
            </p>
            <input
              type="number"
              name="discountAmount"
              value={couponData.discountAmount}
              onChange={(e) => handleOnChange(e)}
              className="mt-2 appearance-none block w-full px-3 h-[35px] border border-gray-300 rounded-[3px] placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              placeholder="Enter discount amount in USD..."
            />

            {/* form control error */}
            {errors && errors.discountAmount && (
              <p className={styles.formInputError}>{errors.discountAmount}</p>
            )}
          </div>
        )}

        {/* set minimum purchase price for apply coupon */}
        <div className="mt-5">
          <label className="pb-2">
            Minimum Purchase Price (USD) <span className="text-red-500">*</span>
          </label>
          <p className="text-sm text-gray-500 mt-1">
            Set the minimum purchase price for apply coupon.
          </p>
          <input
            type="number"
            name="minOrderAmount"
            value={couponData.minOrderAmount}
            onChange={(e) => handleOnChange(e)}
            className="mt-2 appearance-none block w-full px-3 h-[35px] border border-gray-300 rounded-[3px] placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            placeholder="Enter minimum purchase price in USD..."
          />

          {/* form control error */}
          {errors && errors.minOrderAmount && (
            <p className={styles.formInputError}>{errors.minOrderAmount}</p>
          )}
        </div>

        {/* set expiration date and start date */}
        <div className="mt-5">
          <label className="pb-2">
            Expiration Date <span className="text-red-500">*</span>
          </label>
          <input
            id="expirationDate"
            type="date"
            name="expirationDate"
            value={couponData.expirationDate}
            onChange={(e) => handleOnChange(e)}
            className="mt-2 appearance-none block w-full px-3 h-[35px] border border-gray-300 rounded-[3px] placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
          />
          {/* form control error */}
          {errors && errors.expirationDate && (
            <p className={styles.formInputError}>{errors.expirationDate}</p>
          )}
        </div>
        <div className="mt-5">
          <label className="pb-2">
            Start Date <span className="text-red-500">*</span>
          </label>
          <input
            id="startDate"
            type="date"
            name="startDate"
            value={couponData.startDate}
            onChange={(e) => handleOnChange(e)}
            className="mt-2 appearance-none block w-full px-3 h-[35px] border border-gray-300 rounded-[3px] placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
          />
          {/* form control error */}
          {errors && errors.startDate && (
            <p className={styles.formInputError}>{errors.startDate}</p>
          )}
        </div>
        {/* Categories selection */}
        <div className="bg-white rounded py-5 my-2">
          <h2 className=" mb-4">Select Category</h2>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">
              Categories
            </label>
            <select
              onChange={(e) => handleCategorySelect(e.target.value)}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            >
              <option value="" disabled>
                Select a category
              </option>
              {allCategories?.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </div>
          {selectedCategories.length > 0 && (
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">
                Selected Categories
              </label>
              <ul className="mt-1">
                {selectedCategories?.map((category) => (
                  <li key={category} className="flex items-center py-1">
                    <div className="flex justify-between items-center w-full">
                      <div className="mr-2">{category}</div>
                      <button
                        type="button"
                        className=""
                        onClick={(e) => {
                          handleRemoveCategory(category);
                        }}
                      >
                        <RxCross1 size={20} />
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {/* close and save buttons */}
        <div className="flex justify-end gap-4">
          <button
            type="button"
            onClick={() => {
              setOpen(false);
            }}
            className={styles.buttonSecondary}
          >
            Close
          </button>
          <button type="submit" className={styles.button}>
            Save
          </button>
        </div>
      </form>
    </div>
  );
};

export default CouponFormPopup;
