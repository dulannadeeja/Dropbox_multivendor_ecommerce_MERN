import React, { useEffect } from "react";
import ProductCard from "../../Home/ProductCard";
import { useSelector } from "react-redux";

const ShopProducts = () => {
  const { products } = useSelector((state) => state.shop);
  return (
    <>
      {products && products.length < 0 && (
        <h5 className="text-center text-[#333]">
          This seller has no products yet!
        </h5>
      )}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 ">
        {/* product card */}
        {products?.map((product) => {
          return <ProductCard product={product} key={product._id} />;
        })}
      </div>
    </>
  );
};

export default ShopProducts;
