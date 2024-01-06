import React, { useEffect } from "react";
import DataTable from "react-data-table-component";
import { AiOutlineEye, AiOutlineDelete } from "react-icons/ai";
import Loader from "../Loader";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";
import { useSelector } from "react-redux";
import STATUS from "../../constants/status";
import { loadShopEvents } from "../../redux/actions/loadShopEvents";
import { deleteEvent } from "../../redux/actions/deleteEvent";
import moment from "moment";

const EventsTable = ({ shopId, token }) => {
  console.log("events table rendered");
  const dispatch = useDispatch();
  const { events, error, eventStatus } = useSelector((state) => state.event);

  const [loading, setLoading] = React.useState(false);

  useEffect(() => {
    if (eventStatus === STATUS.FAILURE) {
      toast.error(error);
    }
  }, [eventStatus, events]);

  useEffect(() => {
    asyncFetchEvents();
  }, []);

  const asyncFetchEvents = async () => {
    try {
      await dispatch(loadShopEvents({ token, shopId }));
      console.log("events fetched");
      console.log(events);
    } catch (error) {
      toast.error(error);
    }
  };

  const handleDelete = async (id) => {
    setLoading(true);
    try {
      console.log("dispatching delete event");
      const res = await dispatch(deleteEvent({ eventId: id, token }));
      toast.success(res.message);
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  // Table columns
  const columns = [
    { name: "Title", selector: "title", sortable: true },
    { name: "Event Type", selector: "eventType", sortable: true },
    { name: "Discount Amount", selector: "discountAmount", sortable: true },
    {
      name: "Start Date",
      selector: "startDate",
      sortable: true,
      format: (row) => moment(row.startDate).format("MMM D, YYYY"),
    },
    {
      name: "End Date",
      selector: "endDate",
      sortable: true,
      format: (row) => moment(row.endDate).format("MMM D, YYYY"),
    },
    { name: "Coupon Code", selector: "couponCode", sortable: true },
    { name: "product", selector: "product.name", sortable: true },
    {
      name: "Preview",
      cell: (row) => (
        <button
          disabled={loading}
          className={`${loading ? "button-disabled" : ""} ${
            loading ? "text-red" : ""
          }`}
          onClick={(e) =>
            (window.location.href = `/products/${row.product._id}`)
          }
        >
          <AiOutlineEye size={20} />
        </button>
      ),
      ignoreRowClick: true,
      allowOverflow: true,
      button: true,
    },
    {
      name: "Delete",
      cell: (row) => (
        <button
          disabled={loading}
          className={`${loading ? "button-disabled" : ""} ${
            loading ? "text-red" : ""
          }`}
          onClick={(e) => handleDelete(row._id)}
        >
          <AiOutlineDelete size={20} />
        </button>
      ),
      ignoreRowClick: true,
      allowOverflow: true,
      button: true,
    },
  ];

  return (
    <>
      {eventStatus === STATUS.IDLE ||
        (eventStatus === STATUS.LOADING && <Loader />)}
      {eventStatus === STATUS.FAILURE && (
        <div className="bg-red-300 text-white px-4 py-2 rounded-md border-2 border-red-500">
          {error}
        </div>
      )}
      {eventStatus === STATUS.SUCCESS && (
        <div>
          <DataTable
            title="Events"
            columns={columns}
            data={events}
            pagination
            highlightOnHover
            responsive
          />
        </div>
      )}
    </>
  );
};

export default EventsTable;
