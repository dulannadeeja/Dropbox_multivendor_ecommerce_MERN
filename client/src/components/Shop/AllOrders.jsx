import React from "react";
import DataTable from "react-data-table-component";
import { useEffect } from "react";
import { AiOutlineEye, AiOutlineDelete } from "react-icons/ai";
import { AiOutlineStar } from "react-icons/ai";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { loadShopOrders } from "../../redux/actions/loadShopOrders";

import STATUS from "../../constants/status";

const AllOrdersTable = () => {
  const { user } = useSelector((state) => state.user);
  const { orders } = useSelector((state) => state.order);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [status, setStatus] = React.useState(STATUS.IDLE);
  const [ordersData, setOrdersData] = React.useState([]);
  const [products, setProducts] = React.useState([{}]);
  const [loading, setLoading] = React.useState(false);

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
    setOrdersData(orders);
  }, [orders, status]);

  const navigateToOrder = (id) => {
    navigate(`/shop/order/${id}`);
  };

  // Table columns
  const columns = [
    { name: "Order ID", selector: "_id", sortable: true },
    { name: "Purchase Date", selector: "createdAt", sortable: true },
    { name: "Purchase Amount", selector: "cartTotal", sortable: true },
    { name: "Payment Method", selector: "paymentMethod", sortable: true },
    { name: "Status", selector: "orderStatus", sortable: true },
    {
      name: "Preview",
      cell: (row) => (
        <button onClick={() => navigateToOrder(row._id)}>
          <AiOutlineEye size={20} />
        </button>
      ),
      ignoreRowClick: true,
      allowOverflow: true,
      button: true,
    },
  ];

  return (
    <div>
      <div>
        <DataTable
          title="Orders History"
          columns={columns}
          data={ordersData}
          pagination
          highlightOnHover
          responsive
        />
      </div>
    </div>
  );
};

export default AllOrdersTable;
