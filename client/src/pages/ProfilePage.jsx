import React, { useState } from "react";
import Header from "../components/Layouts/Header";
import styles from "../styles/styles";
import ProfileSideBar from "../components/Profile/ProfileSidebar";
import ProfileContent from "../components/Profile/ProfileContent";

const ProfilePage = () => {
  const [active, setActive] = useState(1);

  return (
    <>
      <Header />
      <div className={`${styles.section} flex py-20 md:py-10 min-h-screen`}>
        <div className="w-[50px] 800px:w-[335px] sticky h-full min-h-full bg-white shadow-lg rounded-md overflow-hidden">
          <ProfileSideBar active={active} setActive={setActive} />
        </div>
        <div className="w-full 800px:w-[calc(100%-335px)] ">
          <div className="bg-white min-h-screen ml-4 rounded-md shadow-md flex ">
            <ProfileContent active={active} setActive={setActive} />
          </div>
        </div>
      </div>
    </>
  );
};

export default ProfilePage;
