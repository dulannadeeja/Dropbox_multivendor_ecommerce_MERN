import React, { useEffect, useState } from "react";
import styles from "../../styles/styles";
import { useDispatch, useSelector } from "react-redux";
import STATUS from "../../constants/status";
import Loader from "../Loader";
import { loadUserOrders } from "../../redux/actions/loadUserOrders";
import { AiFillStar, AiOutlineStar } from "react-icons/ai";
import ReviewPopup from "./OrderDetails/ReviewPopup";
import { useParams } from "react-router-dom";

const OrderDetails = () => {
  const { user } = useSelector((state) => state.user);
  const { orders } = useSelector((state) => state.order);
  const dispatch = useDispatch();
  const [status, setStatus] = useState(STATUS.IDLE);
  const [orderStatus, setOrderStatus] = useState("");
  const [data, setData] = useState(null);
  const [products, setProducts] = useState([{}]);
  const [reviewPopupOpen, setReviewPopupOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);

  const { orderId } = useParams();

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setStatus(STATUS.LOADING);

        // load orders of the store

        const res = await dispatch(loadUserOrders());

        // if order is found then set the status
        setStatus(STATUS.SUCCESS);
      } catch (error) {
        // if error then set the status
        setStatus(STATUS.FAILURE);
        console.log(error);
      }
    };

    fetchOrders();
  }, []);

  useEffect(() => {
    const data = orders && orders.find((item) => item._id === orderId);

    setData(data);

    if (data) {
      setOrderStatus(data.orderStatus);
    }

    // pull out the products from the order with quantity
    const products = [];

    data?.products.forEach((item) => {
      products.push({ ...item.product, quantity: item.quantity });
    });

    // if there is a review associated with the product then set the review
    products.forEach((product) => {
      const review = product.reviews.find((item) => item.user === user?._id);

      if (review) {
        product.review = review;
      }
    });

    // set the products
    setProducts(products);

    console.log(products);
  }, [orders, status]);

  const handleReviewPopupOpen = (product) => {
    setReviewPopupOpen(true);
    setSelectedItem(product);
  };

  return (
    <>
      {status === STATUS.LOADING ? () => <Loader /> : null}
      <div className={`py-4 min-h-screen ${styles.section}`}>
        <div className="w-full flex items-center justify-between pt-6">
          <h5 className="text-[#00000084]">
            Order ID: <span>#{data?._id?.slice(0, 8)}</span>
          </h5>
          <h5 className="text-[#00000084]">
            Placed on: <span>{data?.createdAt?.slice(0, 10)}</span>
          </h5>
        </div>
        <br />
        <br />
        {products &&
          products?.map((product, index) => (
            <div className="w-full flex items-start mb-5">
              <img src={``} alt="" className="w-[80x] h-[80px]" />
              <div className="w-full">
                <h5 className="pl-3 text-[20px]">{product.name}</h5>
                <h5 className="pl-3 text-[20px] text-[#00000091]">
                  US${product.discountPrice} x {product.quantity}
                </h5>
                {/* write a review icon and button */}
                <button
                  className={`${styles.button} text-[#fff]`}
                  onClick={() => handleReviewPopupOpen(product)}
                >
                  {!product.review ? (
                    <>
                      <AiOutlineStar size={20} color="#fbbf24" />
                      Write a Review
                    </>
                  ) : (
                    <AiFillStar size={20} color="#fbbf24" />
                  )}
                </button>
              </div>
            </div>
          ))}

        <div className="border-t w-full text-right">
          <h5 className="pt-3 text-[18px]">
            Total Price:{" "}
            <strong>US${data?.cartTotal - data?.couponDiscount}</strong>
          </h5>
        </div>
        <br />
        <br />
        <div className="w-full 800px:flex items-center">
          <div className="w-full 800px:w-[60%]">
            <h4 className="pt-3 text-[20px] font-[600]">Shipping Address:</h4>
            <h4 className="pt-3 text-[20px]">
              {data?.shippingAddress.houseNumber +
                " " +
                data?.shippingAddress.street}
            </h4>
            <h4 className=" text-[20px]">{data?.shippingAddress.country}</h4>
            <h4 className=" text-[20px]">{data?.shippingAddress.city}</h4>
            <h4 className=" text-[20px]">{data?.shippingAddress.phone}</h4>
          </div>
          <div className="w-full 800px:w-[40%]">
            <h4 className="pt-3 text-[20px]">Payment Info:</h4>
            <h4>Status: {data?.paymentMethod || "Pending"}</h4>
          </div>
        </div>
        <br />
        <br />
        <h4 className="pt-3 text-[20px] font-[600]">Order Status:</h4>

        {/* update order status */}
        <div className="w-full flex items-center justify-between">
          <h5 className="text-[#00000084]">
            Order Status: <span>{orderStatus}</span>
          </h5>
          <h5 className="text-[#00000084]">
            Last Updated: <span>{data?.updatedAt?.slice(0, 10)}</span>
          </h5>
        </div>
      </div>
      {/* review popup */}
      {reviewPopupOpen && (
        <ReviewPopup
          product={selectedItem}
          setReviewPopupOpen={setReviewPopupOpen}
          setProducts={setProducts}
          setProduct={setSelectedItem}
        />
      )}
    </>
  );
};

export default OrderDetails;
