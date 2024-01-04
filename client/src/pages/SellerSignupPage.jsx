import React from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import SellerSignupForm from "../components/SellerSignup/SellerSignupForm";
import { SellerSignupProvider } from "../contexts/SellerSignupContext";
import Loader from "../components/Loader";
import { useLocation } from "react-router-dom";
import Header from "../components/Layouts/Header";
import Footer from "../components/Layouts/Footer";

const SellerSignupPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, isAuthenticated, isSeller } = useSelector(
    (state) => state.user
  );
  const [loading, setLoading] = React.useState(true);
  const { shop } = useSelector((state) => state.shop);

  React.useEffect(() => {
    if (!isAuthenticated) {
      const nextState = { from: location };
      navigate("/login", { state: nextState });
    }

    if (isAuthenticated && isSeller) {
      navigate("/shop/dashboard");
    }
    setLoading(false);
  }, [user, shop, isAuthenticated, isSeller]);

  return (
    <>
      <Header />
      {loading ? (
        <Loader />
      ) : (
        <div className="800px:flex w-full">
          <SellerSignupProvider>
            <SellerSignupForm />
          </SellerSignupProvider>
        </div>
      )}
      <Footer />
    </>
  );
};

export default SellerSignupPage;
