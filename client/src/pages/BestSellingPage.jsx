import React, { useEffect, useState } from "react";
import styles from "../styles/styles";
import ProductCard from "../components/home/ProductCard";
import axios from "axios";
import { server } from "../server";
import Loader from "../components/Loader";
import { toast } from "react-toastify";
import Header from "../components/Layouts/Header";
import Footer from "../components/Layouts/Footer";

const BestSellingPage = () => {
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
          <Header activeHeading={2} />
          <br />
          <br />
          <div className={`${styles.section}`}>
            <div className="grid grid-cols-1 gap-[20px] md:grid-cols-2 md:gap-[25px] lg:grid-cols-4 lg:gap-[25px] xl:grid-cols-5 xl:gap-[30px] mb-12">
              {bestSellingProducts &&
                bestSellingProducts.map((i, index) => (
                  <ProductCard product={i} key={i._id} />
                ))}
            </div>
          </div>
          <Footer />
        </div>
      )}
    </>
  );
};

export default BestSellingPage;
