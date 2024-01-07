import React, { useEffect, useState } from "react";
import styles from "../../../styles/styles";
import { toast } from "react-toastify";
import AddressForm from "./AddressForm";
import AddressCard from "./AddressCard";
import Loader from "../../Loader";
import { useSelector } from "react-redux";
import axios from "axios";
import { server } from "../../../server";

const Address = () => {
  const { user } = useSelector((state) => state.user);
  const [open, setOpen] = useState(false);
  const [addresses, setAddresses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [defaultAddressId, setDefaultAddressId] = useState(null);

  const deleteAddress = (addressId) => {
    setAddresses(addresses.filter((address) => address._id !== addressId));
  };

  const addressAdded = (address) => {
    setAddresses([...addresses, address]);
  };

  // when component destroys, load user again
  useEffect(() => {
    fetchAddresses();

    // set default address id
    if (user.defaultShippingAddress) {
      setDefaultAddressId(user.defaultShippingAddress._id);
    }
  }, []);

  const fetchAddresses = async () => {
    setLoading(true);
    try {
      const config = {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user.token}`,
        },
      };

      const res = await axios.get(`${server}/user/addresses`, config);
      if (res.status === 200) {
        setAddresses(res.data.addresses);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full">
      {/* loader */}
      {loading && <Loader />}
      {/* header and model popup button */}
      <div className="w-full flex flex-col justify-between items-center mb-5">
        <div className="mb-10 flex flex-col items-center justify-center">
          <h4 className="text-lg font-[600]">Manage your delivery addresses</h4>
          <p className="text-[#707070] text-[14px]">
            Add or remove delivery addresses here for your orders. You can add
            maximum of 5 addresses.
          </p>
        </div>
        <div className="flex gap-3 justify-between w-full items-center ">
          <p className="text-[#707070] text-[14px]">
            {addresses.length} of 5 used
          </p>
          <button
            className={
              addresses.length <= 5
                ? `${styles.button}`
                : `${styles.button} ${styles.buttonDisabled} pointer-events-none cursor-pointer`
            }
            onClick={() => setOpen(true)}
          >
            Add New
          </button>
        </div>
      </div>
      {/* add new address model */}
      {open && (
        <div className="fixed top-0 left-0 w-full h-full bg-[#000000ba] z-50 flex justify-center items-center">
          <div className="w-[90%] sm:w-[50%] bg-white rounded-lg shadow-lg p-5">
            <AddressForm
              setOpen={setOpen}
              addresses={addresses}
              addressAdded={addressAdded}
            />
          </div>
        </div>
      )}
      {/* all addresses */}
      <div className="w-full mt-10">
        <h4 className="text-lg font-[600] mb-5 pb-5 border-b-2 border-slate-100">
          Your Addresses
        </h4>
        <div className="lg:grid lg:grid-cols-2 xl:grid-cols-3 gap-3">
          {addresses &&
            addresses.map((address) => (
              <AddressCard
                address={address}
                deleteAddress={deleteAddress}
                defaultAddressId={defaultAddressId}
                setDefaultAddressId={setDefaultAddressId}
              />
            ))}
          {!user.addresses && (
            <div className="w-full flex justify-center items-center">
              <h5 className="text-[#707070]">No Addresses</h5>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Address;
