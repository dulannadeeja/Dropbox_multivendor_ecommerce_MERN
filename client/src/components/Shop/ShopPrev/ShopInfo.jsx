import axios from "axios";
import React, { useEffect, useState } from "react";
import { server } from "../../../server";
import Loader from "../../Loader";
import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";

const ShopInfo = () => {
  const navigate = useNavigate();

  const [data, setData] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const { shopId } = useParams();

  useEffect(() => {
    setIsLoading(true);
    axios
      .get(`${server}/shop/get-shop-info/${shopId}`)
      .then((res) => {
        setData(res.data.shop);
        console.log(data);
      })
      .catch((error) => {
        // redirect to 404 page
        navigate("/404");
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, []);

  return (
    <>
      {isLoading ? (
        <Loader />
      ) : (
        <div className="bg-white">
          <div className="w-full">
            <div className="w-full relative mb-20">
              <img
                src={
                  data.shopAvatar
                    ? `${server}/${data.shopAvatar}`
                    : "../../../assets/placeholders/7309681.jpg"
                }
                alt=""
                className="w-40 rounded-full mx-auto absolute -bottom-20 left-0 right-0 border-4 border-white"
              />
              <img
                src={
                  data.shopBanner
                    ? `${server}/${data.shopBanner}`
                    : "../../../assets/placeholders/shop-banner-placeholder.jpg"
                }
                alt=""
                className="w-full aspect-video"
              />
            </div>
            <h3 className="text-center py-2 text-[20px]">{data.name}</h3>
            <p className="text-[16px] text-[#000000a6] p-[10px] flex items-cente">
              {/* shop description with limited */}
              {data.description?.length > 100
                ? `${data.description.slice(0, 300)}...`
                : data.description}
            </p>
          </div>

          {/* horizontal line that separate rows */}
          <hr className="border-[#00000029] w-full" />

          {/* shop info */}

          <div className="grid grid-cols-2 p-5 gap-2">
            {/* country */}
            <div className="p-3">
              <h5 className="font-[600]">Country</h5>
              <h4 className="text-[#000000a6]">{data.country}</h4>
            </div>
            {/* address */}
            <div className="p-3">
              <h5 className="font-[600]">Address</h5>
              <h4 className="text-[#000000a6]">{`${data.apartment} ${data.street} ${data.city} ${data.state}, ${data.zip}`}</h4>
            </div>
            {/* email */}
            <div className="p-3">
              <h5 className="font-[600]">Email</h5>
              <h4 className="text-[#000000a6]">{data.contactEmail}</h4>
            </div>
            {/* contact name */}
            <div className="p-3">
              <h5 className="font-[600]">Contact Name</h5>
              <h4 className="text-[#000000a6]">{data.contactName}</h4>
            </div>
            {/* contact number */}
            <div className="p-3">
              <h5 className="font-[600]">Business Number</h5>
              <h4 className="text-[#000000a6]">
                {new Intl.NumberFormat().format(data.contactPhone)}
              </h4>
            </div>
            <div className="p-3">
              <h5 className="font-[600]">Total Products</h5>
              <h4 className="text-[#000000a6]">{data.totalProducts}</h4>
            </div>
            <div className="p-3">
              <h5 className="font-[600]">Shop Ratings</h5>
              <h4 className="text-[#000000b0]">{data.ratings}</h4>
            </div>
            <div className="p-3">
              <h5 className="font-[600]">Joined On</h5>
              <h4 className="text-[#000000b0]">
                {data?.createdAt?.slice(0, 10)}
              </h4>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ShopInfo;
