import React, { useEffect } from "react";
import DataTable from "react-data-table-component";
import { AiOutlineEye, AiOutlineDelete } from "react-icons/ai";
import Loader from "../Loader";
import { useDispatch } from "react-redux";
import { loadShopProducts } from "../../redux/actions/loadShopProducts";
import { toast } from "react-toastify";
import { useSelector } from "react-redux";
import STATUS from "../../constants/status";
import { deleteProduct } from "../../redux/actions/deleteProduct";
import { FiEdit } from "react-icons/fi";

const ProductsTable = ({ shopId, token, handleUpdateProduct }) => {
  const dispatch = useDispatch();
  const { products, error, productsStatus } = useSelector(
    (state) => state.shop
  );

  const [loading, setLoading] = React.useState(false);

  useEffect(() => {
    if (productsStatus === STATUS.FAILURE) {
      toast.error(error);
    }
  }, [productsStatus]);

  useEffect(() => {
    asyncFetchProducts();
  }, []);

  const asyncFetchProducts = async () => {
    try {
      await dispatch(loadShopProducts({ shopId }));
    } catch (error) {
      toast.error(error);
    }
  };

  const handleDelete = async (id) => {
    setLoading(true);
    try {
      console.log("dispatching delete product");
      const res = await dispatch(deleteProduct({ productId: id, token }));
      toast.success(res.message);
      await dispatch(loadShopProducts({ shopId }));
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const onEdit = (productId) => {
    const product = products.find((product) => product._id === productId);
    handleUpdateProduct({ product });
  };

  // Table columns
  const columns = [
    { name: "Title", selector: "name", sortable: true },
    { name: "Category", selector: "category", sortable: true },
    { name: "Tags", selector: "tags", sortable: true },
    { name: "price", selector: "originalPrice", sortable: true },
    { name: "Discounted Price", selector: "discountPrice", sortable: true },
    { name: "Stock", selector: "stock", sortable: true },
    { name: "Sold out", selector: "sold_out", sortable: true },
    {
      name: "Preview",
      cell: (row) => (
        <button
          onClick={(e) => {
            window.open(`/products/${row._id}`, "_blank");
          }}
        >
          <AiOutlineEye size={20} />
        </button>
      ),
      ignoreRowClick: true,
      allowOverflow: true,
      button: true,
    },
    {
      name: "Edit",
      cell: (row) => (
        <button
          disabled={loading}
          className={`${loading ? "button-disabled" : ""} ${
            loading ? "text-red" : ""
          }`}
          onClick={(e) => onEdit(row._id)}
        >
          <FiEdit size={20} />
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
    <div className="w-full">
      {productsStatus === STATUS.IDLE ||
        (productsStatus === STATUS.LOADING && <Loader />)}
      {productsStatus === STATUS.FAILURE && (
        <div className="bg-red-300 text-white px-4 py-2 rounded-md border-2 border-red-500">
          {error}
        </div>
      )}
      {productsStatus === STATUS.SUCCESS && (
        <div className="w-full h-full">
          <DataTable
            title="Products"
            columns={columns}
            data={products}
            pagination
            highlightOnHover
            responsive
            className="w-full overflow-x-scroll"
          />
        </div>
      )}
    </div>
  );
};

export default ProductsTable;
