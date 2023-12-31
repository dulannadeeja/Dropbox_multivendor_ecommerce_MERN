import React, { useEffect, useState } from "react";
import {
  AiFillHeart,
  AiOutlineHeart,
  AiOutlineMessage,
  AiOutlineShoppingCart,
} from "react-icons/ai";
import { RxCross1 } from "react-icons/rx";
import { Link } from "react-router-dom";
import styles from "../../styles/styles";
import { useDispatch } from "react-redux";
import { addToCart } from "../../redux/actions/addToCart";

const ProductDetailsCard = ({ setView, product }) => {
  useEffect(() => {
    console.log(product);
  }, [product]);

  const dispatch = useDispatch();
  const [count, setCount] = useState(1);
  const [click, setClick] = useState(false);

  const handleAddToWishlist = async (product) => {
    try {
      await dispatch({ type: "AddToWishlist", payload: { ...product } });
      setClick(true);
    } catch (err) {
      console.log(err);
      setClick(false);
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

  const handleAddToCart = async (product) => {
    console.log(product);
    try {
      await dispatch(addToCart({ product, quantity: count }));
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="bg-[#fff]">
      {product ? (
        <div className="fixed w-full h-screen top-0 left-0 bg-[#00000030] z-40 flex items-center justify-center">
          <div className="w-[90%] 800px:w-[60%] h-[90vh] overflow-y-scroll 800px:h-[75vh] bg-white rounded-md shadow-sm relative p-4">
            <RxCross1
              size={30}
              className="absolute right-3 top-3 z-50"
              onClick={() => setView(false)}
            />

            <div className="block w-full 800px:flex">
              <div className="w-full 800px:w-[50%]">
                <img src={`${product.images[0]?.url}`} alt="" />
                <div className="flex">
                  <Link to={`/shop/preview/data.shop?.name`} className="flex">
                    <img
                      src={`${product.shop.shopAvatar}`}
                      alt=""
                      className="w-[50px] h-[50px] rounded-full mr-2"
                    />
                    <div>
                      <h3 className={`${styles.shop_name}`}>
                        {product.shop.name}
                      </h3>
                      <h5 className="pb-3 text-[15px]">
                        {product.shop.name} Ratings
                      </h5>
                    </div>
                  </Link>
                </div>
                <div
                  className={`${styles.button} bg-[#000] mt-4 rounded-[4px] h-11`}
                >
                  <span className="text-[#fff] flex items-center">
                    Send Message <AiOutlineMessage className="ml-1" />
                  </span>
                </div>
                <h5 className="text-[16px] text-[red] mt-5">
                  ({product.sold_out}) Sold out
                </h5>
              </div>

              <div className="w-full 800px:w-[50%] pt-5 pl-[5px] pr-[5px]">
                <h1 className={`${styles.productTitle} text-[20px]`}>
                  {product.name}
                </h1>
                <p>{product.description}</p>

                <div className="flex pt-3">
                  <h4 className={`${styles.productDiscountPrice}`}>
                    {product.discountPrice}$
                  </h4>
                  <h3 className={`${styles.price}`}>
                    {product.originalPrice + "$"}
                  </h3>
                </div>
                <div className="flex items-center mt-12 justify-between pr-3">
                  <div>
                    <button
                      onClick={() => setCount(count - 1)}
                      className="bg-gradient-to-r from-teal-400 to-teal-500 text-white font-bold rounded-l px-4 py-2 shadow-lg hover:opacity-75 transition duration-300 ease-in-out"
                    >
                      -
                    </button>
                    <span className="bg-gray-200 text-gray-800 font-medium px-4 py-[11px]">
                      {count}
                    </span>
                    <button
                      onClick={() => setCount(count + 1)}
                      className="bg-gradient-to-r from-teal-400 to-teal-500 text-white font-bold rounded-l px-4 py-2 shadow-lg hover:opacity-75 transition duration-300 ease-in-out"
                    >
                      +
                    </button>
                  </div>
                  <div>
                    {click ? (
                      <AiFillHeart
                        size={30}
                        className="cursor-pointer"
                        color={click ? "red" : "#333"}
                        title="Remove from wishlist"
                        onClick={() => handleDeleteFromWishlist(product)}
                      />
                    ) : (
                      <AiOutlineHeart
                        size={30}
                        className="cursor-pointer"
                        title="Add to wishlist"
                        onClick={() => handleAddToWishlist(product)}
                      />
                    )}
                  </div>
                </div>
                <div
                  className={`${styles.button} mt-6 rounded-[4px] h-11 flex items-center`}
                >
                  <span
                    className="text-[#fff] flex items-center"
                    onClick={() => handleAddToCart(product)}
                  >
                    Add to cart <AiOutlineShoppingCart className="ml-1" />
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
};

export default ProductDetailsCard;
