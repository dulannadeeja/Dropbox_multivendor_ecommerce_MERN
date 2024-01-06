import React, { useEffect, useState, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { toast } from "react-toastify";
import Styles from "../../../styles/styles";
import CategoryPopup from "./CategoryPopup";
import bannerPlaceholder from "../../../assets/placeholders/icons8-placeholder-48.png";
import { useCreateEventContext } from "../../../contexts/CreateEventContext";
import validateEventData from "../../../validations/eventDataValidation";
import styles from "../../../styles/styles";
import { hasValues } from "../../../utils/objectHelper";
import Loader from "../../Loader";
import axios from "axios";
import { useSelector } from "react-redux";
import { server } from "../../../server";
import { loadShopProducts } from "../../../redux/actions/loadShopProducts";
import { useDispatch } from "react-redux";
import { AiOutlineSearch } from "react-icons/ai";

const CreateEvent = ({ setActive }) => {
  const dispatch = useDispatch();
  const { token } = useSelector((state) => state.user);
  const { shop, products } = useSelector((state) => state.shop);

  // loaded data variables
  const [allCoupons, setAllCoupons] = useState([]);

  //eventData variables
  const [title, setTitle] = useState("");
  const [coupon, setCoupon] = useState({});
  const [product, setProduct] = useState({});
  const [description, setDescription] = useState("");
  const [termsAndConditions, setTermsAndConditions] = useState("");
  const [bannerImage, setBannerImage] = useState("");

  // form control variables
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [isSubmitAllowed, setIsSubmitAllowed] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [productSearchDisabled, setProductSearchDisabled] = useState(true);

  useEffect(() => {
    fetchAllCoupons();
    fetchAllProducts();
  }, []);

  //fetch all products
  const fetchAllProducts = async () => {
    setLoading(true);
    try {
      dispatch(loadShopProducts({ shopId: shop._id }));
      console.log("products: ", products);
    } catch (error) {
      toast.error(error?.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  // fetch all the coupons
  const fetchAllCoupons = async () => {
    setLoading(true);
    try {
      const config = {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      };

      const res = await axios.get(`${server}/coupon/all/${shop._id}`, config, {
        withCredentials: true,
      });

      if (res.status === 200) {
        setAllCoupons(res.data.coupons);
        console.log(res.data);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (searchTerm) {
      const results = products.filter((product) =>
        product.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setSearchResults(results);
    } else {
      setSearchResults([]);
    }
    console.log("search results: ", searchResults);
  }, [searchTerm]);

  useEffect(() => {
    if (
      title !== "" &&
      coupon &&
      coupon._id &&
      description !== "" &&
      termsAndConditions !== "" &&
      bannerImage &&
      product &&
      product._id
    ) {
      setIsSubmitAllowed(true);
    } else {
      setIsSubmitAllowed(false);
    }

    if (hasValues(errors)) {
      setIsSubmitAllowed(false);
    }

    console.log("is submit allowed: ", isSubmitAllowed);
    console.log("errors: ", errors);
    console.log("coupon: ", coupon);
    console.log("product: ", product);
    console.log("bannerImage: ", bannerImage);
    console.log("title: ", title);
    console.log("description: ", description);
    console.log("termsAndConditions: ", termsAndConditions);
  }, [title, coupon, product, description, termsAndConditions, bannerImage]);

  const onDropBanner = useCallback((acceptedFiles) => {
    setBannerImage(acceptedFiles[0]);
  }, []);

  const bannerDropzone = useDropzone({
    onDrop: onDropBanner,
    accept: "image/*",
  });

  const onProductSelect = (product) => {
    setProduct(product);
    setSearchTerm("");
    handleOnInputChange({ name: "product", value: product._id });
  };

  const handleCouponChange = (e) => {
    const couponId = e.target.value;
    const coupon = allCoupons.find((coupon) => coupon._id === couponId);
    setCoupon(coupon);
    setProduct({});
    handleOnInputChange({ name: "coupon", value: coupon ? coupon._id : "" });
  };

  useEffect(() => {
    if (!coupon) {
      setProductSearchDisabled(true);
    } else {
      setProductSearchDisabled(false);
    }
  }, [coupon]);

  const handleOnInputChange = async ({ name, value }) => {
    // validate the input
    const error = await validateEventData(name, value);

    // if error is present then set the error else set the value
    if (error) {
      setErrors({ ...errors, [name]: error });
    } else {
      setErrors({ ...errors, [name]: "" });
    }

    // set the value
    if (name === "title") {
      setTitle(value);
    }
    if (name === "description") {
      setDescription(value);
    }
    if (name === "termsAndConditions") {
      setTermsAndConditions(value);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const config = {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
      };

      const formData = new FormData();
      formData.append("title", title);
      formData.append("description", description);
      formData.append("termsAndConditions", termsAndConditions);
      formData.append("eventBanner", bannerImage);
      formData.append("coupon", coupon._id);
      formData.append("product", product._id);

      const res = await axios.post(
        `${server}/event/create/`,
        formData,
        config,
        {
          withCredentials: true,
        }
      );

      if (res.status === 201) {
        toast.success("Event created successfully");
        setActive(5);
      }
    } catch (error) {
      toast.error(error?.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white h-full shadow rounded-[4px] p-3 overflow-y-scroll relative">
      {/* if coupons not found notify user to create a coupon first */}
      {allCoupons && allCoupons.length === 0 && (
        <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-8 rounded-md text-center max-w-xs md:max-w-md ">
            <p className="text-lg font-semibold mb-4">
              Welcome! It looks like you haven't created any coupon codes yet.
            </p>
            <p className="text-gray-600 mb-4">
              To create an event, you need to generate a coupon code first. You
              can do this by clicking the "Generate New" button Below, or you
              can go to the dashboard and then go to discount codes section for
              create a coupon code from there.
            </p>
            <button
              className={styles.buttonPrimary}
              onClick={() => {
                setActive(9);
              }}
            >
              Generate New Coupon
            </button>
          </div>
        </div>
      )}
      {loading && (
        <div className="absolute top-0 left-0 w-full h-full bg-white bg-opacity-50 flex items-center justify-center">
          <Loader />
        </div>
      )}
      <h5 className="text-[30px] font-Poppins text-center mt-5">
        Create Event
      </h5>
      {/* description */}
      <p className="text-gray-500 text-center mt-2 max-w-2xl mx-auto">
        Need high visibility for your products? Create an event and get more and
        more customers. You can create an event for a single product.
      </p>
      {/* create event form */}
      <form
        onSubmit={(e) => handleSubmit(e)}
        className="grid gap-10 mt-10 lg:grid-cols-2 md:max-w-2xl mx-auto lg:max-w-4xl"
      >
        {/* Event title */}
        <div>
          <label className="pb-2">
            Event Title <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            name="title"
            value={title}
            onChange={(e) => {
              handleOnInputChange({
                name: e.target.name,
                value: e.target.value,
              });
            }}
            className="mt-2 appearance-none block w-full px-3 h-[35px] border border-gray-300 rounded-[3px] placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            placeholder="e.g. 50% off on all products"
          />
          {/* form control error */}
          {errors && errors.title && (
            <p className={styles.formInputError}>{errors.title}</p>
          )}
        </div>

        {/* Coupon code selection from all the coupons */}
        <div className="">
          <label className="pb-2">
            Coupon Code <span className="text-red-500">*</span>
          </label>
          <select
            name="coupon"
            value={coupon && coupon._id}
            onChange={(e) => handleCouponChange(e)}
            className="mt-2 appearance-none block w-full px-3 h-[35px] border border-gray-300 rounded-[3px] placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
          >
            <option value="">Select a coupon code</option>
            {allCoupons && allCoupons.length > 0 && (
              <>
                {allCoupons.map((coupon) => {
                  return (
                    <option value={coupon._id} key={coupon._id}>
                      {coupon.code}
                    </option>
                  );
                })}
              </>
            )}
          </select>

          {/* form control error */}
          {errors && errors.coupon && (
            <p className={styles.formInputError}>{errors.coupon}</p>
          )}

          {/* selected coupon details */}
          {coupon && coupon._id && (
            <div className="mt-4 py-4 px-4 min-w-full justify-between gap-4 inline-flex items-center rounded-md bg-blue-50 text-xs font-medium text-blue-700 ring-1 ring-inset ring-blue-700/10">
              <p className="text-sm">
                Coupon applied -
                {coupon.code.replace(/\b\w/g, (l) => l.toUpperCase())}
              </p>
              {/* coupon details */}
              {coupon.type === "percentage" ? (
                <p className="text-sm">
                  Offer - {coupon.discountAmount}% off on all products
                </p>
              ) : (
                <p className="text-sm">
                  Offer-
                  <span className="text-red-500 font-bold">
                    {coupon.discountAmount}USD
                  </span>{" "}
                  off on all products
                </p>
              )}
              {/* start from */}
              <p className="text-sm">
                Start from - {new Date(coupon.startDate).toLocaleDateString()}
              </p>

              {/* coupon validity */}
              <p className="text-sm">
                Valid till -{" "}
                {new Date(coupon.expirationDate).toLocaleDateString()}
              </p>
            </div>
          )}

          {/* form control error */}
          {errors && errors.couponCode && (
            <p className={styles.formInputError}>{errors.couponCode}</p>
          )}
        </div>

        {/* search a product from all products */}
        <div className="lg:col-span-2 w-full">
          <div className="relative" id="searchBar">
            <input
              disabled={productSearchDisabled}
              type="text"
              placeholder="Search Product..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
              }}
              className={
                productSearchDisabled
                  ? "h-[40px] w-full px-[10px] py-[5px] rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400 bg-slate-100"
                  : "h-[40px] w-full px-[10px] py-[5px] rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400"
              }
            />
            <AiOutlineSearch
              size={30}
              className="absolute top-1.5 right-2 text-gray-400 cursor-pointer hover:text-gray-600 transition-all duration-300 ease-in-out"
            />

            {/* form control error */}
            {errors && errors.product && (
              <p className={styles.formInputError}>{errors.product}</p>
            )}

            {searchTerm && searchTerm.length !== 0 && (
              <div
                id="searchDropdown"
                className="absolute top-[40px] left-0 w-full bg-white rounded-md shadow-md border border-gray-300 p-4 z-50 overflow-auto max-h-[calc(100vh-48px)]"
              >
                {searchResults.map((product, index) => (
                  <div
                    key={product._id}
                    className="cursor-pointer hover:bg-gray-200 transition-all duration-300 ease-in-out flex items-center gap-4 py-3 px-2"
                    onClick={() => onProductSelect(product)}
                  >
                    <img
                      src={product.images[0].url}
                      alt={product.images[0].name}
                      className="h-10 w-10 object-cover rounded-md"
                    />
                    <span className="text-sm font-medium">
                      {product.name.replace(/\b\w/g, (l) => l.toUpperCase())}
                    </span>
                  </div>
                ))}
              </div>
            )}

            {/* selected product */}
            {product && coupon && product._id && (
              <div className="mt-4 py-4 px-4 gap-4 inline-flex items-center rounded-md bg-blue-50 text-xs font-medium text-blue-700 ring-1 ring-inset ring-blue-700/10">
                <div className="w-20 h-20 rounded overflow-hidden">
                  <img
                    src={`${server}/${product.images[0].url}`}
                    alt={product.images[0].name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <p className="text-sm">
                  {product.name.replace(/\b\w/g, (l) => l.toUpperCase())}
                </p>
                {/* price and offer */}
                <p className="text-sm">
                  Price -{" "}
                  <span className="text-red-500 font-bold">
                    {product.discountPrice}USD
                  </span>
                </p>
                <p className="text-sm">
                  Offer -{" "}
                  <span className="text-red-500 font-bold">
                    {coupon.discountAmount}USD
                  </span>
                </p>
                {/* price after discount */}
                <p className="text-sm">
                  Price after discount -{" "}
                  <span className="text-red-500 font-bold">
                    {product.discountPrice - coupon.discountAmount}USD
                  </span>
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Description */}
        <div className="lg:col-span-2">
          <label className="pb-2">
            Description <span className="text-red-500">*</span>
          </label>
          <textarea
            cols="30"
            required
            rows="8"
            type="text"
            name="description"
            value={description}
            className="mt-2 appearance-none block w-full pt-2 px-3 border border-gray-300 rounded-[3px] placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            onChange={(e) => {
              handleOnInputChange({
                name: e.target.name,
                value: e.target.value,
              });
            }}
            placeholder="Provide a detailed description of your event, including key information and highlights..."
          ></textarea>
          {/* form control error */}
          {errors && errors.description && (
            <p className={styles.formInputError}>{errors.description}</p>
          )}
        </div>
        {/* terms and conditions */}
        <div className="lg:col-span-2">
          <label className="pb-2">Terms and Conditions</label>
          <textarea
            cols="30"
            rows="8"
            type="text"
            name="termsAndConditions"
            value={termsAndConditions}
            className="mt-2 appearance-none block w-full pt-2 px-3 border border-gray-300 rounded-[3px] placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            onChange={(e) => {
              handleOnInputChange({
                name: e.target.name,
                value: e.target.value,
              });
            }}
            placeholder="Enter your terms and conditions..."
          ></textarea>
          {/* form control error */}
          {errors && errors.termsAndConditions && (
            <p className={styles.formInputError}>{errors.termsAndConditions}</p>
          )}
        </div>
        {/* banner dropzone */}
        <div className="">
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
        </div>
        {/* submit button */}
        <div className="w-40 mx-auto self-center">
          <input
            type="submit"
            value="Create Event"
            className={
              isSubmitAllowed
                ? Styles.buttonPrimary
                : `${Styles.buttonDisabled} ${Styles.buttonPrimary}`
            }
          />
        </div>
      </form>
    </div>
  );
};

export default CreateEvent;
