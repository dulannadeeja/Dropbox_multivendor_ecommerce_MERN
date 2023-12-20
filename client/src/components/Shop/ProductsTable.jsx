import React, { useEffect } from "react";
import DataTable from "react-data-table-component";
import { AiOutlineEye, AiOutlineDelete } from "react-icons/ai";
import axios from "axios";
import { server } from "../../server";
import Loader from "../Loader";

const ProductsTable = ({ shopId, token }) => {
  const [products, setProducts] = React.useState([]);
  const [loading, setLoading] = React.useState(false);

  useEffect(() => {
    const asyncFetchProducts = async () => {
      setLoading(true);
      try {
        const config = {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        };
        const res = await axios.get(
          `${server}/shop/products/${shopId}`,
          config
        );
        console.log(res.data);
        // set products array from res.products object
        const data = res.data.products;
        setProducts(data);
        setLoading(false);
      } catch (error) {
        setLoading(false);
        console.log(error);
      }
    };
    asyncFetchProducts();
  }, []);

  // Table columns
  const columns = [
    { name: "ID", selector: "_id", sortable: true },
    { name: "Title", selector: "name", sortable: true },
    { name: "Description", selector: "description" },
    { name: "Category", selector: "category", sortable: true },
    { name: "Tags", selector: "tags", sortable: true },
    { name: "price", selector: "originalPrice", sortable: true },
    { name: "Discounted Price", selector: "discountPrice", sortable: true },
    { name: "Stock", selector: "stock", sortable: true },
    { name: "Sold out", selector: "sold_out", sortable: true },
    {
      name: "Preview",
      cell: (row) => (
        <button>
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
        <button>
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
      {loading ? (
        <Loader />
      ) : (
        <DataTable
          title="Products"
          columns={columns}
          data={products}
          pagination
          highlightOnHover
          responsive
        />
      )}
    </>
  );
};

export default ProductsTable;
