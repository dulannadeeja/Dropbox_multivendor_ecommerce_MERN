import React from "react";
import { RxCross1 } from "react-icons/rx";
import { BsCartPlus } from "react-icons/bs";
import { useDispatch } from "react-redux";
import { addToCart } from "../../redux/actions/addToCart";
import { server } from "../../server";

const WishlistItem = ({ product }) => {
  const dispatch = useDispatch();

  return (
    <div className="border-b p-4">
      <div className="w-full flex flex-col md:flex-row md:flex gap-3 md:items-center">
        <RxCross1
          className="cursor-pointer mb-2 ml-2 self-end md:self-center"
          onClick={() =>
            dispatch({ type: "DeleteFromWishlist", payload: { ...product } })
          }
        />
        <img
          src={`${server}/${product?.images[0]?.url}`}
          alt=""
          className="w-20 aspect-square object-cover ml-2 mr-2 rounded-[5px]"
        />

        <div className="pl-[5px]">
          <h1>{product.name}</h1>
          <h4 className="font-[600] pt-3 text-[17px] text-[#d02222] font-Roboto">
            US${product.discountPrice}
          </h4>
        </div>
        <div>
          <BsCartPlus
            size={20}
            className="cursor-pointer"
            tile="Add to cart"
            onClick={() => dispatch(addToCart({ product, quantity: 1 }))}
          />
        </div>
      </div>
    </div>
  );
};

export default WishlistItem;
