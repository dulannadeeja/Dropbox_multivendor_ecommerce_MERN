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

const ProductCard = ({ data, isEvent }) => {
  const [click, setClick] = useState(false);
  const [view, setView] = useState(false);

  return (
    <>
      <div className="w-full h-[370px] bg-white rounded-lg shadow-sm p-3 relative cursor-pointer">
        <div className="flex justify-end"></div>
        <Link
          to={`${
            isEvent === true
              ? `/products/${data.id}?isEvent=true`
              : `/products/${data.id}`
          }`}
        >
          <img
            src={`${data.image_Url && data.image_Url[0]?.url}`}
            alt=""
            className="w-full h-[170px] object-contain"
          />
        </Link>
        <Link to={`/shop/preview/${data?.shop._id}`}>
          <h5 className={`${styles.shop_name}`}>{data.shop.name}</h5>
        </Link>
        <Link
          to={`${
            isEvent === true
              ? `/product/${data._id}?isEvent=true`
              : `/product/${data._id}`
          }`}
        >
          <h4 className="pb-3 font-[500]">
            {data.name.length > 40 ? data.name.slice(0, 40) + "..." : data.name}
          </h4>

          <div className="flex">
            <Ratings rating={data?.rating} />
          </div>

          <div className="py-2 flex items-center justify-between">
            <div className="flex">
              <h5 className={`${styles.productDiscountPrice}`}>
                {data.discount_price ? data.discount_price + " $" : null}$
              </h5>
              <h4 className={`${styles.price}`}>
                {data.price ? data.price + " $" : null}
              </h4>
            </div>
            <span className="font-[400] text-[17px] text-[#68d284]">
              {data?.total_sell} sold
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
          />
        </div>

        {/* product-Details popup */}
        {view ? <ProductDetailsCard data={data} setView={setView} /> : null}
      </div>
    </>
  );
};

export default ProductCard;
