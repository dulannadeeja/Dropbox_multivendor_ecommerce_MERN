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
    <>
      <div className="w-full bg-white ">
        <div className="w-full flex items-center justify-between px-3 py-5">
          <h3 className="text-2xl font-bold">Discount Codes</h3>
          <button className={styles.button} onClick={() => setOpen(true)}>
            Genarate New
          </button>
        </div>
      </div>
      <div>
        {allCoupons.map((item) => {
          return <CouponCard item={item} key={item._id} />;
        })}
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
    </>
  );
};

export default DiscountCodes;
