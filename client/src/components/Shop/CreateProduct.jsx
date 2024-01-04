import React, { useEffect, useState } from "react";
import { AiOutlinePlusCircle } from "react-icons/ai";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { categoriesData } from "../../static/categoriesData";
import { toast } from "react-toastify";
import axios from "axios";
import { server } from "../../server";
import STATUS from "../../constants/status";
import Loader from "../Loader";
import styles from "../../styles/styles";
import validateProduct from "../../validations/productValidation";
import { hasValues } from "../../utils/objectHelper";

const CreateProduct = () => {
  const { token } = useSelector((state) => state.user);
  const [status, setStatus] = useState(STATUS.IDLE);

  const navigate = useNavigate();

  const [images, setImages] = useState([]);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [tags, setTags] = useState("");
  const [originalPrice, setOriginalPrice] = useState();
  const [discountPrice, setDiscountPrice] = useState();
  const [stock, setStock] = useState();

  const [errors, setErrors] = useState({});
  const [isFormDisabled, setIsFormDisabled] = useState(true);

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);

    setImages(files);

    console.log(files);
  };

  const handleSubmit = async (e) => {
    setStatus(STATUS.LOADING);
    e.preventDefault();

    const newForm = new FormData();

    newForm.append("name", name);
    newForm.append("description", description);
    newForm.append("category", category);
    newForm.append("tags", tags);
    newForm.append("originalPrice", originalPrice);
    newForm.append("discountPrice", discountPrice);
    newForm.append("stock", stock);

    images.forEach((i) => {
      newForm.append("images", i);
    });

    const config = {
      headers: {
        "Content-Type": "multipart/form-data",
        Authorization: `Bearer ${token}`,
      },
    };

    try {
      //send axios request to create product
      const res = await axios.put(`${server}/product/create`, newForm, config);

      if (res.status === 201) {
        setStatus(STATUS.SUCCESS);
        toast.success(res.data.message);
        clearForm();
      }
    } catch (err) {
      setStatus(STATUS.FAILURE);
      console.log(err);
      toast.error(err?.response?.data?.message || "Something went wrong");
    }
  };

  const handleOriginalPriceChange = (e) => {
    const { value } = e.target;

    if (value < 0.99) {
      setErrors({ ...errors, originalPrice: "Minimum price 0.99USD" });
      setOriginalPrice(value);
      return;
    }

    if (value > 100000) {
      setErrors({
        ...errors,
        originalPrice: "Maximum price 100000USD",
      });
      setOriginalPrice(100000);
      return;
    }

    setErrors({ ...errors, originalPrice: "" });
    setOriginalPrice(value);
  };

  const handleDiscountPriceChange = (e) => {
    const { value } = e.target;

    if (value < 0.99) {
      setErrors({ ...errors, discountPrice: "Minimum price 0.99USD" });
      setDiscountPrice(value);
      return;
    }

    if (value > 100000) {
      setErrors({
        ...errors,
        discountPrice: "Maximum price 100000USD",
      });
      setDiscountPrice(100000);
      return;
    }

    if (Number(value) > Number(originalPrice)) {
      setErrors({
        ...errors,
        discountPrice: "Discount price can't be greater than original price",
      });
      setDiscountPrice(value);
      return;
    }

    setErrors({ ...errors, discountPrice: "" });
    setDiscountPrice(value);
  };

  const handleStockChange = (e) => {
    const { value } = e.target;

    if (value < 1) {
      setErrors({ ...errors, stock: "You must have a stock at least 1" });
      setStock(value);
      return;
    }

    if (value > 1000) {
      setErrors({
        ...errors,
        stock: "Stock can't be greater than 100000",
      });
      setStock(1000);
      return;
    }

    setErrors({ ...errors, stock: "" });
    setStock(value);
  };

  const onChangeHandler = async (e) => {
    const { name, value } = e.target;

    console.log(name, value);

    if (
      name === "originalPrice" ||
      name === "discountPrice" ||
      name === "stock"
    ) {
      if (value === "") {
        setErrors({ ...errors, [name]: "Price is required" });
        return;
      }

      if (value < 0) {
        setErrors({ ...errors, [name]: "Price can't be negative" });
        return;
      }

      if (value > 100000) {
        setErrors({
          ...errors,
          [name]: "Price can't be greater than 100000",
        });
        return;
      }

      setErrors({ ...errors, [name]: "" });
    } else {
      // validate form
      const validationError = await validateProduct(name, value);
      if (validationError) {
        setErrors({ ...errors, [name]: validationError });
      } else {
        setErrors({ ...errors, [name]: "" });
      }
    }

    // set the state
    switch (name) {
      case "name":
        setName(value);
        break;
      case "description":
        setDescription(value);
        break;
      case "category":
        setCategory(value);
        break;
      case "tags":
        setTags(value);
        break;
      case "originalPrice":
        setOriginalPrice(value);
        break;
      case "discountPrice":
        setDiscountPrice(value);
        break;
      case "stock":
        setStock(value);
        break;
      default:
        break;
    }

    console.log("errors are", errors);
  };
  const clearForm = () => {
    setName("");
    setDescription("");
    setCategory("");
    setTags("");
    setOriginalPrice("");
    setDiscountPrice("");
    setStock("");
    setImages([]);
  };

  useEffect(() => {
    if (
      hasValues(errors) ||
      !name ||
      !description ||
      !category ||
      !originalPrice ||
      !discountPrice ||
      !stock ||
      !images.length
    ) {
      setIsFormDisabled(true);
    } else {
      setIsFormDisabled(false);
    }
  }, [
    errors,
    name,
    description,
    category,
    originalPrice,
    discountPrice,
    stock,
    images,
  ]);

  return (
    <>
      <div className=" bg-white h-full shadow rounded-[4px] p-10">
        <h5 className="text-[30px] font-Poppins text-center">Create Product</h5>
        {/* description */}
        <p className="text-[#000000a6] text-center mt-2">
          Enter your product information. This information will be used to
          create your product. Please ensure that the information is correct.
        </p>
        {/* create product form */}
        <form
          onSubmit={handleSubmit}
          className="relative lg:grid lg:grid-cols-2 lg:gap-10 max-w-6xl mx-auto mt-20"
        >
          {status === STATUS.LOADING && (
            <div className="absolute top-0 left-0 w-full h-full z-10 bg-transparent bg-opacity-10 flex items-center justify-center">
              <Loader />
            </div>
          )}

          <div>
            <label className="pb-2">
              Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="name"
              value={name}
              className="mt-2 appearance-none block w-full px-3 h-[35px] border border-gray-300 rounded-[3px] placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              onChange={(e) => {
                onChangeHandler(e);
              }}
              placeholder="Enter your product name..."
            />
            {/* form control error */}
            {errors && errors.name && (
              <p className={styles.formInputError}>{errors.name}</p>
            )}
          </div>

          <div>
            <label className="pb-2">
              Category <span className="text-red-500">*</span>
            </label>
            <select
              name="category"
              className="w-full mt-2 border h-[35px] rounded-[5px]"
              value={category}
              onChange={(e) => onChangeHandler(e)}
            >
              <option value="">Select a category</option>
              {categoriesData &&
                categoriesData.map((i) => (
                  <option value={i.title} key={i.title}>
                    {i.title}
                  </option>
                ))}
            </select>
            {/* form control error */}
            {errors && errors.category && (
              <p className={styles.formInputError}>{errors.category}</p>
            )}
          </div>

          <div>
            <label className="pb-2">Tags</label>
            <input
              type="text"
              name="tags"
              value={tags}
              className="mt-2 appearance-none block w-full px-3 h-[35px] border border-gray-300 rounded-[3px] placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              onChange={(e) => onChangeHandler(e)}
              placeholder="E g. summer, new, sale..."
            />

            {/* form control error */}
            {errors && errors.tags && (
              <p className={styles.formInputError}>{errors.tags}</p>
            )}
          </div>

          <div>
            <label className="pb-2">Original Price</label>
            <input
              type="number"
              name="originalPrice"
              value={originalPrice}
              className="mt-2 appearance-none block w-full px-3 h-[35px] border border-gray-300 rounded-[3px] placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              onChange={(e) => handleOriginalPriceChange(e)}
              placeholder="Enter your product price..."
            />

            {/* form control error */}
            {errors && errors.originalPrice && (
              <p className={styles.formInputError}>{errors.originalPrice}</p>
            )}
          </div>

          <div>
            <label className="pb-2">
              Price (With Discount) <span className="text-red-500">*</span>
            </label>
            <input
              type="number"
              name="discountPrice"
              value={discountPrice}
              className="mt-2 appearance-none block w-full px-3 h-[35px] border border-gray-300 rounded-[3px] placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              onChange={(e) => handleDiscountPriceChange(e)}
              placeholder="Enter your product price with discount..."
            />

            {/* form control error */}
            {errors && errors.discountPrice && (
              <p className={styles.formInputError}>{errors.discountPrice}</p>
            )}
          </div>

          <div>
            <label className="pb-2">
              Product Stock <span className="text-red-500">*</span>
            </label>
            <input
              type="number"
              name="stock"
              value={stock}
              className="mt-2 appearance-none block w-full px-3 h-[35px] border border-gray-300 rounded-[3px] placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              onChange={(e) => handleStockChange(e)}
              placeholder="Enter your product stock..."
            />

            {/* form control error */}
            {errors && errors.stock && (
              <p className={styles.formInputError}>{errors.stock}</p>
            )}
          </div>
          <div>
            <label className="pb-2">
              Description <span className="text-red-500">*</span>
            </label>
            <textarea
              cols="30"
              rows="15"
              type="text"
              name="description"
              value={description}
              className="mt-2 appearance-none block w-full pt-2 px-3 border border-gray-300 rounded-[3px] placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              onChange={(e) => onChangeHandler(e)}
              placeholder="Enter your product description..."
            ></textarea>

            {/* form control error */}
            {errors && errors.description && (
              <p className={styles.formInputError}>{errors.description}</p>
            )}
          </div>
          <div className="">
            <label className="pb-2">
              Upload Images <span className="text-red-500">*</span>
            </label>
            <input
              type="file"
              name="images"
              id="upload"
              className="hidden"
              multiple
              onChange={handleImageChange}
            />
            <div className="w-full flex items-center flex-wrap ml-0 m-2">
              <label
                htmlFor="upload"
                className="border-2 rounded-md border-dashed p-11"
              >
                <AiOutlinePlusCircle size={30} className="" color="#555" />
              </label>
              {images &&
                images.map((i, index) => (
                  <img
                    src={URL.createObjectURL(i)}
                    key={index}
                    alt=""
                    className="h-[120px] w-[120px] object-cover m-2"
                  />
                ))}
            </div>

            <div className="mt-10">
              <input
                type="submit"
                value="Create"
                className={
                  isFormDisabled
                    ? `${styles.buttonDisabled} ${styles.buttonPrimary}`
                    : styles.buttonPrimary
                }
              />
            </div>
          </div>
        </form>
      </div>
    </>
  );
};

export default CreateProduct;
