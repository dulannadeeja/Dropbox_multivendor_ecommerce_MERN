import React, { useEffect } from "react";
import styles from "../../styles/styles";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import { RxCross1 } from "react-icons/rx";
import { useDispatch } from "react-redux";
import { applyCoupon } from "../../redux/actions/applyCoupon";

const CartData = () => {
  const dispatch = useDispatch();
  const {
    cartTotal,
    isCouponApplied,
    coupon,
    couponDiscount,
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
    <div className="w-full bg-[#fff] rounded-md p-5 pb-8 flex flex-col justify-between h-full">
      <div className="flex flex-col gap-3">
        <div className="flex justify-between">
          <h3 className="text-lg font-semibold text-indigo-500">Subtotal:</h3>
          <h5 className="text-[18px] font-[600]">${cartTotal}</h5>
        </div>

        <div className="flex justify-between">
          <h3 className="text-lg font-semibold text-indigo-500">Shipping:</h3>
          <h5 className="text-[18px] font-[600]">
            ${shippingPrice.toFixed(2)}
          </h5>
        </div>

        <div className="flex justify-between border-b pb-3">
          <h3 className="text-lg font-semibold text-indigo-500">Discount:</h3>
          <h5 className="text-[18px] font-[600] text-green-500">
            - {couponDiscount ? "$" + couponDiscount.toString() : null}
          </h5>
        </div>
        <h5 className=" text-end pt-3 text-lg font-semibold">
          ${cartTotal - couponDiscount + shippingPrice}
        </h5>
      </div>

      <div>
        {isCouponApplied && (
          <div className="inline-flex gap-2 items-center rounded-md bg-indigo-50 px-3 py-2 text-xs font-medium text-indigo-700 ring-1 ring-inset ring-indigo-700/10 mb-3">
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
    </div>
  );
};

export default CartData;
