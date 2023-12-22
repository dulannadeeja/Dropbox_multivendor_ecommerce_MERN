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
        setIsLoading(false);
      })
      .catch((error) => {
        console.log(error);
        setIsLoading(false);
        // redirect to 404 page
        navigate("/404");
      });
  }, []);

  return (
    <>
      {isLoading ? (
        <Loader />
      ) : (
        <div>
          <div className="w-full py-5">
            <div className="w-full flex item-center justify-center">
              <img
                src={`${data.shopAvatar}`}
                alt=""
                className="w-[150px] h-[150px] object-cover rounded-full"
              />
            </div>
            <h3 className="text-center py-2 text-[20px]">{data.name}</h3>
            <p className="text-[16px] text-[#000000a6] p-[10px] flex items-center">
              {data.description}
            </p>
          </div>
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
      )}
    </>
  );
};

export default ShopInfo;
