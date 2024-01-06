import React from "react";
import { RxCross1 } from "react-icons/rx";
import { IoBagHandleOutline } from "react-icons/io5";
import { HiOutlineMinus, HiPlus } from "react-icons/hi";
import styles from "../../styles/styles";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import { useSelector } from "react-redux";
import { deleteFromCart } from "../../redux/actions/deleteFromCart";
import { useDispatch } from "react-redux";
import { server } from "../../server";

const CartItem = ({ data }) => {
  const dispatch = useDispatch();
  const { items, cartTotal } = useSelector((state) => state.cart);

  const increment = (data) => {
    if (!(data.stock > data.quantity + 1)) {
      toast.error("Product stock limited!");
    } else {
      console.log(data);
      dispatch({ type: "IncreaseCartQuantity", payload: { ...data } });
    }
  };

  const decrement = (data) => {
    if (data.quantity === 1) {
      toast.error("Product quantity can't be less than 1!");
    } else {
      dispatch({ type: "DecreaseCartQuantity", payload: { ...data } });
    }
  };

  const formattedPrice = (price) => {
    return price.toFixed(2);
  };

  return (
    <div className="border-b p-4">
      <div className="w-full flex flex-col items-start justify-between gap-5 md:grid md:grid-cols-12">
        <RxCross1
          className="cursor-pointer self-end md:col-span-1 md:self-center"
          onClick={() => dispatch(deleteFromCart({ product: data }))}
        />
        <img
          src={`${server}/${data?.images[0]?.url}`}
          alt=""
          className="w-20 aspect-square object-cover rounded-sm md:col-span-2"
        />
        <div className="pl-[5px] md:col-span-6">
          <h1>{data.name}</h1>
          <h4 className="font-[400] text-[15px] text-[#00000082]">
            ${formattedPrice(data.discountPrice)}
          </h4>
          <h4 className="font-[600] text-[17px] pt-[3px] text-[#d02222] font-Roboto">
            US${formattedPrice(data.discountPrice * data.quantity)}
          </h4>
        </div>

        <div className="flex gap-3 md:col-span-3 md:self-center">
          <div
            className={`bg-[#e44343] border border-[#e4434373] rounded-full w-[25px] h-[25px] ${styles.noramlFlex} justify-center cursor-pointer`}
            onClick={() => increment(data)}
          >
            <HiPlus size={18} color="#fff" />
          </div>
          <span className="pl-[10px]">{data.quantity}</span>
          <div
            className="bg-[#a7abb14f] rounded-full w-[25px] h-[25px] flex items-center justify-center cursor-pointer"
            onClick={() => decrement(data)}
          >
            <HiOutlineMinus size={16} color="#7d879c" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartItem;
