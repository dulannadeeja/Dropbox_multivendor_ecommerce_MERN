import React, { useEffect, useState } from "react";
import Header from "../components/Layouts/Header";
import styles from "../styles/styles";
import ProfileSideBar from "../components/Profile/ProfileSidebar";
import ProfileContent from "../components/Profile/ProfileContent";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router";
import { useLocation } from "react-router-dom";

const ProfilePage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, isAuthenticated } = useSelector((state) => state.user);

  const [active, setActive] = useState(1);

  React.useEffect(() => {
    // if (!isAuthenticated) {
    //   const nextState = { from: location };
    //   navigate("/login", { state: nextState });
    // }
  }, [user]);

  return (
    <>
      <Header />
      <div className={`${styles.section} flex bg-[#f5f5f5] py-10`}>
        <div className="w-[50px] 800px:w-[335px] sticky 800px:mt-0 mt-[18%]">
          <ProfileSideBar active={active} setActive={setActive} />
        </div>
        <div className="w-full 800px:w-[calc(100%-335px)]">
          <ProfileContent active={active} setActive={setActive} />
        </div>
      </div>
    </>
  );
};

export default ProfilePage;
