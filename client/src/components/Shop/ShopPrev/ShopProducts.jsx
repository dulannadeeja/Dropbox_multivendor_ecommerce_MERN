import React, { useEffect } from "react";
import ProductCard from "../../Home/ProductCard";
import { useSelector } from "react-redux";

const ShopProducts = () => {
  const { products } = useSelector((state) => state.shop);
  return (
    <div className="flex gap-2 md:gap-6">
      {products?.map((product) => {
        return <ProductCard product={product} key={product._id} />;
      })}
    </div>
  );
};

export default ShopProducts;
