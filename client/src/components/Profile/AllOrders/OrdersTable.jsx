import React from "react";
import DataTable from "react-data-table-component";
import axios from "axios";
import { server } from "../../../server";
import { useEffect } from "react";
import { AiOutlineEye, AiOutlineDelete } from "react-icons/ai";
import { AiOutlineStar } from "react-icons/ai";
import { useNavigate } from "react-router-dom";

const OrdersTable = ({ order }) => {
  const navigate = useNavigate();
  const [orders, setOrders] = React.useState([]);
  const [loading, setLoading] = React.useState(false);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const res = await axios.get(`${server}/order/all`, {
        withCredentials: true,
      });
      setOrders(res.data.orders);
      console.log(res.data.orders);
    } catch (err) {
      console.error(err);
    }
  };

  const navigateToOrder = (id) => {
    navigate(`/order/${id}`);
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
    {
      name: "Review",
      cell: (row) => (
        <button
          disabled={loading}
          className={`${loading ? "button-disabled" : ""} ${
            loading ? "text-red" : ""
          }`}
        >
          <AiOutlineStar
            size={20}
            color="#f6ba00"
            className="mr-2 cursor-pointer"
          />
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
          data={orders}
          pagination
          highlightOnHover
          responsive
        />
      </div>
    </div>
  );
};

export default OrdersTable;
