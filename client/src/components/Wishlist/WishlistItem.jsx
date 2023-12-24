import React from "react";
import { RxCross1 } from "react-icons/rx";
import { BsCartPlus } from "react-icons/bs";
import { useDispatch } from "react-redux";
import { addToCart } from "../../redux/actions/addToCart";

const WishlistItem = ({ product }) => {
  const dispatch = useDispatch();

  return (
    <div className="border-b p-4">
      <div className="w-full 800px:flex items-center">
        <RxCross1
          className="cursor-pointer 800px:mb-['unset'] 800px:ml-['unset'] mb-2 ml-2"
          onClick={() =>
            dispatch({ type: "DeleteFromWishlist", payload: { ...product } })
          }
        />
        <img
          src={`${product?.defaultImage?.url}`}
          alt=""
          className="w-[130px] h-min ml-2 mr-2 rounded-[5px]"
        />

        <div className="pl-[5px]">
          <h1>{product.name}</h1>
          <h4 className="font-[600] pt-3 800px:pt-[3px] text-[17px] text-[#d02222] font-Roboto">
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
