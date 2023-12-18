import React from "react";
import DataTable from "react-data-table-component";

const TrackOrdersTable = () => {
  // Dummy data
  const data = [
    { id: 1, orderNumber: "ORD001", status: "In Progress" },
    { id: 2, orderNumber: "ORD002", status: "Delivered" },
    { id: 3, orderNumber: "ORD003", status: "Shipped" },
    // Add more dummy data here
  ];

  // Columns configuration
  const columns = [
    {
      name: "Order Number",
      selector: "orderNumber",
      sortable: true,
    },
    {
      name: "Status",
      selector: "status",
      sortable: true,
    },
    {
      name: "Actions",
      cell: (row) => (
        <button onClick={() => navigateToOrderTrack(row.id)}>Track</button>
      ),
    },
  ];

  // Function to navigate to orderTrack page
  const navigateToOrderTrack = (orderId) => {
    // Add your navigation logic here
    console.log(`Navigating to orderTrack page for order ID: ${orderId}`);
  };

  return (
    <DataTable title="Track Orders" columns={columns} data={data} pagination />
  );
};

export default TrackOrdersTable;
