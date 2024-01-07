import React, { useEffect, useState } from "react";
import styles from "../../styles/styles";
import validatePassword from "../../validations/passwordValidation";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import axios from "axios";
import { server } from "../../server";
import { useDispatch } from "react-redux";
import { logoutUser } from "../../redux/actions/logoutUser";

const ChangePassword = () => {
  const dispatch = useDispatch();

  const { user } = useSelector((state) => state.user);

  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [currentPasswordError, setCurrentPasswordError] = useState(null);
  const [newPasswordError, setNewPasswordError] = useState(null);
  const [confirmPasswordError, setConfirmPasswordError] = useState(null);

  const [isChangePasswordAllowed, setIsChangePasswordAllowed] = useState(false);

  const handleOnChange = async (e) => {
    const { name, value } = e.target;

    if (name === "oldPassword") {
      setOldPassword(value);
      // check if user entered current password
      setCurrentPasswordError(
        value ? null : "Please enter your current password"
      );
    }
    if (name === "newPassword") {
      setNewPassword(value);

      // check if password is valid
      const error = await validatePassword("password", value);
      setNewPasswordError(error);

      // check if user entered current password
      setCurrentPasswordError(
        oldPassword ? null : "Please enter your current password"
      );
    }
    if (name === "confirmPassword") {
      setConfirmPassword(value);

      // check if passwords match
      setConfirmPasswordError(
        value !== newPassword ? "Passwords do not match" : null
      );
    }
  };

  useEffect(() => {
    // check if all conditions are met to allow password change
    setIsChangePasswordAllowed(
      !newPasswordError &&
        !confirmPasswordError &&
        oldPassword &&
        newPassword &&
        confirmPassword
    );
  }, [
    newPassword,
    confirmPassword,
    oldPassword,
    newPasswordError,
    confirmPasswordError,
  ]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const config = {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user.token}`,
        },
      };

      const res = await axios.put(
        `${server}/user/edit-password`,
        {
          oldPassword,
          newPassword,
          confirmPassword,
        },
        config
      );

      if (res.status === 201) {
        toast.success("Password changed successfully!");
        dispatch(
          logoutUser({
            token: user.token,
          })
        );
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Something went wrong");
    }
  };

  return (
    <div className="w-full px-5 max-w-sm mx-auto">
      <h1 className="block text-[25px] text-center font-[600] text-[#000000ba] pb-2">
        Change Password
      </h1>
      <p className="text-center text-[#707070] pb-5 border-b-2 border-b-slate-100 mb-5">
        You can change your password here, please enter your current password
        and then enter your new password.
      </p>
      <div className="w-full">
        <form
          aria-required
          onSubmit={(e) => handleSubmit(e)}
          className="flex flex-col items-center gap-3"
        >
          {/* Current Password */}
          <div className="w-full">
            <label className="block pb-2">Current Password</label>
            <input
              type="password"
              className={`${styles.input} `}
              required
              value={oldPassword}
              onChange={(e) => handleOnChange(e)}
              name="oldPassword"
            />
            {/* Input error */}
            {currentPasswordError && (
              <p className="text-red-500 text-sm">{currentPasswordError}</p>
            )}
          </div>
          {/* New Password */}
          <div className="w-full">
            <label className="block pb-2">New password</label>
            <input
              type="password"
              className={`${styles.input} `}
              required
              value={newPassword}
              onChange={(e) => handleOnChange(e)}
              name="newPassword"
            />
            {/* Input error */}
            {newPasswordError && (
              <p className="text-red-500 text-sm">{newPasswordError}</p>
            )}
          </div>
          {/* Confirm Password */}
          <div className="w-full">
            <label className="block pb-2">Confirm password</label>
            <input
              type="password"
              className={`${styles.input} `}
              required
              value={confirmPassword}
              onChange={(e) => handleOnChange(e)}
              name="confirmPassword"
            />
            {/* Input error */}
            {confirmPasswordError && (
              <p className="text-red-500 text-sm">{confirmPasswordError}</p>
            )}
          </div>
          {/* Submit Button */}
          <button
            className={
              isChangePasswordAllowed
                ? `${styles.button} w-full mt-5`
                : `${styles.button} ${styles.buttonDisabled} w-full mt-5`
            }
            required
            value="Update"
            type="submit"
          >
            Update
          </button>
        </form>
      </div>
    </div>
  );
};

export default ChangePassword;
