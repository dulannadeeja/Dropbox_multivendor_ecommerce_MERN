import React, { useEffect } from "react";
import ProductsTable from "./ProductsTable";
import { useSelector } from "react-redux";
import { RxCross2 } from "react-icons/rx";
import UpdateProductModel from "./UpdateProductModel";
import { useDispatch } from "react-redux";
import { loadShopProducts } from "../../redux/actions/loadShopProducts";
import { toast } from "react-toastify";

const AllProducts = () => {
  const dispatch = useDispatch();

  const { shop } = useSelector((state) => state.shop);
  const [updateModel, setUpdateModel] = React.useState(false);
  const [product, setProduct] = React.useState(null);

  const { user, token } = useSelector((state) => state.user);

  const handleUpdateProduct = ({ product }) => {
    setUpdateModel(true);
    setProduct(product);
  };

  const handleEditComplete = () => {
    setUpdateModel(false);
    setProduct(null);
    const asyncFetchProducts = async () => {
      try {
        await dispatch(loadShopProducts({ shopId: shop?._id }));
      } catch (error) {
        toast.error(error);
      }
    };
    asyncFetchProducts();
  };

  return (
    <div className="relative w-full h-full">
      {/* ProductsTable component */}
      <ProductsTable
        shopId={shop?._id}
        token={token}
        handleUpdateProduct={handleUpdateProduct}
      />

      {/* Overlay */}
      {updateModel && (
        <div className="fixed inset-0 z-[70] flex items-center justify-center h-full w-full bg-black bg-opacity-50 md:p-20">
          {/* Popup */}
          <div className="bg-white mx-auto z-[100] md:max-w-[90%] max-h-[95vh] md:p-4 rounded-lg overflow-scroll">
            {/* Popup header with close */}
            <div className="flex justify-end items-center border-b border-[#e4dfdf] mb-5">
              <button className="text-xl" onClick={() => setUpdateModel(false)}>
                <RxCross2 className="h-8 w-8" aria-hidden="true" />
              </button>
            </div>

            {/* Popup body */}
            <div className="flex flex-col h-full">
              <UpdateProductModel
                product={product}
                onEditComplete={handleEditComplete}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AllProducts;
