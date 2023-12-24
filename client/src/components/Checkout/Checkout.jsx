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
  const { items, cartTotal } = useSelector((state) => state.cart);
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
      };
      // update local storage with the updated orders array
      localStorage.setItem("latestOrder", JSON.stringify(orderData));
      navigate("/payment");
    }
  };

  // const subTotalPrice = cart.reduce(
  //   (acc, item) => acc + item.qty * item.discountPrice,
  //   0
  // );

  // this is shipping cost variable
  // const shipping = subTotalPrice * 0.1;

  const handleSubmit = async (e) => {
    // e.preventDefault();
    // const name = couponCode;
    // await axios.get(`${server}/coupon/get-coupon-value/${name}`).then((res) => {
    //   const shopId = res.data.couponCode?.shopId;
    //   const couponCodeValue = res.data.couponCode?.value;
    //   if (res.data.couponCode !== null) {
    //     const isCouponValid =
    //       cart && cart.filter((item) => item.shopId === shopId);
    //     if (isCouponValid.length === 0) {
    //       toast.error("Coupon code is not valid for this shop");
    //       setCouponCode("");
    //     } else {
    //       const eligiblePrice = isCouponValid.reduce(
    //         (acc, item) => acc + item.qty * item.discountPrice,
    //         0
    //       );
    //       const discountPrice = (eligiblePrice * couponCodeValue) / 100;
    //       setDiscountPrice(discountPrice);
    //       setCouponCodeData(res.data.couponCode);
    //       setCouponCode("");
    //     }
    //   }
    //   if (res.data.couponCode === null) {
    //     toast.error("Coupon code doesn't exists!");
    //     setCouponCode("");
    //   }
    // });
  };

  // const discountPercentenge = couponCodeData ? discountPrice : "";

  // const totalPrice = couponCodeData
  //   ? (subTotalPrice + shipping - discountPercentenge).toFixed(2)
  //   : (subTotalPrice + shipping).toFixed(2);

  // console.log(discountPercentenge);

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
        <h5 className="text-white" onClick={() => paymentSubmit()}>
          Go to Payment
        </h5>
      </div>
    </div>
  );
};

export default Checkout;
