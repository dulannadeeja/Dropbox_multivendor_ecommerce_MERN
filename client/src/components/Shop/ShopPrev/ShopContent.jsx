import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import ShopProducts from "./ShopProducts";
import { loadShopProducts } from "../../../redux/actions/loadShopProducts";
import { useDispatch } from "react-redux";
import ShopReviews from "./ShopReviews";
import ShopEvents from "./ShopEvents.jsx";

const ShopContent = ({ shopId }) => {
  console.log("shop content rendered" + shopId);

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
      <div className="w-full flex mb-5 bg-white px-10 py-4 rounded-md shadow-lg">
        <div className="flex items-center" onClick={() => setActiveTab(1)}>
          <h5
            className={`font-[600] text-[20px] ${
              activeTab === 1 ? "text-red-500" : "text-[#333]"
            } cursor-pointer pr-[20px]`}
          >
            Products
          </h5>
        </div>
        <div className="flex items-center" onClick={() => setActiveTab(2)}>
          <h5
            className={`font-[600] text-[20px] ${
              activeTab === 2 ? "text-red-500" : "text-[#333]"
            } cursor-pointer pr-[20px]`}
          >
            Events
          </h5>
        </div>

        <div className="flex items-center" onClick={() => setActiveTab(3)}>
          <h5
            className={`font-[600] text-[20px] ${
              activeTab === 3 ? "text-red-500" : "text-[#333]"
            } cursor-pointer pr-[20px]`}
          >
            Reviews
          </h5>
        </div>
      </div>
      <div className="w-full">
        {activeTab === 1 && <ShopProducts shopId={shopId} />}
        {activeTab === 2 && <ShopEvents shopId={shopId} />}
        {activeTab === 3 && <ShopReviews shopId={shopId} />}
      </div>
    </>
  );
};
export default ShopContent;
