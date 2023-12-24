import React from "react";
import { AiOutlineDelete } from "react-icons/ai";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { server } from "../../../server";
import axios from "axios";
import { useState } from "react";

const AddressCard = ({ address, deleteAddress }) => {
  const [loading, setLoading] = useState(false);
  const { user, token } = useSelector((state) => state.user);

  const handleDeleteAddress = async () => {
    setLoading(true);
    try {
      const config = {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      };

      const res = await axios.delete(`${server}/user/delete-address`, {
        ...config,
        data: { addressId: address._id },
      });
      toast.success(res.data.message);
      deleteAddress(address._id);
    } catch (error) {
      toast.error(
        error.response?.data?.message || error.message || "Something went wrong"
      );
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div
        className="w-full bg-white h-min 800px:h-[70px] rounded-[4px] flex items-center px-3 shadow justify-between pr-10 mb-5"
        key={address._id}
      >
        <div className="flex items-center">
          <h5 className="pl-5 font-[600]">{address.addressNickname}</h5>
        </div>
        <div className="pl-8 flex items-center">
          <h6 className="text-[12px] 800px:text-[unset]">
            {address.houseNumber} {address.street} {address.city}{" "}
            {address.state} {address.zip}
          </h6>
        </div>
        <div className="pl-8 flex items-center">
          <h6 className="text-[12px] 800px:text-[unset]">
            {address && address.phone}
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
          <div className="min-w-[10%] flex items-center justify-between pl-8">
            <AiOutlineDelete
              size={25}
              className="cursor-pointer"
              onClick={() => handleDeleteAddress(address._id)}
            />
          </div>
        )}
      </div>
    </>
  );
};

export default AddressCard;
