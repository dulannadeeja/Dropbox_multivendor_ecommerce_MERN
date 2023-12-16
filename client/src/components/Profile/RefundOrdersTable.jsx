import React from "react";
import DataTable from "react-data-table-component";

const RefundOrdersTable = () => {
  // Dummy data
  const data = [
    {
      id: 1,
      orderNumber: "ORD001",
      customerName: "John Doe",
      refundAmount: "$50.00",
    },
    {
      id: 2,
      orderNumber: "ORD002",
      customerName: "Jane Smith",
      refundAmount: "$75.00",
    },
    {
      id: 3,
      orderNumber: "ORD003",
      customerName: "Mike Johnson",
      refundAmount: "$100.00",
    },
    // Add more dummy data here...
  ];

  // Columns configuration
  const columns = [
    { name: "Order Number", selector: "orderNumber", sortable: true },
    { name: "Customer Name", selector: "customerName", sortable: true },
    { name: "Refund Amount", selector: "refundAmount", sortable: true },
    {
      name: "Actions",
      cell: (row) => (
        <div>
          <button onClick={() => handleEdit(row)}>Edit</button>
          <button onClick={() => handleDelete(row)}>Delete</button>
        </div>
      ),
    },
  ];

  // Handle edit action
  const handleEdit = (row) => {
    // Implement your edit logic here...
  };

  // Handle delete action
  const handleDelete = (row) => {
    // Implement your delete logic here...
  };

  return (
    <DataTable
      title="Refunded Orders"
      columns={columns}
      data={data}
      pagination
      paginationPerPage={10}
      paginationRowsPerPageOptions={[10, 20, 30]}
    />
  );
};

export default RefundOrdersTable;
