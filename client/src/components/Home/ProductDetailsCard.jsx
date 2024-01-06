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
import { server } from "../../server";

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
        <div className="fixed w-full h-screen top-0 left-0 bg-[#00000030] z-[100] flex items-center justify-center">
          <div className="w-[90%]  h-[90vh] max-w-6xl overflow-y-scroll  bg-white rounded-md shadow-sm relative p-4">
            <div className="mb-10">
              <RxCross1
                size={30}
                className="absolute right-3 top-3 z-50"
                onClick={() => setView(false)}
              />
            </div>

            <div className="block w-full mt-10">
              <div className="md:grid md:grid-cols-2 md:gap-10 md:items-center md:justify-start lg:grid-cols-12">
                <div className="flex my-10 items-center justify-center w-full aspect-square overflow-hidden rounded-md  max-w-sm lg:col-span-4">
                  <img
                    src={`${server}/${product.images[0]?.url}`}
                    alt="product image"
                  />
                </div>
                <div className="w-full  lg:col-span-8 flex flex-col gap-5">
                  {/* shop info */}
                  <div className="grid grid-cols-4 items-center ">
                    <div className="flex items-center col-span-3">
                      <Link
                        to={`shop/${product.shop._id}`}
                        className="flex items-center justify-center gap-4"
                      >
                        <img
                          src={`${server}/${product.shop.shopAvatar}`}
                          alt=""
                          className="w-20 h-20 object-cover rounded-full mr-2"
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
                      className={`${styles.buttonPrimary} self-center col-span-1`}
                    >
                      <span className="text-[#fff] flex items-center">
                        Send Message <AiOutlineMessage className="ml-1" />
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-10 my-5 border-b-2">
                    {/* product price */}
                    <div className="flex">
                      <h4 className={`${styles.productDiscountPrice}`}>
                        {product.discountPrice}$
                      </h4>
                      <h3 className={`${styles.price}`}>
                        {product.originalPrice + "$"}
                      </h3>
                    </div>
                    {/* sold out */}
                    <h5 className="text-[16px] text-[red]">
                      ({product.sold_out}) Sold out
                    </h5>
                  </div>

                  {/* actions */}
                  <div className="flex  justify-between items-center">
                    <div className="flex gap-5 items-center">
                      {/* add to cart */}
                      <div className="flex gap-3">
                        {/* increment */}
                        <button
                          onClick={() => setCount(count - 1)}
                          className={styles.button}
                        >
                          -
                        </button>
                        {/* quantity */}
                        <span className="bg-gray-200 text-gray-800 font-medium px-4 py-[11px]">
                          {count}
                        </span>
                        {/* decrement */}
                        <button
                          onClick={() => setCount(count + 1)}
                          className={styles.button}
                        >
                          +
                        </button>
                      </div>

                      {/* add to cart button */}
                      <div className=" ">
                        <button
                          onClick={() => handleAddToCart(product)}
                          className={`${styles.buttonPrimary} flex items-center gap-3 text-md`}
                        >
                          <span>Add to cart</span>
                          <AiOutlineShoppingCart />
                        </button>
                      </div>
                    </div>

                    {/* wishlist */}
                    <div className="flex items-center justify-between">
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
                  </div>
                </div>
              </div>

              <div className="w-full pt-5 pl-[5px] pr-[5px] ">
                <h1 className={`${styles.productTitle} text-[20px]`}>
                  {product.name}
                </h1>
                <p>{product.description}</p>
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
};

export default ProductDetailsCard;
