import React, { useEffect } from "react";
import { AiOutlineDelete } from "react-icons/ai";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { server } from "../../../server";
import axios from "axios";
import { useState } from "react";

const AddressCard = ({
  address,
  deleteAddress,
  setDefaultAddressId,
  defaultAddressId,
}) => {
  const [loading, setLoading] = useState(false);
  const { user, token } = useSelector((state) => state.user);
  const [isDefault, setIsDefault] = useState(address.isDefault);

  useEffect(() => {
    if (address._id.toString() === defaultAddressId.toString()) {
      setIsDefault(true);
    } else {
      setIsDefault(false);
    }
  }, [defaultAddressId]);

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

  const handleMakeDefault = async () => {
    setLoading(true);
    try {
      const config = {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      };

      const res = await axios.put(
        `${server}/user/edit-default-shipping-address`,
        {
          addressId: address._id,
        },
        config
      );
      toast.success(res.data.message);
      setDefaultAddressId(address._id);
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
        className="w-full bg-white rounded-md shadow-md flex flex-col gap-2 py-5 px-4"
        key={address._id}
      >
        <div className="w-full flex justify-between mb-3 items-center">
          <div>
            {/* default badge */}
            {isDefault ? (
              <div className="w-full flex justify-end">
                <span className="inline-flex items-center rounded-md bg-green-50 px-2 py-1 text-sm font-medium text-green-700 ring-1 ring-inset ring-green-600/20">
                  Default
                </span>
              </div>
            ) : (
              <div
                className="w-full flex justify-end cursor-pointer"
                onClick={handleMakeDefault}
              >
                <span className="inline-flex items-center rounded-md bg-gray-50 px-2 py-1 text-sm font-medium text-gray-700 ring-1 ring-inset ring-gray-600/20">
                  Make Default
                </span>
              </div>
            )}
          </div>
          <div className=" text-red-500">
            {loading || isDefault ? (
              <div
                className="min-w-[10%] flex items-center justify-between opacity-50 pointer-events-none"
                aria-disabled
                disabled
              >
                <AiOutlineDelete size={25} className="cursor-pointer" />
              </div>
            ) : (
              <div className="min-w-[10%] flex items-center justify-between">
                <AiOutlineDelete
                  size={25}
                  className="cursor-pointer"
                  onClick={() => handleDeleteAddress(address._id)}
                />
              </div>
            )}
          </div>
        </div>
        <div>
          {/* address nickname */}
          <p>
            <span className="font-semibold">{address.addressNickname}</span>
          </p>

          {/* address */}
          <div className="flex flex-col gap-2">
            <div className="py-5 flex flex-col gap-2">
              {/* phone number */}
              <div className="grid grid-cols-12 gap-2">
                <h6 className="text-sm font-semibold text-slate-500 col-span-4">
                  Phone:
                </h6>
                <p className="text-sm text-gray-500 col-span-8">
                  {address.phone}
                </p>
              </div>

              {/* contact person */}
              <div className="grid grid-cols-12 gap-2">
                <h6 className="text-sm font-semibold text-slate-500 col-span-4">
                  Contact Person:
                </h6>
                <p className="text-sm text-gray-500 col-span-8">
                  {address.contactName}
                </p>
              </div>
            </div>
            {/* houseNumber */}
            <div className="grid grid-cols-12 gap-2">
              <h6 className="text-sm font-semibold text-slate-500 col-span-4">
                Apt:
              </h6>
              <p className="text-sm text-gray-500 col-span-8">
                {address.houseNumber}
              </p>
            </div>

            {/* street */}
            <div className="grid grid-cols-12 gap-2">
              <h6 className="text-sm font-semibold text-slate-500 col-span-4">
                Street:
              </h6>
              <p className="text-sm text-gray-500 col-span-8">
                {address.street}
              </p>
            </div>

            {/* city */}
            <div className="grid grid-cols-12 gap-2">
              <h6 className="text-sm font-semibold text-slate-500 col-span-4">
                City:
              </h6>
              <p className="text-sm text-gray-500 col-span-8">{address.city}</p>
            </div>

            {/* state */}
            <div className="grid grid-cols-12 gap-2">
              <h6 className="text-sm font-semibold text-slate-500 col-span-4">
                State:
              </h6>
              <p className="text-sm text-gray-500 col-span-8">
                {address.state}
              </p>
            </div>

            {/* zipCode */}
            <div className="grid grid-cols-12 gap-2">
              <h6 className="text-sm font-semibold text-slate-500 col-span-4">
                Zip Code:
              </h6>
              <p className="text-sm text-gray-500 col-span-8">{address.zip}</p>
            </div>

            {/* country */}
            <div className="grid grid-cols-12 gap-2">
              <h6 className="text-sm font-semibold text-slate-500 col-span-4">
                Country:
              </h6>
              <p className="text-sm text-gray-500 col-span-8">
                {address.country}
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default AddressCard;
