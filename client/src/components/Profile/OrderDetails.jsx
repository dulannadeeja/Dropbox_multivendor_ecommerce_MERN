import React, { useEffect, useState } from "react";
import styles from "../../styles/styles";
import { useDispatch, useSelector } from "react-redux";
import Loader from "../Loader";
import { loadUserOrders } from "../../redux/actions/loadUserOrders";
import { AiFillStar, AiOutlineStar } from "react-icons/ai";
import ReviewPopup from "./OrderDetails/ReviewPopup";
import { useParams } from "react-router-dom";
import { server } from "../../server";
import Ratings from "../Product/Ratings";
import STATUS from "../../constants/status";

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
      <div className={`max-w-6xl mx-auto`}>
        <div className="w-full flex items-center justify-between gap-5 py-5 border-b-2 my-5">
          <h5 className="text-[#00000084]">
            Order ID: <span>#{data?._id?.slice(0, 8)}</span>
          </h5>
          <h5 className="text-[#00000084]">
            Placed on: <span>{data?.createdAt?.slice(0, 10)}</span>
          </h5>
        </div>
        <div className="flex flex-col gap-5">
          {products &&
            products?.map((product, index) => (
              <div className="w-full flex flex-col items-start mb-5 shadow-lg p-3 gap-3 md:flex-row border-b-2 rounded-md md:gap-10">
                <img
                  src={
                    product.images
                      ? `${server}/${product?.images[0]?.url}`
                      : "https://via.placeholder.com/150"
                  }
                  alt=""
                  className="w-40 aspect-square object-cover rounded-sm"
                />
                <div className="w-full">
                  <h5 className="text-[20px] py-2">{product.name}</h5>
                  <h5 className="inline-flex items-center rounded-md bg-indigo-50 px-2 py-1 text-lg font-medium text-indigo-700 ring-1 ring-inset ring-indigo-700/10 mb-3">
                    US${product.discountPrice} x {product.quantity}
                  </h5>
                  {/* if have review disply stars and edit button */}
                  <div>
                    {product.review ? (
                      <div className="flex flex-col justify-between gap-3 lg:flex-row">
                        <h5 className="ml-1 text-[18px] font-[600]">
                          <Ratings rating={product.review.rating} />
                        </h5>
                        <h5
                          className={
                            product.review.rating > 3
                              ? "text-green-500 text-lg"
                              : "text-red-500"
                          }
                        >
                          {product.review.comment}
                        </h5>
                        {/* updated at */}

                        <button
                          className={styles.button}
                          onClick={() => handleReviewPopupOpen(product)}
                        >
                          Edit review
                        </button>
                      </div>
                    ) : null}
                  </div>
                  {/* write a review icon and button */}

                  {!product.review && (
                    <button
                      className={`${styles.buttonPrimary} w-fit`}
                      onClick={() => handleReviewPopupOpen(product)}
                    >
                      <AiOutlineStar size={20} color="#fbbf24" />
                      Write a Review
                    </button>
                  )}
                </div>
              </div>
            ))}
        </div>

        <div className="bg-white">
          {/* payment info */}
          <h2 className="pt-3 text-lg font-semibold border-b-2 pb-3 mb-5">
            Payment Summary
          </h2>
          <div className="flex justify-between w-full mb-5">
            {/* total payment */}
            <div className="flex gap-1 flex-wrap items-center">
              <h4 className="text-slate-500 font-semibold">Total Payment:</h4>
              <p className="font-semibold text-lg">
                US${data?.cartTotal - data?.couponDiscount}
              </p>
            </div>

            <div className="flex gap-1 flex-wrap items-center">
              <h4 className="text-slate-500 font-semibold">Payment Method:</h4>
              <p className="font-semibold text-lg">
                {data?.paymentMethod || "Pending"}
              </p>
            </div>
          </div>

          {/* shipping info */}
          <h2 className="pt-3 text-lg font-semibold border-b-2 pb-3 mb-5">
            Shipping Details
          </h2>
          <div className="flex flex-col justify-between w-full mb-5">
            {/* contact name */}
            <div className="flex gap-1 flex-wrap items-center">
              <h4 className="text-slate-500 font-semibold">Contact Name:</h4>
              <p className="font-semibold text-lg">
                {data?.shippingAddress.contactName}
              </p>
            </div>

            {/* contact number */}
            <div className="flex gap-1 flex-wrap items-center">
              <h4 className="text-slate-500 font-semibold">Contact Number:</h4>
              <p className="font-semibold text-lg">
                {data?.shippingAddress.phone}
              </p>
            </div>

            {/* apt */}
            <div className="flex gap-1 flex-wrap items-center">
              <h4 className="text-slate-500 font-semibold">Apt:</h4>
              <p className="font-semibold text-lg">
                {data?.shippingAddress.houseNumber}
              </p>
            </div>

            {/* street */}
            <div className="flex gap-1 flex-wrap items-center">
              <h4 className="text-slate-500 font-semibold">Street:</h4>
              <p className="font-semibold text-lg">
                {data?.shippingAddress.street}
              </p>
            </div>

            {/* city */}
            <div className="flex gap-1 flex-wrap items-center">
              <h4 className="text-slate-500 font-semibold">City:</h4>
              <p className="font-semibold text-lg">
                {data?.shippingAddress.city}
              </p>
            </div>

            {/* state */}
            <div className="flex gap-1 flex-wrap items-center">
              <h4 className="text-slate-500 font-semibold">State:</h4>
              <p className="font-semibold text-lg">
                {data?.shippingAddress.state}
              </p>
            </div>

            {/* country */}

            <div className="flex gap-1 flex-wrap items-center">
              <h4 className="text-slate-500 font-semibold">Country:</h4>
              <p className="font-semibold text-lg">
                {data?.shippingAddress.country}
              </p>
            </div>

            {/* zip */}
            <div className="flex gap-1 flex-wrap items-center">
              <h4 className="text-slate-500 font-semibold">Zip:</h4>
              <p className="font-semibold text-lg">
                {data?.shippingAddress.zip}
              </p>
            </div>
          </div>

          {/* order status */}

          <div className="flex justify-between w-full items-center pb-3 mb-5">
            <h2 className="pt-3 text-lg font-semibold ">Order Status</h2>
            {orderStatus === STATUS.PENDING && (
              <p className="inline-flex items-center rounded-md bg-gray-50 px-2 py-1 text-xs font-medium text-gray-600 ring-1 ring-inset ring-gray-500/10">
                Pending
              </p>
            )}
            {orderStatus === STATUS.PROCESSING && (
              <p className="inline-flex items-center rounded-md bg-gray-50 px-3 py-2 text-xl font-medium text-gray-600 ring-1 ring-inset ring-gray-500/10">
                Processing
              </p>
            )}
            {orderStatus === STATUS.SHIPPED && (
              <p className="inline-flex items-center rounded-md bg-yellow-50 px-3 py-2 text-xl font-medium text-yellow-800 ring-1 ring-inset ring-yellow-600/20">
                Shipped
              </p>
            )}
            {orderStatus === STATUS.DELIVERED && (
              <p className="inline-flex items-center rounded-md bg-green-50 px-3 py-2 text-xl font-medium text-green-700 ring-1 ring-inset ring-green-600/20">
                Delivered
              </p>
            )}
            {orderStatus === STATUS.CANCELLED && (
              <p className="inline-flex items-center rounded-md bg-red-50 px-3 py-2 text-xl font-medium text-red-600 ring-1 ring-inset ring-red-500/10">
                Cancelled
              </p>
            )}
          </div>

          <h5 className="text-[#00000084] text-right">
            Last Update: <span>{data?.updatedAt?.slice(0, 10)}</span>
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
