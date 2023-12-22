import React, { useEffect } from "react";
import ProductsTable from "./ProductsTable";
import { useSelector } from "react-redux";

const AllProducts = () => {
  const { shop } = useSelector((state) => state.shop);

  console.log(shop);

  const { user, token } = useSelector((state) => state.user);

  return <>{<ProductsTable shopId={shop?._id} token={token} />}</>;
};

export default AllProducts;
