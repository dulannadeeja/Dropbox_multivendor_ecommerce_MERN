import React, { useEffect, useState } from "react";
import {
  AiFillHeart,
  AiOutlineHeart,
  AiOutlineMessage,
  AiOutlineShoppingCart,
} from "react-icons/ai";
import { Link, useNavigate } from "react-router-dom";
import styles from "../../styles/styles";
import { useSelector } from "react-redux";
import { addToCart } from "../../redux/actions/addToCart";
import { useDispatch } from "react-redux";
import { server } from "../../server";
import ProductDetailsInfo from "./ProductInfo";
const ProductDetails = () => {
  const dispatch = useDispatch();
  const { product: data } = useSelector((state) => state.product);
  const { isAuthenticated } = useSelector((state) => state.user);
  const { user } = useSelector((state) => state);

  const [count, setCount] = useState(1);
  const [click, setClick] = useState(false);
  const [select, setSelect] = useState(0);
  const navigate = useNavigate();

  const incrementCount = () => {
    setCount(count + 1);
  };

  const decrementCount = () => {
    if (count > 1) {
      setCount(count - 1);
    }
  };

  const handleDeleteFromWishlist = async (product) => {
    try {
      await dispatch({ type: "DeleteFromWishlist", payload: { ...product } });
      setClick(false);
    } catch (err) {
      console.log(err);
      setClick(true);
    }
  };

  const handleAddToWishlist = async (product) => {
    try {
      await dispatch({ type: "AddToWishlist", payload: { ...product } });
      setClick(true);
    } catch (err) {
      console.log(err);
      setClick(false);
    }
  };

  const handleAddToCart = async (product) => {
    console.log(product);
    try {
      await dispatch(addToCart({ product, quantity: count }));
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="py-10 pt-20 max-w-6xl mx-auto">
      {data ? (
        <div>
          <div className="block w-full md:grid md:grid-cols-2 gap-10 max-w-6xl mx-auto">
            <div className="w-full">
              <img
                src={`${server}/${data?.images[select]?.url}`}
                alt=""
                className="w-[100%] aspect-square object-cover"
              />
              <div className="w-full grid grid-cols-4">
                {data &&
                  data.images.map((i, index) => (
                    <div
                      key={index}
                      className={`${
                        select === 0 ? "border" : "null"
                      } cursor-pointer`}
                    >
                      <img
                        src={`${server}/${i?.url}`}
                        alt=""
                        className="w-[100%] aspect-square object-cover border-2 border-white hover:border-gray-300"
                        onClick={() => setSelect(index)}
                      />
                    </div>
                  ))}
                <div
                  className={`${
                    select === 1 ? "border" : "null"
                  } cursor-pointer`}
                ></div>
              </div>
            </div>
            <div className="w-full pt-5">
              <h1 className={`${styles.productTitle}`}>{data.name}</h1>
              <p>{data.description}</p>
              <div className="flex pt-3">
                <h4 className={`${styles.productDiscountPrice}`}>
                  {data.discountPrice}$
                </h4>
                <h3 className={`${styles.price}`}>
                  {data.originalPrice ? data.originalPrice + "$" : null}
                </h3>
              </div>

              <div className="flex items-center mt-12 justify-between pr-3 gap-3">
                <div className="flex gap-2">
                  <button
                    className="bg-gradient-to-r from-teal-400 to-teal-500 text-white font-bold rounded-l px-4 py-2 shadow-lg hover:opacity-75 transition duration-300 ease-in-out"
                    onClick={decrementCount}
                  >
                    -
                  </button>
                  <span className="bg-gray-200 text-gray-800 font-medium px-4 py-[11px]">
                    {count}
                  </span>
                  <button
                    className="bg-gradient-to-r from-teal-400 to-teal-500 text-white font-bold rounded-l px-4 py-2 shadow-lg hover:opacity-75 transition duration-300 ease-in-out"
                    onClick={incrementCount}
                  >
                    +
                  </button>
                </div>
                <div>
                  {click ? (
                    <AiFillHeart
                      size={30}
                      className="cursor-pointer"
                      onClick={() => handleDeleteFromWishlist(data)}
                      color={click ? "red" : "#333"}
                      title="Remove from wishlist"
                    />
                  ) : (
                    <AiOutlineHeart
                      size={30}
                      className="cursor-pointer"
                      onClick={() => handleAddToWishlist(data)}
                      color={click ? "red" : "#333"}
                      title="Add to wishlist"
                    />
                  )}
                </div>
              </div>
              <div
                className={`${styles.buttonPrimary} !mt-6 !rounded !h-11 flex items-center`}
                onClick={() => handleAddToCart(data)}
              >
                <span className="text-white flex items-center">
                  Add to cart{" "}
                  <AiOutlineShoppingCart className="ml-2" size={20} />
                </span>
              </div>
              <div className="flex items-center pt-8">
                <Link to={`/shop/preview/${data?.shop._id}`}>
                  <img
                    src={
                      data?.shop?.shopAvatar
                        ? `${server}/${data?.shop?.shopAvatar}`
                        : "../../../assets/placeholders/7309681.jpg"
                    }
                    alt=""
                    className="w-[50px] h-[50px] rounded-full mr-2"
                  />
                </Link>
                <div className="pr-8">
                  <Link to={`/shop/preview/${data?.shop._id}`}>
                    <h3 className={`${styles.shop_name} pb-1 pt-1`}>
                      {data.shop.name}
                    </h3>
                  </Link>
                  <h5 className="pb-3 text-[15px]">
                    ({data.shop?.rating ? data.shop?.rating : 0}) Ratings
                  </h5>
                </div>
                <div
                  className={`${styles.button} bg-[#6443d1] mt-4 !rounded !h-11`}
                >
                  <span className="text-white flex items-center">
                    Send Message <AiOutlineMessage className="ml-1" />
                  </span>
                </div>
              </div>
            </div>
          </div>
          <ProductDetailsInfo product={data} />
          <br />
          <br />
        </div>
      ) : null}
    </div>
  );
};

export default ProductDetails;
