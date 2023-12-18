import React, { useEffect, useState } from "react";

const PaymentMethods = () => {
  const [paymentMethods, setPaymentMethods] = useState([]);

  useEffect(() => {
    setPaymentMethods([
      {
        logo: "https://via.placeholder.com/150",
        ownerName: "John Doe",
        cardNumber: "1234 1234 1234 1234",
        expiryDate: "12/24",
      },
      {
        logo: "https://via.placeholder.com/150",
        ownerName: "John Doe",
        cardNumber: "1234 1234 1234 1234",
        expiryDate: "12/24",
      },
      {
        logo: "https://via.placeholder.com/150",
        ownerName: "John Doe",
        cardNumber: "1234 1234 1234 1234",
        expiryDate: "12/24",
      },
    ]);
  }, []);

  const handleAddPaymentMethod = () => {
    // Logic to add a new payment method
  };

  const handleDeletePaymentMethod = (index) => {
    // Logic to delete a payment method at the given index
  };

  return (
    <div>
      <h2>Payment Methods</h2>
      {paymentMethods.map((method, index) => (
        <div key={index} className="payment-method-card">
          <img src={method.logo} alt="Payment Method Logo" />
          <p>Card Owner: {method.ownerName}</p>
          <p>Card Number: {method.cardNumber}</p>
          <p>Expiry Date: {method.expiryDate}</p>
          <button onClick={() => handleDeletePaymentMethod(index)}>
            Delete
          </button>
        </div>
      ))}
      <button onClick={handleAddPaymentMethod}>Add New Payment Method</button>
    </div>
  );
};

export default PaymentMethods;
