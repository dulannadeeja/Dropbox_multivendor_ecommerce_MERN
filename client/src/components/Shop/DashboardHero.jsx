import React, { useEffect } from "react";
import { AiOutlineArrowRight, AiOutlineMoneyCollect } from "react-icons/ai";
import styles from "../../styles/styles";
import { Link } from "react-router-dom";
import DataTable from "react-data-table-component";
import axios from "axios";
import { server } from "../../server";
import { useSelector } from "react-redux";
import STATUS from "../../constants/status";
import { useDispatch } from "react-redux";
import { loadShopOrders } from "../../redux/actions/loadShopOrders";
import { useNavigate } from "react-router-dom";

const DashboardHero = ({ setActive }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { shop } = useSelector((state) => state.shop);
  const { user } = useSelector((state) => state.user);

  const [availableBalance, setAvailableBalance] = React.useState(0);
  const [ordersCount, setOrdersCount] = React.useState(0);
  const [productsCount, setProductsCount] = React.useState(0);
  const [outOfStockCount, setOutOfStockCount] = React.useState(0);
  const [pendingOrdersCount, setPendingOrdersCount] = React.useState(0);

  const [recentOrders, setRecentOrders] = React.useState([{}]);

  const [status, setStatus] = React.useState(STATUS.IDLE);

  useEffect(() => {
    fetchStats();
    fetchOrders();
  }, []);

  const fetchStats = async () => {
    setStatus(STATUS.LOADING);
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };

      const shodId = shop._id;

      // fetch data
      const res = await axios.get(`${server}/shop/stats/${shodId}`, config, {
        withCredentials: true,
      });

      // if success then set the data
      setAvailableBalance(res.data.shopStatistics.totalRevenue);
      setOrdersCount(res.data.shopStatistics.totalNumberOfOrders);
      setProductsCount(res.data.shopStatistics.totalNumberOfProducts);
      setOutOfStockCount(res.data.shopStatistics.outOfStockProducts);
      setPendingOrdersCount(res.data.shopStatistics.pendingOrders);

      console.log(res.data);
    } catch (err) {
      console.log(err);
    } finally {
      setStatus(STATUS.SUCCESS);
    }
  };

  const fetchOrders = async () => {
    try {
      setStatus(STATUS.LOADING);

      // load orders of the store

      const res = await dispatch(loadShopOrders());

      // if order is found then set the status
      setStatus(STATUS.SUCCESS);

      // if success then set the data
      const allOrders = res.data.orders;
      const recentOrders = allOrders.slice(0, 10);
      setRecentOrders(recentOrders);
    } catch (error) {
      // if error then set the status

      console.log(error);
    } finally {
      setStatus(STATUS.SUCCESS);
    }
  };

  useEffect(() => {}, []);

  const navigateToOrder = (id) => {
    navigate(`/shop/order/${id}`);
  };

  const formatDateTime = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();

    const diffInMilliseconds = now - date;
    const seconds = Math.floor(diffInMilliseconds / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (seconds < 60) {
      return `${seconds} seconds ago`;
    } else if (minutes < 60) {
      return `${minutes} minutes ago`;
    } else if (hours < 24) {
      return `${hours} hours ago`;
    } else {
      return `${days} days ago`;
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount);
  };

  const columns = [
    { name: "Order ID", selector: "_id", sortable: true },
    {
      name: "Purchase Date",
      selector: "createdAt",
      sortable: true,
      format: (row) => formatDateTime(row.createdAt),
    },
    {
      name: "Purchase Amount",
      selector: "cartTotal",
      sortable: true,
      format: (row) => formatCurrency(row.cartTotal),
    },
    { name: "Payment Method", selector: "paymentMethod", sortable: true },
    { name: "Status", selector: "orderStatus", sortable: true },
    {
      name: "Preview",
      cell: (row) => (
        <button onClick={() => navigateToOrder(row._id)}>
          <AiOutlineArrowRight size={20} />
        </button>
      ),
      ignoreRowClick: true,
      allowOverflow: true,
      button: true,
    },
  ];

  return (
    <>
      {status === STATUS.SUCCESS && (
        <div className="w-full p-8">
          <h3 className="text-[22px] font-Poppins pb-2">Overview</h3>
          <div className="w-full items-center gap-5 flex flex-col md:grid md:grid-cols-2 lg:grid-cols-3">
            {/* total earnings */}
            <div className="w-full bg-white rounded-md shadow-lg border-2 p-5 md:p-8 flex flex-col items-start gap-3 md:col-span-2">
              <div className="flex items-center">
                <AiOutlineMoneyCollect
                  size={30}
                  className="mr-2"
                  fill="#00000085"
                />
                <h3
                  className={`${styles.productTitle} !text-[18px] leading-5 !font-[400] text-[#00000085]`}
                >
                  Account Balance{" "}
                  <span className="text-[16px]">(with 10% service charge)</span>
                </h3>
              </div>
              <h5 className="pt-2 pl-[36px] text-[22px] font-[500]">
                ${availableBalance}
              </h5>
              <button onClick={() => setActive(7)}>
                <h5 className="pt-4 pl-[2] text-[#077f9c]">Withdraw Money</h5>
              </button>
            </div>
            {/* pending orders */}
            <div className="w-full bg-white rounded-md shadow-lg border-2 p-5 md:p-8 flex flex-col items-start gap-3">
              <div className="flex items-center">
                <AiOutlineMoneyCollect
                  size={30}
                  className="mr-2"
                  fill="#00000085"
                />
                <h3
                  className={`${styles.productTitle} !text-[18px] leading-5 !font-[400] text-[#00000085]`}
                >
                  Pending Orders
                </h3>
              </div>
              <h5 className="pt-2 pl-[36px] text-[22px] font-[500]">
                {pendingOrdersCount}
              </h5>
              <button onClick={() => setActive(2)}>
                <h5 className="pt-4 pl-[2] text-[#077f9c]">View All Orders</h5>
              </button>
            </div>

            {/* total orders */}
            <div className="w-full bg-white rounded-md shadow-lg border-2 p-5 md:p-8 flex flex-col items-start gap-3">
              <div className="flex items-center">
                <AiOutlineMoneyCollect
                  size={30}
                  className="mr-2"
                  fill="#00000085"
                />
                <h3
                  className={`${styles.productTitle} !text-[18px] leading-5 !font-[400] text-[#00000085]`}
                >
                  Total Orders
                </h3>
              </div>
              <h5 className="pt-2 pl-[36px] text-[22px] font-[500]">
                {ordersCount}
              </h5>
              <button onClick={() => setActive(2)}>
                <h5 className="pt-4 pl-[2] text-[#077f9c]">View All Orders</h5>
              </button>
            </div>

            {/* total products */}
            <div className="w-full bg-white rounded-md shadow-lg border-2 p-5 md:p-8 flex flex-col items-start gap-3">
              <div className="flex items-center">
                <AiOutlineMoneyCollect
                  size={30}
                  className="mr-2"
                  fill="#00000085"
                />
                <h3
                  className={`${styles.productTitle} !text-[18px] leading-5 !font-[400] text-[#00000085]`}
                >
                  Total Products
                </h3>
              </div>
              <h5 className="pt-2 pl-[36px] text-[22px] font-[500]">
                {productsCount}
              </h5>
              <button onClick={() => setActive(3)}>
                <h5 className="pt-4 pl-[2] text-[#077f9c]">
                  View All Products
                </h5>
              </button>
            </div>

            {/* out of stock */}
            <div className="w-full bg-white rounded-md shadow-lg border-2 p-5 md:p-8 flex flex-col items-start gap-3">
              <div className="flex items-center">
                <AiOutlineMoneyCollect
                  size={30}
                  className="mr-2"
                  fill="#00000085"
                />
                <h3
                  className={`${styles.productTitle} !text-[18px] leading-5 !font-[400] text-[#00000085]`}
                >
                  Out of Stock
                </h3>
              </div>
              <h5 className="pt-2 pl-[36px] text-[22px] font-[500]">
                {outOfStockCount}
              </h5>
              <button onClick={() => setActive(3)}>
                <h5 className="pt-4 pl-[2] text-[#077f9c]">
                  View All Products
                </h5>
              </button>
            </div>

            {/* Additional similar blocks for All Orders and All Products with dummy values */}
          </div>
          <br />
          <h3 className="text-[22px] font-Poppins pb-2">Latest Orders</h3>
          <div className="w-full min-h-[45vh] bg-white rounded">
            <DataTable
              columns={columns}
              data={recentOrders}
              pagination
              highlightOnHover
              striped
              noHeader
              pointerOnHover
            />
          </div>
        </div>
      )}
    </>
  );
};

export default DashboardHero;
