import React from "react";
import styles from "../../styles/styles";
import ShopInfo from "../../components/Shop/ShopPrev/ShopInfo";
import ShopContent from "../../components/Shop/ShopPrev/ShopContent";
import { useParams } from "react-router-dom";
import Header from "../../components/Layouts/Header";
import Footer from "../../components/Layouts/Footer";

const ShopPreviewPage = () => {
  const { shopId } = useParams();
  console.log(shopId);
  return (
    <>
      <Header />
      <div className={`${styles.section} bg-[#f5f5f5] py-10`}>
        <div className="grid lg:grid-cols-12 gap-10">
          <div className="col-span-4 rounded-lg shadow-lg overflow-hidden">
            <ShopInfo />
          </div>
          <div className="col-span-8 rounded-lg shadow-lg overflow-hidden p-5 bg-white">
            <ShopContent shopId={shopId} />
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default ShopPreviewPage;
