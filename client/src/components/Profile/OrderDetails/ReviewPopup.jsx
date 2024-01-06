import React, { useEffect } from "react";
import styles from "../../../styles/styles";
import { AiOutlineStar } from "react-icons/ai";
import { RxCross1 } from "react-icons/rx";
import { AiFillStar } from "react-icons/ai";
import { useState } from "react";
import axios from "axios";
import { server } from "../../../server";
import { toast } from "react-toastify";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import { loadUserOrders } from "../../../redux/actions/loadUserOrders";

const ReviewPopup = ({ product, setReviewPopupOpen }) => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.user);
  const [rating, setRating] = useState(1);
  const [comment, setComment] = useState("");
  const [isReviewed, setIsReviewed] = useState(false);

  const handleSubmitReview = async () => {
    const config = {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${user?.token}`,
      },
    };

    const body = {
      productId: product?._id,
      rating,
      comment,
    };

    try {
      const res = await axios.post(`${server}/product/review`, body, config);

      if (res.status === 201) {
        toast.success(res.data.message);
        setReviewPopupOpen(false);

        // load orders of the store
        await dispatch(loadUserOrders());
      }
    } catch (error) {
      console.log(error);
      toast.error(error?.response?.data.message);
    }
  };

  useEffect(() => {
    // check if the user has already reviewed the product
    if (product.review) {
      setRating(product.review.rating);
      setComment(product.review.comment);
      setIsReviewed(true);
    }

    setRating(product?.rating);
  }, [product]);

  return (
    <div className="w-full fixed top-0 left-0 h-screen bg-[#0005] z-50 flex items-center justify-center">
      <div className="w-[50%] h-min max-h-screen overflow-y-scroll md:overflow-hidden bg-[#fff] shadow rounded-md p-5 max-w-lg flex flex-col gap-3">
        <div className="w-full flex justify-end p-3">
          <RxCross1
            size={30}
            onClick={() => setReviewPopupOpen(false)}
            className="cursor-pointer"
          />
        </div>
        <h2 className="text-[30px] font-[500] font-Poppins text-center">
          Give a Review
        </h2>
        <br />
        <div className="w-full flex flex-col md:flex-row">
          <img
            src={`${server}/${product?.images[0]?.url}`}
            alt=""
            className="w-40 aspect-square object-cover rounded-sm"
          />
          <div>
            <div className="pl-3 text-[20px]">{product?.name}</div>
            <h4 className="pl-3 text-[20px]">
              US${product?.discountPrice} x {product?.quantity}
            </h4>
          </div>
        </div>

        {/* ratings */}
        <h5 className="pl-3 text-[20px] font-[500]">
          Give a Rating <span className="text-red-500">*</span>
        </h5>
        <div className="flex w-full ml-2 pt-1">
          {[1, 2, 3, 4, 5].map((i) =>
            rating >= i ? (
              <AiFillStar
                key={i}
                onClick={() => setRating(i)}
                className="mr-1 cursor-pointer"
                color="rgb(246,186,0)"
                size={25}
              />
            ) : (
              <AiOutlineStar
                key={i}
                onClick={() => setRating(i)}
                className="mr-1 cursor-pointer"
                color="rgb(246,186,0)"
                size={25}
              />
            )
          )}
        </div>
        <div className="w-full ml-3">
          <label className="block text-[20px] font-[500]">
            Write a comment
            <span className="ml-1 font-[400] text-[16px] text-[#00000052]">
              (optional)
            </span>
          </label>
          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            name="comment"
            id=""
            cols="20"
            rows="5"
            placeholder="How was your product? write your expresion about it!"
            className="mt-2 w-[95%] border p-2 outline-none"
          ></textarea>
        </div>
        <div
          className={`${styles.buttonPrimary} w-fit mt-5 self-center cursor-pointer`}
          onClick={handleSubmitReview}
        >
          {isReviewed ? "Update Review" : "Submit Review"}
        </div>
      </div>
    </div>
  );
};

export default ReviewPopup;
