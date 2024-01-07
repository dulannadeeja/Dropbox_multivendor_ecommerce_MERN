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
          allCoupons.filter((coupon) => {
            return coupon._id !== id;
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

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString();
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount);
  };

  return (
    <>
      <div
        className="w-full flex flex-col shadow-md p-5 gap-3 border-b-2 md:grid md:grid-cols-2 lg:grid-cols-12 md:items-center"
        key={item.code}
      >
        {/* type of the event */}
        <div className="lg:col-span-2">
          {item.type === "Percentage Off" && (
            <div className="flex items-center">
              <h5 className="font-semibold">{`${item.discountAmount}% off`}</h5>
            </div>
          )}
          {item.type === "Fixed Amount Off" && (
            <div className="flex items-center">
              <h5 className="font-semibold">{`${formatCurrency(
                item.discountAmount
              )} off`}</h5>
            </div>
          )}
        </div>

        {/* conditions */}
        <div className="flex flex-col lg:col-span-5">
          {/* min order amount */}
          <div className="">
            {item.minOrderAmount ? (
              <div className="flex items-center">
                <h6 className="text-slate-500">
                  Min order amount -{" "}
                  <span className="font-semibold text-slate-800">{`${formatCurrency(
                    item.minOrderAmount
                  )}`}</span>
                </h6>
              </div>
            ) : null}
          </div>
          {/* max discount amount */}
          <div className="">
            {item.maxDiscountAmount ? (
              <div className="flex items-center">
                <h6 className="text-slate-500">
                  Max discount amount -{" "}
                  <span className="font-semibold text-slate-800">{`${formatCurrency(
                    item.maxDiscountAmount
                  )}`}</span>
                </h6>
              </div>
            ) : null}
          </div>
        </div>

        {/* expiration date */}
        <div className="lg:col-span-2">
          {new Date(item.expirationDate) < new Date() && (
            <h6 className="inline-flex items-center rounded-md bg-purple-50 px-2 py-1 text-xs font-medium text-red-700 ring-1 ring-inset ring-purple-700/10">
              Expired on {formatDate(item.expirationDate)}
            </h6>
          )}
          {new Date(item.expirationDate) > new Date() && (
            <h6 className="inline-flex items-center rounded-md bg-green-50 px-2 py-1 text-xs font-medium text-green-700 ring-1 ring-inset ring-green-700/10">
              Expires on {formatDate(item.expirationDate)}
            </h6>
          )}
        </div>
        {/* start date */}
        <div className="lg:col-span-2">
          {new Date(item.startDate) > new Date() && (
            <h6 className="inline-flex items-center rounded-md bg-yellow-50 px-2 py-1 text-xs font-medium text-yellow-700 ring-1 ring-inset ring-yellow-700/10">
              Starts on {formatDate(item.startDate)}
            </h6>
          )}
          {new Date(item.startDate) < new Date() && (
            <h6 className="inline-flex items-center rounded-md bg-green-50 px-2 py-1 text-xs font-medium text-green-700 ring-1 ring-inset ring-green-700/10">
              Started on {formatDate(item.startDate)}
            </h6>
          )}
        </div>
        {/* delete coupon */}
        <div className="self-end">
          {loading ? (
            <div
              className="flex items-center justify-between opacity-50 pointer-events-none"
              aria-disabled
              disabled
            >
              <AiOutlineDelete size={25} className="cursor-pointer" />
            </div>
          ) : (
            <div
              className={`flex items-center justify-between ${
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
      </div>
    </>
  );
};

export default CouponCard;
