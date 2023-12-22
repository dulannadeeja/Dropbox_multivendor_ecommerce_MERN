import React, { useState } from "react";
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

const ProductCard = ({ product }) => {
  const dispatch = useDispatch();
  const [click, setClick] = useState(false);
  const [view, setView] = useState(false);

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
      <div className="w-full h-[370px] bg-white rounded-lg shadow-sm p-3 relative cursor-pointer">
        <div className="flex justify-end"></div>
        <Link to={`${server}/products/${product._id}`}>
          <img
            src={`${product?.defaultImage?.url}`}
            alt=""
            className="w-full h-[170px] object-contain"
          />
        </Link>
        <Link to={`/shop/preview/${product._id}`}>
          <h5 className={`${styles.shop_name}`}>{product.name}</h5>
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
            <Ratings rating={product.ratings} />
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
              onClick={() => setClick(false)}
            />
          ) : (
            <AiOutlineHeart
              size={22}
              className="cursor-pointer absolute right-2 top-5"
              color={click ? "red" : "#333"}
              title="Add to wishlist"
              onClick={() => setClick(true)}
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
        {view ? <ProductDetailsCard data={product} setView={setView} /> : null}
      </div>
    </>
  );
};

export default ProductCard;
