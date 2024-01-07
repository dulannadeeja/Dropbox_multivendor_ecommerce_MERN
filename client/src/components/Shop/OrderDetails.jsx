import React, { useEffect, useState } from "react";
import styles from "../../styles/styles";
import { BsFillBagFill } from "react-icons/bs";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { loadShopOrders } from "../../redux/actions/loadShopOrders";
import STATUS from "../../constants/status";
import { server } from "../../server";
import axios from "axios";
import { toast } from "react-toastify";
import Loader from "../Loader";
import Ratings from "../../components/Product/Ratings";

const OrderDetails = () => {
  const { orders } = useSelector((state) => state.order);
  // const { seller } = useSelector((state) => state.seller);
  const dispatch = useDispatch();
  const [status, setStatus] = useState(STATUS.IDLE);
  const [orderStatus, setOrderStatus] = useState("");
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [products, setProducts] = useState([{}]);
  const { user } = useSelector((state) => state.user);

  const { orderId } = useParams();

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setStatus(STATUS.LOADING);

        // load orders of the store

        const res = await dispatch(loadShopOrders());

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

    setProducts(products);
  }, [orders, status]);

  const onStatusChanged = async (e) => {
    try {
      const newFormData = new FormData();

      newFormData.append("orderStatus", e.target.value);

      const res = await axios.post(
        `${server}/order/status/update/${orderId}`,
        newFormData,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${user?.token}`,
          },
        },
        { withCredentials: true }
      );

      if (res.status === 200) {
        toast.success(res.data.message);
        console.log("order status updated to ", e.target.value);
        setOrderStatus(e.target.value);
      }
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <>
      {status === STATUS.LOADING ? () => <Loader /> : null}
      <div className={`max-w-6xl mx-auto`}>
        <div className="w-full flex items-center justify-between gap-5 py-5 border-b-2 my-5">
          <div className="flex items-center">
            <BsFillBagFill size={30} color="crimson" />
            <h1 className="pl-2 text-[25px]">Order Details</h1>
          </div>
          <Link to="/shop/dashboard/?tab=orders">
            <div className={`${styles.button}`}>Order List</div>
          </Link>
        </div>

        <div className="w-full flex items-center justify-between pt-6">
          <h5 className="text-[#00000084]">
            Order ID: <span>#{data?._id?.slice(0, 8)}</span>
          </h5>
          <h5 className="text-[#00000084]">
            Placed on: <span>{data?.createdAt?.slice(0, 10)}</span>
          </h5>
        </div>

        <div className="flex flex-col gap-5 mt-5">
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
                      </div>
                    ) : null}
                  </div>
                  {/* if have review disply stars and edit button */}
                  <div>
                    {!product.review ? (
                      <div className="flex flex-col justify-between gap-3 lg:flex-row">
                        <h5 className="ml-1 text-[18px] font-[600]">
                          <Ratings rating={0} />
                        </h5>
                      </div>
                    ) : null}
                  </div>
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

          {/* update order status */}
          <div className="flex justify-between w-full items-center pb-3 mb-5">
            <h2 className="pt-3 text-lg font-semibold ">Update Order Status</h2>
            <select
              className="outline-none border border-[#00000084] rounded-[4px] p-3 px-5"
              onChange={(e) => {
                onStatusChanged(e);
              }}
            >
              <option value={STATUS.PROCESSING}>
                {STATUS.PROCESSING.toUpperCase()}
              </option>
              <option value={STATUS.SHIPPED}>
                {STATUS.SHIPPED.toUpperCase()}
              </option>
              <option value={STATUS.DELIVERED}>
                {STATUS.DELIVERED.toUpperCase()}
              </option>
              <option value={STATUS.CANCELLED}>
                {STATUS.CANCELLED.toUpperCase()}
              </option>
            </select>
          </div>

          {/* last update */}
          <h5 className="text-[#00000084] text-right">
            Last Update: <span>{data?.updatedAt?.slice(0, 10)}</span>
          </h5>
        </div>
      </div>
    </>
  );
};

export default OrderDetails;
