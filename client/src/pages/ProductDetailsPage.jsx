import React, { useEffect } from "react";
import { useParams } from "react-router-dom";
import Footer from "../components/Layouts/Footer";
import Header from "../components/Layouts/Header";
import ProductDetails from "../components/Product/ProductDetails";
import SuggestedProduct from "../components/Product/SuggestedProduct";
import { loadProduct } from "../redux/actions/LoadProduct";
import { useDispatch, useSelector } from "react-redux";
import STATUS from "../constants/status";
import Loader from "../components/Loader";

const ProductDetailsPage = () => {
  const dispatch = useDispatch();
  const { product, productStatus } = useSelector((state) => state.product);
  const { productId } = useParams();
  useEffect(() => {
    window.scrollTo(0, 0);

    // fetch product
    const fetchProduct = async () => {
      try {
        console.log(productId);

        await dispatch(loadProduct({ productId }));
      } catch (error) {
        console.log(error);
      }
    };

    fetchProduct();
  }, []);

  useEffect(() => {
    if (productStatus === STATUS.FAILURE) {
      window.location.href = "/404";
    }
  }, [productStatus]);

  return (
    <div>
      <Header />
      <ProductDetails />
      {productStatus === STATUS.LOADING && <Loader />}
      {productStatus === STATUS.SUCCESS && product && (
        <SuggestedProduct data={product} />
      )}
      <Footer />
    </div>
  );
};

export default ProductDetailsPage;
