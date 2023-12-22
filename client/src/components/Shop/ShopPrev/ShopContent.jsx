import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import ShopProducts from "./ShopProducts";
import { loadShopProducts } from "../../../redux/actions/loadShopProducts";
import { useDispatch } from "react-redux";
import ShopReviews from "./ShopReviews";

const ShopContent = ({ shopId }) => {
  const [activeTab, setActiveTab] = useState(1);

  const dispatch = useDispatch();
  const { products, error, productsStatus } = useSelector(
    (state) => state.shop
  );
  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    try {
      const res = await dispatch(loadShopProducts({ shopId }));
      console.log(res);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <>
      <div className="w-full flex">
        <div className="flex items-center" onClick={() => setActiveTab(1)}>
          <h5
            className={`font-[600] text-[20px] ${
              activeTab === 1 ? "text-red-500" : "text-[#333]"
            } cursor-pointer pr-[20px]`}
          >
            Shop Products
          </h5>
        </div>
        <div className="flex items-center" onClick={() => setActiveTab(2)}>
          <h5
            className={`font-[600] text-[20px] ${
              activeTab === 2 ? "text-red-500" : "text-[#333]"
            } cursor-pointer pr-[20px]`}
          >
            Running Events
          </h5>
        </div>

        <div className="flex items-center" onClick={() => setActiveTab(3)}>
          <h5
            className={`font-[600] text-[20px] ${
              activeTab === 3 ? "text-red-500" : "text-[#333]"
            } cursor-pointer pr-[20px]`}
          >
            Shop Reviews
          </h5>
        </div>
      </div>
      {activeTab === 1 && <ShopProducts />}
      {activeTab === 3 && <ShopReviews shopId={shopId} />}
    </>
  );
};
export default ShopContent;
