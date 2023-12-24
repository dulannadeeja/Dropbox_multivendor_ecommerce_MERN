import React from "react";
import styles from "../../styles/styles";
import { useSelector } from "react-redux";

const CartData = () => {
  const { items, cartTotal } = useSelector((state) => state.cart);

  // shipping price is 0 for now
  const shippingPrice = 0;
  // subtotal price is the total price of all the items in the cart
  const subTotal = cartTotal;
  // coupon code is empty for now
  const couponCode = "";

  return (
    <div className="w-full bg-[#fff] rounded-md p-5 pb-8">
      <div className="flex justify-between">
        <h3 className="text-[16px] font-[400] text-[#000000a4]">subtotal:</h3>
        <h5 className="text-[18px] font-[600]">${subTotal}</h5>
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
          {/* - {discountPercentenge ? "$" + discountPercentenge.toString() : null} */}
        </h5>
      </div>
      <h5 className="text-[18px] font-[600] text-end pt-3">${cartTotal}</h5>
      <br />
      <form>
        <input
          type="text"
          className={`${styles.input} h-[40px] pl-2`}
          placeholder="Coupoun code"
          value={couponCode}
          onChange={(e) => {
            console.log(e.target.value);
          }}
          required
        />
        <input
          className={`w-full h-[40px] border border-[#f63b60] text-center text-[#f63b60] rounded-[3px] mt-8 cursor-pointer`}
          required
          value="Apply code"
          type="submit"
        />
      </form>
    </div>
  );
};

export default CartData;
