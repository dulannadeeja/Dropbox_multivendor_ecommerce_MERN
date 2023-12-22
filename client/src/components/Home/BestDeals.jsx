import React, { useEffect, useState } from "react";
import styles from "../../styles/styles";
import ProductCard from "./ProductCard";
import axios from "axios";
import { server } from "../../server";
import Loader from "../Loader";
import { toast } from "react-toastify";

const BestDeals = () => {
  useEffect(() => {
    fetchBestSellingProducts();
  }, []);

  const [bestSellingProducts, setBestSellingProducts] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchBestSellingProducts = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${server}/product/best-selling`);
      setBestSellingProducts(res.data.products);
    } catch (err) {
      toast.error(
        err.response?.data?.message || err.message || "something went wrong"
      );
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {loading ? (
        <Loader />
      ) : (
        <div>
          <div className={`${styles.section}`}>
            <div className={`${styles.heading}`}>
              <h1>Best Deals</h1>
            </div>
            <div className="grid grid-cols-1 gap-[20px] md:grid-cols-2 md:gap-[25px] lg:grid-cols-4 lg:gap-[25px] xl:grid-cols-5 xl:gap-[30px] mb-12 border-0">
              {bestSellingProducts && bestSellingProducts.length !== 0 && (
                <>
                  {bestSellingProducts &&
                    bestSellingProducts.map((i, index) => (
                      <ProductCard product={i} key={i._id} />
                    ))}
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default BestDeals;
