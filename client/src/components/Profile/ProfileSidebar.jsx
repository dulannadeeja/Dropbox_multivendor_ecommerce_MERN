import React from "react";
import { AiOutlineLogin, AiOutlineMessage } from "react-icons/ai";
import { RiLockPasswordLine } from "react-icons/ri";
import { HiOutlineReceiptRefund, HiOutlineShoppingBag } from "react-icons/hi";
import {
  MdOutlineAdminPanelSettings,
  MdOutlinePassword,
  MdOutlinePayment,
  MdOutlineTrackChanges,
} from "react-icons/md";
import { TbAddressBook } from "react-icons/tb";
import { RxPerson } from "react-icons/rx";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { server } from "../../server";
import { toast } from "react-toastify";
import { useSelector } from "react-redux";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import Loader from "../Loader";

const ProfileSidebar = ({ setActive, active }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user, isAuthenticated } = useSelector((state) => state);

  const [loading, setLoading] = React.useState(false);

  const logoutHandler = async () => {
    setLoading(true);

    try {
      const res = await axios.get(`${server}/auth/logout`, {
        withCredentials: true,
      });

      if (res.status !== 200) {
        const error = new Error(res.error);
        throw error;
      }
      await dispatch({ type: "LOGOUT" });
      navigate("/");
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || "Something went wrong");
    }

    setLoading(false);
  };
  return (
    <>
      {/* loading */}
      {loading && (
        <div className="fixed top-0 left-0 w-full h-full flex justify-center items-center">
          <Loader />
        </div>
      )}
      {/* Profile Sidebar */}
      <div className="w-full bg-white shadow-sm rounded-[10px] p-4 pt-8">
        {/* Profile Tab */}
        <div
          className="flex items-center cursor-pointer w-full mb-8"
          onClick={() => setActive(1)}
        >
          <RxPerson size={20} color={active === 1 ? "red" : ""} />
          <span
            className={`pl-3 ${
              active === 1 ? "text-[red]" : ""
            } 800px:block hidden`}
          >
            Profile
          </span>
        </div>
        {/* Orders Tab */}
        <div
          className="flex items-center cursor-pointer w-full mb-8"
          onClick={() => setActive(2)}
        >
          <HiOutlineShoppingBag size={20} color={active === 2 ? "red" : ""} />
          <span
            className={`pl-3 ${
              active === 2 ? "text-[red]" : ""
            } 800px:block hidden`}
          >
            Orders
          </span>
        </div>
        {/* Refunds Tab */}
        <div
          className="flex items-center cursor-pointer w-full mb-8"
          onClick={() => setActive(3)}
        >
          <HiOutlineReceiptRefund size={20} color={active === 3 ? "red" : ""} />
          <span
            className={`pl-3 ${
              active === 3 ? "text-[red]" : ""
            } 800px:block hidden`}
          >
            Refunds
          </span>
        </div>
        {/* Inbox Tab */}
        <div
          className="flex items-center cursor-pointer w-full mb-8"
          onClick={() => setActive(4) || navigate("/inbox")}
        >
          <AiOutlineMessage size={20} color={active === 4 ? "red" : ""} />
          <span
            className={`pl-3 ${
              active === 4 ? "text-[red]" : ""
            } 800px:block hidden`}
          >
            Inbox
          </span>
        </div>
        {/* Track Order Tab */}
        <div
          className="flex items-center cursor-pointer w-full mb-8"
          onClick={() => setActive(5)}
        >
          <MdOutlineTrackChanges size={20} color={active === 5 ? "red" : ""} />
          <span
            className={`pl-3 ${
              active === 5 ? "text-[red]" : ""
            } 800px:block hidden`}
          >
            Track Order
          </span>
        </div>
        {/* Payment Methods Tab */}
        <div
          className="flex items-center cursor-pointer w-full mb-8"
          onClick={() => setActive(6)}
        >
          <MdOutlinePayment size={20} color={active === 6 ? "red" : ""} />
          <span
            className={`pl-3 ${
              active === 6 ? "text-[red]" : ""
            } 800px:block hidden`}
          >
            Payment Methods
          </span>
        </div>
        {/* Change Password Tab */}
        <div
          className="flex items-center cursor-pointer w-full mb-8"
          onClick={() => setActive(7)}
        >
          <RiLockPasswordLine size={20} color={active === 7 ? "red" : ""} />
          <span
            className={`pl-3 ${
              active === 7 ? "text-[red]" : ""
            } 800px:block hidden`}
          >
            Change Password
          </span>
        </div>
        {/* Address Tab*/}
        <div
          className="flex items-center cursor-pointer w-full mb-8"
          onClick={() => setActive(8)}
        >
          <TbAddressBook size={20} color={active === 8 ? "red" : ""} />
          <span
            className={`pl-3 ${
              active === 8 ? "text-[red]" : ""
            } 800px:block hidden`}
          >
            Address
          </span>
        </div>
        {/* Log Out Tab */}
        {user && user?.role === "Admin" && (
          <Link to="/admin/dashboard">
            <div
              className="flex items-center cursor-pointer w-full mb-8"
              onClick={() => setActive(9)}
            >
              <MdOutlineAdminPanelSettings
                size={20}
                color={active === 9 ? "red" : ""}
              />
              <span
                className={`pl-3 ${
                  active === 9 ? "text-[red]" : ""
                } 800px:block hidden`}
              >
                Admin Dashboard
              </span>
            </div>
          </Link>
        )}
        <div
          className="single_item flex items-center cursor-pointer w-full mb-8"
          onClick={logoutHandler}
        >
          <AiOutlineLogin size={20} color={active === 10 ? "red" : ""} />
          <span
            className={`pl-3 ${
              active === 10 ? "text-[red]" : ""
            } 800px:block hidden`}
          >
            Log out
          </span>
        </div>
      </div>
    </>
  );
};

export default ProfileSidebar;
