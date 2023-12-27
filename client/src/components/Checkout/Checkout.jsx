import styles from "../../styles/styles";
import { useSelector } from "react-redux";
import ShippingInfo from "./ShippingInfo";
import CartData from "./CartData";
import { useCheckoutContext } from "../../contexts/CheckoutContext";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const Checkout = () => {
  const navigate = useNavigate();
  const { isCouponLoading } = useSelector((state) => state.cart);
  const { saveShippingInfo, validateFields } = useCheckoutContext();

  const paymentSubmit = async () => {
    const isValid = await validateFields();
    if (!isValid) {
      return toast.error("Please fill all the fields");
    }
    toast.success("Order Saved Successfully");
    saveShippingInfo();
    navigate("/payment");
  };

  return (
    <div className="w-full flex flex-col items-center py-8">
      <div className="w-[90%] 1000px:w-[70%] block 800px:flex">
        <div className="w-full 800px:w-[65%]">
          <ShippingInfo />
        </div>
        <div className="w-full 800px:w-[35%] 800px:mt-0 mt-8">
          <CartData />
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
