import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useSearchParams } from "react-router-dom";
import Header from "../components/Layouts/Header";
import ProductCard from "../components/Home/ProductCard";
import styles from "../styles/styles";
import Footer from "../components/Layouts/Footer";
import { productData } from "../static/productData";

const BestSellingPage = () => {
  const [data, setData] = useState([]);
  const isLoading = false;
  const allProducts = productData;

  useEffect(() => {
    const allProductsData = allProducts ? [...allProducts] : [];
    const sortedData = allProductsData?.sort(
      (a, b) => b.total_sell - a.total_sell
    );
    setData(sortedData);
  }, [allProducts]);

  return (
    <>
      {isLoading ? (
        <Loader />
      ) : (
        <div>
          <Header activeHeading={2} />
          <br />
          <br />
          <div className={`${styles.section}`}>
            <div className="grid grid-cols-1 gap-[20px] md:grid-cols-2 md:gap-[25px] lg:grid-cols-4 lg:gap-[25px] xl:grid-cols-5 xl:gap-[30px] mb-12">
              {data &&
                data.map((i, index) => <ProductCard data={i} key={index} />)}
            </div>
          </div>
          <Footer />
        </div>
      )}
    </>
  );
};

export default BestSellingPage;
