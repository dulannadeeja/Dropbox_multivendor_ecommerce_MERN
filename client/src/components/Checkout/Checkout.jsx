import React, { useState } from "react";
import styles from "../../styles/styles";
import { Country, State } from "country-state-city";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { useEffect } from "react";
import axios from "axios";
import { server } from "../../server";
import { toast } from "react-toastify";
import ShippingInfo from "./ShippingInfo";
import CartData from "./CartData";

const Checkout = ({ addresses, loading }) => {
  const { user } = useSelector((state) => state.user);
  const {
    items,
    cartTotal,
    isCouponApplied,
    coupon,
    couponDiscount,
    isCouponLoading,
  } = useSelector((state) => state.cart);
  const navigate = useNavigate();
  const [houseNumber, setHouseNumber] = useState("");
  const [street, setStreet] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [country, setCountry] = useState("BD");
  const [zip, setZip] = useState("");
  const [contactName, setContactName] = useState("");
  const [phone, setPhone] = useState("");

  const [couponCode, setCouponCode] = useState("");
  const [shipping, setShipping] = useState(0);
  const [totalPrice, setTotalPrice] = useState(0);
  const [subTotalPrice, setSubTotalPrice] = useState(0);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const paymentSubmit = () => {
    if (
      !houseNumber ||
      !street ||
      !city ||
      !state ||
      !country ||
      !zip ||
      !contactName ||
      !phone
    ) {
      toast.error("Please fill all the fields");
    } else {
      const orderData = {
        houseNumber,
        street,
        city,
        state,
        country,
        zip,
        contactName,
        phone,
        items,
        cartTotal,
        isCouponApplied,
        coupon,
        couponDiscount,
      };
      // update local storage with the updated orders array
      localStorage.setItem("latestOrder", JSON.stringify(orderData));
      navigate("/payment");
    }
  };

  return (
    <div className="w-full flex flex-col items-center py-8">
      <div className="w-[90%] 1000px:w-[70%] block 800px:flex">
        <div className="w-full 800px:w-[65%]">
          <ShippingInfo
            loading={loading}
            addresses={addresses}
            houseNumber={houseNumber}
            setHouseNumber={setHouseNumber}
            street={street}
            setStreet={setStreet}
            city={city}
            setCity={setCity}
            state={state}
            setState={setState}
            country={country}
            setCountry={setCountry}
            zip={zip}
            setZip={setZip}
            contactName={contactName}
            setContactName={setContactName}
            phone={phone}
            setPhone={setPhone}
            paymentSubmit={paymentSubmit}
          />
        </div>
        <div className="w-full 800px:w-[35%] 800px:mt-0 mt-8">
          <CartData
            // handleSubmit={handleSubmit}
            totalPrice={totalPrice}
            shipping={shipping}
            subTotalPrice={subTotalPrice}
            couponCode={couponCode}

            // setCouponCode={setCouponCode}
            // discountPercentenge={discountPercentenge}
          />
        </div>
      </div>
      <div className={`${styles.button} w-[150px] 800px:w-[280px] mt-10`}>
        {isCouponLoading ? (
          <h5 className="text-white">Loading...</h5>
        ) : (
          <h5 className="text-white" onClick={() => paymentSubmit()}>
            Go to Payment
          </h5>
        )}
      </div>
    </div>
  );
};

export default Checkout;
