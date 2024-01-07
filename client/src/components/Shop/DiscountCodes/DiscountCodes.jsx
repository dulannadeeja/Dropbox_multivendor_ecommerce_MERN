import React, { useEffect } from "react";
// import CategoryPopup from "./CategoryPopup";
import { server } from "../../../server";
import axios from "axios";
import { useSelector } from "react-redux";
import { useCreateCouponContext } from "../../../contexts/CreateCouponContext";
import CouponCard from "./CouponCard";
import styles from "../../../styles/styles";
import CouponFormPopup from "./CouponFormPopup";

const DiscountCodes = () => {
  const { allCoupons, setAllCoupons } = useCreateCouponContext();
  const { token } = useSelector((state) => state.user);
  const { shop } = useSelector((state) => state.shop);

  const [open, setOpen] = React.useState(false);

  console.log(shop);
  useEffect(() => {
    fetchAllCoupons();
    console.log(allCoupons);
  }, []);

  const fetchAllCoupons = async () => {
    try {
      const config = {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      };

      const res = await axios.get(`${server}/coupon/all/${shop._id}`, config, {
        withCredentials: true,
      });

      if (res.status === 200) {
        setAllCoupons(res.data.coupons);
        console.log(res.data);
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className={`bg-white min-h-screen`}>
      <div className="max-w-6xl mx-auto px-5 py-5">
        <div>
          <div>
            <h3 className="text-2xl font-bold">Discount Codes</h3>
            <p className="text-sm text-gray-500">
              Manage your discount codes here for your shop. You can create new
              discount codes and delete existing ones.
            </p>
          </div>
          {/* total codes active */}
          <div className="flex justify-between items-center mt-5 border-b-2 pb-5 mb-10">
            <div>
              <p className="text-sm text-gray-500">
                Total codes active:{" "}
                <span className="text-gray-800 font-bold">
                  {allCoupons.length}
                </span>
              </p>
            </div>
            <div>
              <button
                className={`${styles.button} px-5 py-2`}
                onClick={() => setOpen(true)}
              >
                Create New
              </button>
            </div>
          </div>
        </div>
        <div>
          {allCoupons.map((item) => {
            return <CouponCard item={item} key={item._id} />;
          })}
        </div>
      </div>
      {/* Create coupon code popup */}
      {open && (
        <div className="fixed top-0 left-0 w-full h-full bg-[#000000ba] z-50 flex justify-center items-center">
          <div className="w-[90%] sm:w-[50%] sm:h-[90%] bg-white rounded-lg shadow-lg p-5 overflow-auto">
            <CouponFormPopup setOpen={setOpen} />
          </div>
        </div>
      )}
      {/* <CategoryPopup /> */}
    </div>
  );
};

export default DiscountCodes;
