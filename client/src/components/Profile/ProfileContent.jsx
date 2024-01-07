import React, { useEffect } from "react";
import { AiOutlineCamera } from "react-icons/ai";
import { useSelector } from "react-redux";
import { server } from "../../server";
import styles from "../../styles/styles";
import { toast } from "react-toastify";
import axios from "axios";
import OrdersTable from "./AllOrders/OrdersTable";
import RefundOrdersTable from "./RefundOrdersTable";
import TrackOrdersTable from "./TrackOrdersTable";
import PaymentMethods from "./PaymentMethods";
import Addresses from "./Addresses/Addresses";
import ChangePassword from "./ChangePassword";
import { RxCross2 } from "react-icons/rx";
import PhoneInputComponent from "../SellerSignup/PhoneInput";

const ProfileContent = ({ active }) => {
  const { user } = useSelector((state) => state.user);

  const [userData, setUserData] = React.useState({});

  const [isNameEdit, setIsNameEdit] = React.useState(false);
  const [firstName, setFirstName] = React.useState("");
  const [lastName, setLastName] = React.useState("");
  const [firstNameError, setFirstNameError] = React.useState("");
  const [lastNameError, setLastNameError] = React.useState("");
  const [isNameSubmitAllowed, setIsNameSubmitAllowed] = React.useState(false);

  const [isEmailEdit, setIsEmailEdit] = React.useState(false);
  const [email, setEmail] = React.useState("");
  const [emailError, setEmailError] = React.useState("");
  const [isEmailSubmitAllowed, setIsEmailSubmitAllowed] = React.useState(false);

  const [isPhoneEdit, setIsPhoneEdit] = React.useState(false);
  const [phone, setPhone] = React.useState("");
  const [phoneError, setPhoneError] = React.useState("");
  const [isPhoneSubmitAllowed, setIsPhoneSubmitAllowed] = React.useState(false);

  useEffect(() => {
    if (user) {
      setFirstName(user.firstName);
      setLastName(user.lastName);
      setEmail(user.email);
      setPhone(user.phone);
      setUserData(user);
    }
  }, [user]);

  useEffect(() => {
    if (firstName.length >= 3 && lastName.length >= 3) {
      setIsNameSubmitAllowed(true);
    } else {
      setIsNameSubmitAllowed(false);
    }
  }, [firstName, lastName]);

  useEffect(() => {
    if (phone && phone.length >= 10 && !phoneError) {
      setIsPhoneSubmitAllowed(true);
    } else {
      setIsPhoneSubmitAllowed(false);
    }
  }, [phone, phoneError]);

  const handleImage = async (e) => {
    const avatar = e.target.files[0];
    const formData = new FormData();
    formData.append("avatar", avatar);
    try {
      const config = {
        headers: {
          "Content-Type": "multipart/form-data",
          authorization: `Bearer ${user.token}`,
        },
      };
      const res = await axios.put(
        `${server}/user/edit-avatar`,
        formData,
        config
      );
      if (res.status === 201) {
        toast.success("Avatar updated successfully!");
        setUserData(res.data.user);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Something went wrong!");
    }
  };

  const handleNameSubmit = async (e) => {
    console.log(firstName, lastName);

    try {
      const config = {
        headers: {
          "Content-Type": "application/json",
          authorization: `Bearer ${user.token}`,
        },
      };
      const res = await axios.put(
        `${server}/user/edit-name`,
        { firstName, lastName },
        config
      );
      if (res.status === 201) {
        toast.success("Name updated successfully!");
        setIsNameEdit(false);
        setUserData(res.data.user);
        setUserData(res.data.user);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Something went wrong!");
    }
  };

  const handleEmailSubmit = async (e) => {
    try {
      const config = {
        headers: {
          "Content-Type": "application/json",
          authorization: `Bearer ${user.token}`,
        },
      };
      const res = await axios.put(
        `${server}/user/edit-email`,
        { email },
        config
      );
      if (res.status === 201) {
        toast.success("Email updated successfully!");
        setIsEmailEdit(false);
        setUserData(res.data.user);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Something went wrong!");
    }
  };

  const handlePhoneSubmit = async (e) => {
    try {
      const config = {
        headers: {
          "Content-Type": "application/json",
          authorization: `Bearer ${user.token}`,
        },
      };
      const res = await axios.put(
        `${server}/user/edit-phone`,
        { phone },
        config
      );
      if (res.status === 201) {
        toast.success("Phone updated successfully!");
        setIsPhoneEdit(false);
        setUserData(res.data.user);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Something went wrong!");
    }
  };

  const onChangeInput = (e) => {
    const { name, value } = e.target;

    if (name === "firstname") {
      setFirstName(value);
      if (value.length < 3) {
        setFirstNameError("First name must be atleast 3 characters long");
      } else {
        setFirstNameError("");
      }
    }
    if (name === "lastname") {
      setLastName(value);
      if (value.length < 3) {
        setLastNameError("Last name must be atleast 3 characters long");
      } else {
        setLastNameError("");
      }
    }
  };

  const onChangeEmail = (e) => {
    const { value } = e.target;

    setEmail(value);
    // validate email address
    const re = /\S+@\S+\.\S+/;
    if (!re.test(value)) {
      setIsEmailSubmitAllowed(false);
      setEmailError("Please enter a valid email address");
    } else {
      setEmailError("");
      setIsEmailSubmitAllowed(true);
    }
  };

  return (
    <div className="w-[95%] mx-auto py-10 max-w-6xl ">
      {/* profile */}
      {active === 1 && (
        <>
          <div className="flex justify-center w-full">
            <div className="w-full px-5">
              <div className="w-full block pb-3">
                {/* profile card */}

                <div className="flex gap-10 flex-col">
                  {/* avatar */}
                  <div className="flex flex-col items-center justify-center w-full">
                    <div className="rounded-full border-2 w-40 h-40 overflow-hidden flex-shrink-0">
                      <img
                        src={
                          userData.avatar
                            ? `${server}/${userData.avatar}`
                            : `../../assets/placeholders/7309681.jpg`
                        }
                        alt="avatar"
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="w-full flex justify-center items-center mt-5">
                      <label
                        htmlFor="avatar"
                        className="w-[40px] h-[40px] rounded-full bg-[#3a24db] flex justify-center items-center cursor-pointer"
                      >
                        <AiOutlineCamera className="w-[20px] h-[20px] text-white" />
                      </label>
                      <input
                        type="file"
                        id="avatar"
                        className="hidden"
                        onChange={(e) => handleImage(e)}
                      />
                    </div>
                  </div>
                  {/* name */}
                  <div className="text-lg font-semibold self-center">
                    <p className="text capitalize">{`${userData.firstName} ${userData.lastName}`}</p>
                    {!isNameEdit ? (
                      <button
                        className="text-sm text-blue-500"
                        onClick={() => setIsNameEdit(true)}
                      >
                        Edit Name
                      </button>
                    ) : (
                      <div className="flex flex-col gap-3 border-2 p-5 shadow-sm">
                        <RxCross2
                          className="w-5 h-5 ml-auto cursor-pointer"
                          onClick={() => setIsNameEdit(false)}
                        />
                        <div>
                          <label
                            className={styles.formLabel}
                            htmlFor="firstname"
                          >
                            First Name
                          </label>
                          <input
                            value={firstName}
                            onChange={(e) => onChangeInput(e)}
                            className={styles.input}
                            type="text"
                            name="firstname"
                          />
                          {firstNameError && (
                            <p className="text-red-500 text-sm">
                              {firstNameError}
                            </p>
                          )}
                        </div>
                        <div>
                          <label
                            className={styles.formLabel}
                            htmlFor="lastname"
                          >
                            Last Name
                          </label>
                          <input
                            value={lastName}
                            onChange={(e) => onChangeInput(e)}
                            className={styles.input}
                            type="text"
                            name="lastname"
                          />
                          {lastNameError && (
                            <p className="text-red-500 text-sm">
                              {lastNameError}
                            </p>
                          )}
                        </div>
                        <button
                          onClick={(e) => handleNameSubmit(e)}
                          className={
                            isNameSubmitAllowed
                              ? styles.button
                              : `${styles.button} ${styles.buttonDisabled}`
                          }
                        >
                          Save Changes
                        </button>
                      </div>
                    )}
                  </div>

                  <div className="flex flex-col gap-3">
                    <h1 className="text-md font-semibold text-slate-500 border-b-2 border-slate-200 w-full pb-3 mb-5">
                      {" "}
                      Contact Info
                    </h1>

                    {/* email */}
                    <div className="grid grid-cols-12">
                      <h4 className="text-sm font-semibold text-slate-500 col-span-3">
                        Email
                      </h4>
                      <div className="col-span-9">
                        <p className="text-sm text-gray-500 ">
                          {userData.email}
                        </p>
                        {/* edit email */}
                        {!isEmailEdit && (
                          <button
                            className="text-sm text-blue-500"
                            onClick={() => setIsEmailEdit(true)}
                          >
                            Edit
                          </button>
                        )}
                      </div>
                      {/* edit email form */}
                      <div className="col-span-12 md:col-span-6">
                        {isEmailEdit && (
                          <div className="flex flex-col gap-3 border-2 p-5 shadow-sm w-full my-3 max-w-md mx-auto">
                            <RxCross2
                              className="w-5 h-5 ml-auto cursor-pointer"
                              onClick={() => setIsEmailEdit(false)}
                            />
                            <div>
                              <label
                                className={styles.formLabel}
                                htmlFor="email"
                              >
                                Email
                              </label>
                              <input
                                value={email}
                                onChange={(e) => onChangeEmail(e)}
                                className={styles.input}
                                type="email"
                                name="email"
                              />
                              {emailError && (
                                <p className="text-red-500 text-sm">
                                  {emailError}
                                </p>
                              )}
                            </div>
                            <button
                              onClick={(e) => handleEmailSubmit(e)}
                              className={
                                isEmailSubmitAllowed
                                  ? styles.button
                                  : `${styles.button} ${styles.buttonDisabled}`
                              }
                            >
                              Save Changes
                            </button>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* phone */}
                    <div className="grid grid-cols-12">
                      <h4 className="text-sm font-semibold text-slate-500 col-span-3">
                        Phone
                      </h4>
                      <div>
                        <p className="text-sm text-gray-500 col-span-9">
                          {userData.phone}
                        </p>
                        {/* edit number button */}
                        {!isPhoneEdit && (
                          <button
                            className="text-sm text-blue-500"
                            onClick={() => setIsPhoneEdit(true)}
                          >
                            Edit
                          </button>
                        )}
                      </div>
                      {/* edit phone form */}
                      <div className="col-span-12 md:col-span-6 flex">
                        {isPhoneEdit && (
                          <div className="flex flex-col gap-3 border-2 p-5 shadow-sm w-full my-3 max-w-md mx-auto items-center">
                            <RxCross2
                              className="w-5 h-5 ml-auto cursor-pointer"
                              onClick={() => setIsPhoneEdit(false)}
                            />
                            <div className="flex flex-col items-center">
                              <PhoneInputComponent
                                phoneNumber={phone}
                                setPhoneNumber={setPhone}
                                setPhoneError={setPhoneError}
                              />
                              {phoneError && (
                                <p className="text-red-500 text-sm">
                                  {phoneError}
                                </p>
                              )}
                            </div>
                            <button
                              onClick={(e) => handlePhoneSubmit(e)}
                              className={
                                isPhoneSubmitAllowed
                                  ? `${styles.button} w-fit`
                                  : `${styles.button} ${styles.buttonDisabled} w-fit`
                              }
                            >
                              Save Changes
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  <div>
                    <h1 className="text-md font-semibold text-slate-500  w-full ">
                      {" "}
                      Default Shipping Info
                    </h1>
                    <p className="text-sm text-gray-500 max-w-xl border-b-2 border-slate-200 py-3 mb-8 ">
                      This is the default shipping address that will be used to
                      ship your orders. You can always select or add a new
                      address during checkout.
                    </p>
                    {/* address */}
                    <div className="">
                      <p className="text-sm text-gray-500">
                        {userData?.defaultShippingAddress?.houseNumber}
                      </p>
                      <p className="text-sm text-gray-500">
                        {userData?.defaultShippingAddress?.street}
                      </p>
                      <p className="text-sm text-gray-500">
                        {userData?.defaultShippingAddress?.city}
                      </p>
                      <p className="text-sm text-gray-500">
                        {userData?.defaultShippingAddress?.state}
                      </p>
                      <p className="text-sm text-gray-500">
                        {userData?.defaultShippingAddress?.country}
                      </p>
                      <p className="text-sm text-gray-500">
                        {userData?.defaultShippingAddress?.zipCode}
                      </p>
                    </div>
                  </div>

                  {/* joined on */}
                  <div className="flex gap-3 ml-auto">
                    <h1 className="text-sm text-gray-500 col-span-9">
                      {" "}
                      Joined On:
                    </h1>
                    <p className="text-sm text-gray-500 col-span-9">
                      {new Date(userData.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </>
      )}

      {/* orders */}
      {active === 2 && <OrdersTable />}

      {/* refunds */}
      {active === 3 && <RefundOrdersTable />}

      {/* track order */}
      {active === 5 && <TrackOrdersTable />}

      {/* Payment methods */}
      {active === 6 && <PaymentMethods />}

      {/* Change Password */}
      {active === 7 && <ChangePassword />}

      {/* Addresses */}
      {active === 8 && <Addresses />}
    </div>
  );
};
export default ProfileContent;
