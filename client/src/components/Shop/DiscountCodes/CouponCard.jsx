import React from "react";
import { AiOutlineDelete } from "react-icons/ai";
import { useCreateCouponContext } from "../../../contexts/CreateCouponContext";
import axios from "axios";
import { server } from "../../../server";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";

const CouponCard = ({ item }) => {
  const { token } = useSelector((state) => state.user);
  const { shop } = useSelector((state) => state.shop);
  const [loading, setLoading] = React.useState(false);
  const { allCoupons, setAllCoupons } = useCreateCouponContext();

  const handleDelete = async (id) => {
    setLoading(true);
    try {
      const newFormData = new FormData();
      newFormData.append("shopId", shop._id);
      const config = {
        headers: {
          "Content-Type": "application/json",
          authorization: `Bearer ${token}`,
        },
      };
      const res = await axios.post(
        `${server}/coupon/delete/${id}`,
        {
          shopId: shop._id,
        },
        config
      );

      if (res.status === 200) {
        toast.success("Coupon deleted successfully!");
        console.log(res.data);
        setAllCoupons(
          allCoupons.filter((item) => {
            return item._id !== id;
          })
        );
      }
    } catch (error) {
      console.log(error);
      toast.error(error.response?.data?.message || "Something went wrong!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div
        className="w-full bg-white h-min 800px:h-[70px] rounded-[4px] flex items-center px-3 shadow justify-between pr-10 mb-5"
        key={item.code}
      >
        <div className="flex items-center">
          <h5 className="pl-5 font-[600]">{item.type}</h5>
        </div>
        <div className="pl-8 flex items-center">
          <h6 className="text-[12px] 800px:text-[unset]">
            {item.discountAmount} {item.type}
          </h6>
        </div>
        <div className="pl-8 flex items-center">
          <h6 className="text-[12px] 800px:text-[unset]">
            {item && item.minOrderAmount}
          </h6>
        </div>
        <div className="pl-8 flex items-center">
          <h6 className="text-[12px] 800px:text-[unset]">
            {item && item.expirationDate}
          </h6>
        </div>
        <div className="pl-8 flex items-center">
          <h6 className="text-[12px] 800px:text-[unset]">
            {item && item.startDate}
          </h6>
        </div>
        {loading ? (
          <div
            className="min-w-[10%] flex items-center justify-between pl-8 opacity-50 pointer-events-none"
            aria-disabled
            disabled
          >
            <AiOutlineDelete size={25} className="cursor-pointer" />
          </div>
        ) : (
          <div
            className={`min-w-[10%] flex items-center justify-between pl-8 ${
              loading && "opacity-50"
            }`}
          >
            <AiOutlineDelete
              size={25}
              className="cursor-pointer"
              onClick={() => handleDelete(item._id)}
            />
          </div>
        )}
      </div>
    </>
  );
};

export default CouponCard;
