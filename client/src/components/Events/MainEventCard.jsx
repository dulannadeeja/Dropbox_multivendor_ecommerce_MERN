import React from "react";
import styles from "../../styles/styles";
import CountDown from "./CountDown";
import { Link } from "react-router-dom";
import { server } from "../../server";

const MainEventCard = ({ data }) => {
  console.log(data);

  return (
    <div
      className={`w-full block bg-white rounded-lg lg:flex p-5 gap-5 border-2 border-slate-100 my-2 shadow-lg`}
    >
      <div className="w-full aspect-video lg:max-w-md">
        <img
          src={`${server}/${data?.banner}`}
          alt=""
          className="w-full h-full object-cover"
        />
      </div>
      <div className="w-full lg:[w-50%] flex flex-col justify-center">
        <h2 className={`${styles.productTitle}`}>{data?.title}</h2>
        <p>{data?.description}</p>
        <div className="flex py-2 justify-between">
          <div className="flex">
            <h5 className="font-[500] text-[18px] text-[#d55b45] pr-3 line-through">
              {data?.product?.originalPrice}$
            </h5>
            <h5 className="font-bold text-[20px] text-[#333] font-Roboto">
              {data?.product?.discountPrice - data?.discountAmount}$
            </h5>
          </div>
          <span className="pr-3 font-[400] text-[17px] text-[#44a55e]">
            {data?.product?.sold_out} sold
          </span>
        </div>
        {data && <CountDown data={data} />}
        <br />
        <div className="flex items-center">
          <button
            onClick={() => {
              const productId = data?.product._id;
              window.location.href = `/products/${productId}`;
            }}
            className={`${styles.button} text-[#fff]`}
          >
            See Details
          </button>
          <div className={`${styles.button} text-[#fff] ml-5`}>Add to cart</div>
        </div>
      </div>
    </div>
  );
};

export default MainEventCard;
