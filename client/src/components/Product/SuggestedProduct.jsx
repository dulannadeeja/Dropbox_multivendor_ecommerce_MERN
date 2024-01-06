import React, { useEffect, useState } from "react";
import styles from "../../styles/styles";
import ProductCard from "../Home/ProductCard";
import { server } from "../../server";
import axios from "axios";

const SuggestedProduct = ({ data }) => {
  console.log("suggested product");
  console.log(data);

  const [productsData, setProductsData] = useState();

  useEffect(() => {
    const fetchSuggestions = async () => {
      try {
        const res = await axios.get(
          `${server}/product/suggestions/${data._id}`
        );
        setProductsData(res.data.products);
        console.log(res);
      } catch (err) {
        console.log(err);
      }
    };
    fetchSuggestions();
  }, []);

  return (
    <div className="max-w-6xl mx-auto">
      {data ? (
        <div>
          <h2
            className={`${styles.heading} text-[25px] font-[500] border-b mb-5`}
          >
            Related Product
          </h2>
          <div className="grid grid-cols-1 gap-[20px] md:grid-cols-2 md:gap-[25px] lg:grid-cols-4 lg:gap-[25px] xl:grid-cols-5 xl:gap-[30px] mb-12">
            {productsData &&
              productsData.map((i, index) => (
                <ProductCard product={i} key={index} />
              ))}
          </div>
        </div>
      ) : null}
    </div>
  );
};

export default SuggestedProduct;
