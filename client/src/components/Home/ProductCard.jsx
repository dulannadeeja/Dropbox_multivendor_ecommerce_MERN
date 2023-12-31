import React, { useEffect, useState } from "react";
import {
  AiFillHeart,
  AiOutlineEye,
  AiOutlineHeart,
  AiOutlineShoppingCart,
} from "react-icons/ai";
import { Link } from "react-router-dom";
import styles from "../../styles/styles";
import Ratings from "../Product/Ratings";
import ProductDetailsCard from "./ProductDetailsCard";
import { server } from "../../server";
import { useDispatch } from "react-redux";
import { addToCart } from "../../redux/actions/addToCart";
import { useSelector } from "react-redux";

const ProductCard = ({ product }) => {
  const dispatch = useDispatch();
  const { items } = useSelector((state) => state.wishlist);
  const [click, setClick] = useState(false);
  const [view, setView] = useState(false);

  useEffect(() => {
    if (items.find((i) => i._id === product._id)) {
      setClick(true);
    } else {
      setClick(false);
    }
  }, [items]);

  const handleAddToWishlist = async (product) => {
    try {
      await dispatch({ type: "AddToWishlist", payload: { ...product } });
    } catch (err) {
      console.log(err);
    }
  };

  const handleDeleteFromWishlist = async (product) => {
    try {
      await dispatch({ type: "DeleteFromWishlist", payload: { ...product } });
    } catch (err) {
      console.log(err);
    }
  };

  const handleAddToCart = async (product) => {
    console.log(product);
    try {
      await dispatch(addToCart({ product, quantity: 1 }));
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <>
      <div className="border-2 w-full bg-white rounded-lg shadow-sm p-3 relative cursor-pointer">
        <Link
          to={`/products/${product?._id}`}
          className="block w-full aspect-square overflow-hidden"
        >
          <img
            src={`${server}/${product?.images[0].url}`}
            alt=""
            className="w-full h-full object-cover"
          />
        </Link>
        <Link to={`/shop/preview/${product?._id}`}>
          <h5 className={`${styles.shop_name}`}>{product.shop.name}</h5>
        </Link>
        <Link
          to={`${
            true
              ? `/product/${product._id}?isEvent=true`
              : `/product/${product._id}`
          }`}
        >
          <h4 className="pb-3 font-[500]">
            {product.name.length > 40
              ? product.name.slice(0, 40) + "..."
              : product.name}
          </h4>

          <div className="flex">
            <Ratings rating={product.rating} />
          </div>

          <div className="py-2 flex items-center justify-between">
            <div className="flex">
              <h5 className={`${styles.productDiscountPrice}`}>
                {product.discountPrice ? product.discountPrice + " $" : null}$
              </h5>
              <h4 className={`${styles.price}`}>{product.originalPrice}</h4>
            </div>
            <span className="font-[400] text-[17px] text-[#68d284]">
              {product.sold_out} sold
            </span>
          </div>
        </Link>

        {/* side options */}
        <div>
          {click ? (
            <AiFillHeart
              size={22}
              className="cursor-pointer absolute right-2 top-5"
              color={click ? "red" : "#333"}
              title="Remove from wishlist"
              onClick={() => handleDeleteFromWishlist(product)}
            />
          ) : (
            <AiOutlineHeart
              size={22}
              className="cursor-pointer absolute right-2 top-5"
              color={click ? "red" : "#333"}
              title="Add to wishlist"
              onClick={() => handleAddToWishlist(product)}
            />
          )}
          <AiOutlineEye
            size={22}
            className="cursor-pointer absolute right-2 top-14"
            color="#333"
            title="Quick view"
            onClick={() => setView(true)}
          />
          <AiOutlineShoppingCart
            size={25}
            className="cursor-pointer absolute right-2 top-24"
            color="#444"
            title="Add to cart"
            onClick={() => {
              handleAddToCart(product);
            }}
          />
        </div>

        {/* product-Details popup */}
        {view ? (
          <ProductDetailsCard product={product} setView={setView} />
        ) : null}
      </div>
    </>
  );
};

export default ProductCard;
