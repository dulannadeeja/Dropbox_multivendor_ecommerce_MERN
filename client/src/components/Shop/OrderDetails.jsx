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
      <div className={`py-4 min-h-screen ${styles.section}`}>
        <div className="w-full flex items-center justify-between">
          <div className="flex items-center">
            <BsFillBagFill size={30} color="crimson" />
            <h1 className="pl-2 text-[25px]">Order Details</h1>
          </div>
          <Link to="/shop/dashboard/?tab=orders">
            <div
              className={`${styles.button} !bg-[#fce1e6] !rounded-[4px] text-[#e94560] font-[600] !h-[45px] text-[18px]`}
            >
              Order List
            </div>
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

        {/* select the order status */}
        <div className="w-full flex items-center justify-between">
          <h5 className="text-[#00000084]">Select Order Status:</h5>
          <select
            className="outline-none border border-[#00000084] rounded-[4px] p-2"
            onChange={(e) => {
              onStatusChanged(e);
            }}
          >
            <option value={STATUS.PROCESSING} className="bg-slate-500">
              {STATUS.PROCESSING.toUpperCase()}
            </option>
            <option value={STATUS.SHIPPED} className="bg-lime-500">
              {STATUS.SHIPPED.toUpperCase()}
            </option>
            <option value={STATUS.DELIVERED} className="bg-green-500">
              {STATUS.DELIVERED.toUpperCase()}
            </option>
            <option value={STATUS.CANCELLED} className="bg-red-500">
              {STATUS.CANCELLED.toUpperCase()}
            </option>
            <option value={STATUS.REFUNDED} className="bg-orange-500">
              {STATUS.REFUNDED.toUpperCase()}
            </option>
          </select>
        </div>

        {/* <div
        className={`${styles.button} mt-5 !bg-[#FCE1E6] !rounded-[4px] text-[#E94560] font-[600] !h-[45px] text-[18px]`}
        onClick={
          data?.status !== "Processing refund"
            ? orderUpdateHandler
            : refundOrderUpdateHandler
        }
      >
        Update Status
      </div> */}
      </div>
    </>
  );
};

export default OrderDetails;
