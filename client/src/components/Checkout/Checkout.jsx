import styles from "../../styles/styles";
import { useSelector } from "react-redux";
import ShippingInfo from "./ShippingInfo";
import CartData from "./CartData";
import { useCheckoutContext } from "../../contexts/CheckoutContext";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const Checkout = ({ addresses }) => {
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
    <div className="w-full flex flex-col items-center ">
      <div className="flex flex-col md:grid md:grid-cols-12 md:gap-10 gap-10">
        <div className="w-full md:col-span-8 md:gap-20 border-2 border-indigo-200 shadow-lg">
          <ShippingInfo addresses={addresses} />
        </div>
        <div className="w-full md:col-span-4 border-2 border-indigo-200 shadow-lg">
          <CartData />
        </div>
      </div>
      <div>
        {isCouponLoading ? (
          <h5 className="text-white">Loading...</h5>
        ) : (
          <button
            className={styles.buttonPrimary + " px-8 py-2 mt-8"}
            onClick={() => paymentSubmit()}
          >
            Go to Payment
          </button>
        )}
      </div>
    </div>
  );
};

export default Checkout;
