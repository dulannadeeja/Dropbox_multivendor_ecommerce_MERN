import React from "react";
import ReactDOM from "react-dom";
// const PayPalButton = paypal.Buttons.driver("react", { React, ReactDOM });
import { PayPalButtons } from "@paypal/react-paypal-js";
import { server } from "../../server";

function PaypalPayment({ cart, token }) {
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
      body: JSON.stringify({
        cart,
      }),
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
        window.location.href = "/order-completed";
      } else {
        window.location.href = "/order-completed";
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
