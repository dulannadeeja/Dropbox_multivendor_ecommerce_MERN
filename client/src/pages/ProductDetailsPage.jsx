import React, { useEffect, useState } from "react";
import { useParams, useSearchParams } from "react-router-dom";
import Footer from "../components/Layouts/Footer";
import Header from "../components/Layouts/Header";
import ProductDetails from "../components/Product/ProductDetails";
import SuggestedProduct from "../components/Product/SuggestedProduct";
import { productData } from "../static/productData";
import { eventData as eventStatic } from "../static/eventData";

const ProductDetailsPage = () => {
  const allProducts = productData;
  const allEvents = [];
  const { productId } = useParams();
  const [data, setData] = useState(null);
  const [searchParams] = useSearchParams();
  const eventData = searchParams.get("isEvent");
  const testProduct = {
    id: 1,
    shop: {
      id: 1,
      name: "Shop 1",
      address: "Shop 1 address",
      phone: "1234567890",
    },
    name: "Product 1",
    description: "This is product 1",
    price: 100,
    discountPrice: 90,
    images: [
      {
        url: "https://picsum.photos/200/300",
      },
      {
        url: "https://picsum.photos/200/300",
      },
    ],
    category: "category 1",
    subcategory: "subcategory 1",
    brand: "brand 1",
    rating: 4.5,
    numReviews: 10,
    countInStock: 10,
    isFeatured: true,
    reviews: [
      {
        id: 1,
        user: {
          id: 1,
          name: "User 1",
        },
        rating: 4.5,
        comment: "This is a review",
      },
      {
        id: 2,
        user: {
          id: 2,
          name: "User 2",
        },
        rating: 4.5,
        comment: "This is a review",
      },
    ],
  };

  useEffect(() => {
    window.scrollTo(0, 0);
    if (eventData !== null) {
      const data = allEvents && allEvents.find((i) => i.id === productId);
      setData(data);
    } else {
      const data = allProducts && allProducts.find((i) => i.id === productId);
      setData(data);
    }
    console.log("Product id is" + allProducts[0].id);
  }, [allProducts, allEvents]);

  return (
    <div>
      <Header />
      <ProductDetails data={testProduct} />
      {!eventData && (
        <>{testProduct && <SuggestedProduct data={testProduct} />}</>
      )}
      <Footer />
    </div>
  );
};

export default ProductDetailsPage;
