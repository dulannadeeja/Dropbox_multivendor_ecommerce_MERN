import React, { useEffect, useState } from "react";
import styles from "../../../styles/styles";
import { AiOutlineDelete } from "react-icons/ai";
import { RxCross1 } from "react-icons/rx";
import { Country, State } from "country-state-city";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import AddressForm from "./AddressForm";
import AddressCard from "./AddressCard";
import { server } from "../../../server";
import Loader from "../../Loader";
import axios from "axios";

const Address = () => {
  const { user } = useSelector((state) => state.user);
  const [open, setOpen] = useState(false);
  const [address, setAddress] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchAddress();
  }, []);

  const fetchAddress = async () => {
    setLoading(true);
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };
      const res = await axios.get(`${server}/user/get-addresses`, config);
      console.log(res.data.addresses);
      setAddress(res.data.addresses);
    } catch (error) {
      toast.error(
        error.response?.data?.message || error.message || "Something went wrong"
      );
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const deleteAddress = (addressId) => {
    setAddress(address.filter((address) => address._id !== addressId));
  };

  return (
    <div className="w-full">
      {/* loader */}
      {loading && <Loader />}
      {/* header and model popup button */}
      <div className="w-full flex justify-between items-center mb-5">
        <h4 className="text-[#707070] font-[600]">Addresses</h4>
        <button className={`${styles.button}`} onClick={() => setOpen(true)}>
          Add New Address
        </button>
      </div>
      {/* add new address model */}
      {open && (
        <div className="fixed top-0 left-0 w-full h-full bg-[#000000ba] z-50 flex justify-center items-center">
          <div className="w-[90%] sm:w-[50%] bg-white rounded-lg shadow-lg p-5">
            <AddressForm setOpen={setOpen} />
          </div>
        </div>
      )}
      {/* all addresses */}
      <div className="w-full">
        {user.addresses &&
          user.addresses.length > 0 &&
          address.map((address) => (
            <AddressCard address={address} deleteAddress={deleteAddress} />
          ))}
        {!user.addresses && (
          <div className="w-full flex justify-center items-center">
            <h5 className="text-[#707070]">No Addresses</h5>
          </div>
        )}
      </div>
    </div>
  );
};

export default Address;
