import React, { useEffect } from "react";
import { server } from "../../../server";
import axios from "axios";
import { formatDistanceToNow } from "date-fns";
import Loader from "../../Loader";
import Ratings from "../../Product/Ratings";

const ShopReviews = ({ shopId }) => {
  const [allReviews, setAllReviews] = React.useState([]);
  const [loading, setLoading] = React.useState(true);

  useEffect(() => {
    const fetchReviews = async () => {
      setLoading(true);
      console.log("Fetching reviews");
      try {
        const res = await axios.get(`${server}/shop/reviews/${shopId}`);
        setAllReviews(res.data.reviews);
      } catch (err) {
        console.error(err);
        setAllReviews([]);
      } finally {
        setLoading(false);
      }
    };

    fetchReviews();
  }, [shopId]);

  const formatCreatedAt = (createdAt) => {
    return formatDistanceToNow(new Date(createdAt), { addSuffix: true });
  };

  return (
    <div className="w-full">
      {loading && <Loader />}
      {allReviews &&
        allReviews.map((review, index) => (
          <div className="w-full flex my-4" key={index}>
            <img
              src={
                review.user.avatar
                  ? `${server}/${review?.user?.avatar}`
                  : "../../../assets/placeholders/7309681.jpg"
              }
              className="w-[50px] h-[50px] rounded-full"
              alt=""
            />
            <div className="pl-2">
              <div className="flex w-full items-center">
                <h1 className="font-[600] pr-2">
                  {review.user.firstName + " " + review.user.lastName}
                </h1>
                <Ratings rating={review.rating} />
              </div>
              <p className="font-[400] text-[#000000a7]">{review?.comment}</p>
              <p className="text-[#000000a7] text-[14px]">
                {formatCreatedAt(review.createdAt)}
              </p>
            </div>
          </div>
        ))}
      {allReviews && allReviews.length === 0 && (
        <h5 className="w-full text-center py-5 text-[18px]">
          No Reviews have for this shop!
        </h5>
      )}
    </div>
  );
};

export default ShopReviews;
