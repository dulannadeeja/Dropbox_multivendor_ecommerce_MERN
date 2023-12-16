import React from "react";
import { Link } from "react-router-dom";
import { navItems } from "../../static/navigationData";
import styles from "../../styles/styles";

const Navbar = ({ active, mobile }) => {
  return (
    <div className={mobile ? "flex flex-col gap-8 my-10" : "flex gap-8"}>
      {navItems &&
        navItems.map((i, index) => (
          <div className="flex" key={index}>
            <Link
              to={i.url}
              className={`${
                active === index + 1
                  ? "text-[#17dd1f]"
                  : "text-black 800px:text-[#fff]"
              } 800px:pb-0 font-[500] cursor-pointer}`}
            >
              {i.title}
            </Link>
          </div>
        ))}
    </div>
  );
};

export default Navbar;
