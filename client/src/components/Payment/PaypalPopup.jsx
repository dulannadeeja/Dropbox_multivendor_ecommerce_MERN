import React from "react";
import { RxCross1 } from "react-icons/rx";
import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";
import PaypalPayment from "./PaypalPayment";
import { useSelector } from "react-redux";

const PaypalPopup = ({ setOpen }) => {
  const { token } = useSelector((state) => state.user);
  const { items, cartTotal, couponDiscount } = useSelector(
    (state) => state.cart
  );
  const [cart, setCart] = React.useState([]);

  React.useEffect(() => {
    let cart = [];
    items.forEach((item) => {
      cart.push({
        name: item.name,
        description: item.description,
        unit_amount: {
          currency_code: "USD",
          value: item.discountPrice,
        },
        quantity: item.quantity,
      });
    });
    setCart({ cart, cartTotal, couponDiscount });
  }, [items]);

  const initialOptions = {
    clientId:
      "AUjhRzbbxcXbiqwCcRX7WkyamO4r0K-GEOkMtMe1c3iSouc81eZuB3ZSj1daWPSP-4stDQz_Awa7VAo-",
    currency: "USD",
    intent: "capture",
  };

  return (
    <div className="w-full fixed top-0 left-0 bg-[#00000039] h-screen flex items-center justify-center z-[99999]">
      <div className="w-full 800px:w-[40%] h-screen 800px:h-[80vh] bg-white rounded-[5px] shadow flex flex-col justify-center p-8 relative overflow-y-scroll">
        <div className="w-full flex justify-end p-3">
          <RxCross1
            size={30}
            className="cursor-pointer absolute top-3 right-3"
            onClick={() => setOpen(false)}
          />
        </div>
        <PayPalScriptProvider options={initialOptions}>
          <PaypalPayment token={token} cart={cart} />
        </PayPalScriptProvider>
      </div>
    </div>
  );
};

export default PaypalPopup;
