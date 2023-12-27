import React from "react";
import ReactDOM from "react-dom";
// const PayPalButton = paypal.Buttons.driver("react", { React, ReactDOM });
import { PayPalButtons } from "@paypal/react-paypal-js";
import { server } from "../../server";
import { useDispatch } from "react-redux";
import { useEffect } from "react";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

import { createOrder as createOrderAction } from "../../redux/actions/createOrder";

function PaypalPayment({ orderData }) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.user);
  const { token } = useSelector((state) => state.user);
  const [order, setOrder] = React.useState({});

  let {
    cartTotal,
    items,
    coupon,
    isCouponApplied,
    couponDiscount,
    houseNumber,
    street,
    city,
    state,
    country,
    zip,
    phone,
    contactName,
  } = orderData;

  useEffect(() => {
    if (!items.length) {
      navigate("/");
    }

    setOrder({
      cartTotal,
      items,
      coupon,
      isCouponApplied,
      couponDiscount,
      houseNumber,
      street,
      city,
      state,
      country,
      zip,
      phone,
      contactName,
    });
  }, [isCouponApplied, items, coupon, couponDiscount, cartTotal]);

  const createOrder = async (data) => {
    // Order is created on the server and the order id is returned
    return fetch(`${server}/payment/create-paypal-order`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        authorization: `Bearer ${token}`,
      },
      // use the "body" param to optionally pass additional order information
      // like product skus and quantities
      body: JSON.stringify({ ...order, orderID: data.orderID }),
    })
      .then((response) => response.json())
      .then((order) => order.id);
  };
  const onApprove = async (data) => {
    // Order is captured on the server and the response is returned to the browser
    return fetch(`${server}/payment/capture-paypal-payment`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        orderID: data.orderID,
      }),
    }).then((response) => {
      if (response.status === 201) {
        dispatch(createOrderAction({ order: orderData }))
          .then((res) => {
            if (res.status === 201) {
              // clear cart and latest order
              localStorage.removeItem("latestOrder");
              localStorage.removeItem("cart");
              dispatch({ type: "ClearCart" });
              window.location.reload();
              toast.success("Order placed successfully!");
              navigate("/order-completed");
            }
          })
          .catch((err) => {
            console.log(err);
          });
      }
    });
  };

  return (
    <PayPalButtons
      createOrder={(data, actions) => createOrder(data, actions)}
      onApprove={(data, actions) => onApprove(data, actions)}
    />
  );
}

export default PaypalPayment;
