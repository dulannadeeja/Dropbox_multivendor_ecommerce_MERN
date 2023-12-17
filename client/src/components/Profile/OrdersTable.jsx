import React from "react";
import DataTable from "react-data-table-component";

const OrdersTable = () => {
  // Dummy data
  const data = [
    { id: 1, orderNumber: "ORD001", customer: "John Doe", total: 100 },
    { id: 2, orderNumber: "ORD002", customer: "Jane Smith", total: 150 },
    { id: 3, orderNumber: "ORD003", customer: "Mike Johnson", total: 200 },
    { id: 4, orderNumber: "ORD004", customer: "Mary Jones", total: 250 },
    { id: 5, orderNumber: "ORD005", customer: "John Doe", total: 100 },
    { id: 6, orderNumber: "ORD006", customer: "Jane Smith", total: 150 },
    { id: 7, orderNumber: "ORD007", customer: "Mike Johnson", total: 200 },
    { id: 8, orderNumber: "ORD008", customer: "Mary Jones", total: 250 },
    { id: 9, orderNumber: "ORD009", customer: "John Doe", total: 100 },
    { id: 10, orderNumber: "ORD010", customer: "Jane Smith", total: 150 },
    { id: 11, orderNumber: "ORD011", customer: "Mike Johnson", total: 200 },
  ];

  // Table columns
  const columns = [
    { name: "Order Number", selector: "orderNumber", sortable: true },
    { name: "Customer", selector: "customer", sortable: true },
    { name: "Total", selector: "total", sortable: true },
  ];

  return (
    <DataTable
      title="Orders"
      columns={columns}
      data={data}
      pagination
      highlightOnHover
    />
  );
};

export default OrdersTable;
