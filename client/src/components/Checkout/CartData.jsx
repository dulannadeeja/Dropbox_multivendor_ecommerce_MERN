import React, { useEffect } from "react";
import styles from "../../styles/styles";
import { useSelector } from "react-redux";
import axios from "axios";
import { toast } from "react-toastify";
import { server } from "../../server";
import { RxCross1 } from "react-icons/rx";
import { useDispatch } from "react-redux";
import { applyCoupon } from "../../redux/actions/applyCoupon";

const CartData = () => {
  const dispatch = useDispatch();
  const { token } = useSelector((state) => state.user);
  const {
    cartTotal,
    isCouponApplied,
    coupon,
    couponDiscount,
    couponError,
    isCouponLoading,
  } = useSelector((state) => state.cart);

  // shipping price is 0 for now
  const shippingPrice = 0;
  // coupon code is empty for now
  const [couponCode, setCouponCode] = React.useState("");

  const handleCouponSubmit = async (e) => {
    e.preventDefault();

    console.log(couponCode);
    console.log(couponDiscount);

    if (couponCode === "") {
      toast.error("Please enter a coupon code");
    }

    try {
      await dispatch(applyCoupon({ couponCode }));
    } catch (err) {
      toast.error(
        err.response?.data?.message
          ? err.response.data.message
          : "something went wrong"
      );
      console.log(err);
    }
  };

  return (
    <div className="w-full bg-[#fff] rounded-md p-5 pb-8">
      <div className="flex justify-between">
        <h3 className="text-[16px] font-[400] text-[#000000a4]">subtotal:</h3>
        <h5 className="text-[18px] font-[600]">${cartTotal}</h5>
      </div>
      <br />
      <div className="flex justify-between">
        <h3 className="text-[16px] font-[400] text-[#000000a4]">shipping:</h3>
        <h5 className="text-[18px] font-[600]">${shippingPrice.toFixed(2)}</h5>
      </div>
      <br />
      <div className="flex justify-between border-b pb-3">
        <h3 className="text-[16px] font-[400] text-[#000000a4]">Discount:</h3>
        <h5 className="text-[18px] font-[600]">
          - {couponDiscount ? "$" + couponDiscount.toString() : null}
        </h5>
      </div>
      <h5 className="text-[18px] font-[600] text-end pt-3">
        ${cartTotal - couponDiscount + shippingPrice}
      </h5>
      <br />
      {isCouponApplied && (
        <div className="bg-lime-200 border-2 border-lime-600 px-3 py-2 inline-flex justify-center items-center text-sm rounded-sm text-lime-950">
          <button
            className="flex items-center"
            onClick={() => {
              dispatch({ type: "RemoveCoupon" });
            }}
          >
            <span className="mr-2">{coupon}</span>
            <span className="font-bold">
              <RxCross1 />
            </span>
          </button>
        </div>
      )}

      <br />
      <form onSubmit={(e) => handleCouponSubmit(e)}>
        <input
          type="text"
          className={`${styles.input} h-[40px] pl-2`}
          placeholder="Coupoun code"
          required
          value={couponCode}
          onChange={(e) => setCouponCode(e.target.value)}
        />
        <input
          className={`w-full h-[40px] border border-[#f63b60] text-center text-[#f63b60] rounded-[3px] mt-8 cursor-pointer ${
            isCouponLoading ? "opacity-50 pointer-events-none" : null
          }`}
          required
          value="Apply code"
          type="submit"
        />
      </form>
    </div>
  );
};

export default CartData;
