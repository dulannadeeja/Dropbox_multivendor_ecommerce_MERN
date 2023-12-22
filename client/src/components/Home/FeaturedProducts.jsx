import React from "react";
import styles from "../../styles/styles";
import ProductCard from "./ProductCard";
import { productData } from "../../static/productData";
import Loader from "../Loader";
import { useEffect, useState } from "react";
import axios from "axios";
import { server } from "../../server";
import { toast } from "react-toastify";

const FeaturedProduct = () => {
  const allProducts = productData;

  useEffect(() => {
    fetchAllFeaturedProducts();
  }, []);

  const [allFeaturedProducts, setAllFeaturedProducts] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchAllFeaturedProducts = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${server}/product/featured`);
      setAllFeaturedProducts(res.data.products);
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
              <h1>Featured Products</h1>
            </div>
            <div className="grid grid-cols-1 gap-[20px] md:grid-cols-2 md:gap-[25px] lg:grid-cols-4 lg:gap-[25px] xl:grid-cols-5 xl:gap-[30px] mb-12 border-0">
              {allFeaturedProducts && allFeaturedProducts.length !== 0 && (
                <>
                  {allFeaturedProducts &&
                    allFeaturedProducts.map((i, index) => (
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

export default FeaturedProduct;
