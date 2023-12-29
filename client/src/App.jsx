import React from "react";
import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import {
  LoginPage,
  SignupPage,
  ActivationPage,
  ForgotPasswordPage,
  SetPasswordPage,
  HomePage,
  BestSellingPage,
  ProductsPage,
  EventsPage,
  FAQPage,
  ProductDetailsPage,
  ProfilePage,
  SellerSignupPage,
  PaymentPage,
  OrderCompletedPage,
  OrderDetailsPage,
} from "./Routes.js";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer } from "react-toastify";
import StartVerificationPage from "./pages/StartVerificationPage.jsx";
import { useEffect } from "react";
import Store from "./redux/store.js";
import { loadUser } from "./redux/actions/user.js";
import ProtectedRoutes from "./ProtectedRoutes.jsx";
import { useSelector } from "react-redux";
import Loader from "./components/Loader.jsx";
import { ShopDashboardPage, ShopOrderDetailsPage } from "./ShopRoutes.js";
import { loadShop } from "./redux/actions/shop.js";
import { toast } from "react-toastify";
import STATUS from "./constants/status.js";
import ShopPreviewPage from "./pages/shop/ShopPreviewPage.jsx";
import CheckoutPage from "./pages/CheckoutPage.jsx";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import { server } from "./server.js";
import axios from "axios";
import { updateNotifications } from "./redux/actions/updateNotifications.js";

const App = () => {
  const dispatch = Store.dispatch;
  const {
    user,
    isAuthenticated,
    isSeller,
    currentStatus: userCurrentStatus,
  } = useSelector((state) => state.user);
  const {
    shop,
    error,
    currentStatus: shopCurrentStatus,
  } = useSelector((state) => state.shop);
  const [stripeKey, setStripeKey] = React.useState(null);

  useEffect(() => {
    if (
      shopCurrentStatus === STATUS.FAILURE ||
      userCurrentStatus === STATUS.FAILURE
    ) {
      console.log("Error", error);
    }
  }, [shopCurrentStatus, userCurrentStatus]);

  useEffect(() => {
    const fetchAuthInfo = async () => {
      try {
        await dispatch({ type: "LoadCart" });
        console.log("Fetching auth info");
        await dispatch(loadUser());
      } catch (err) {
        console.error(err);
      }
    };

    fetchAuthInfo();
  }, []);

  useEffect(() => {
    // Dispatch the action to start listening for events and connect to the socket
    dispatch(updateNotifications());
  }, [dispatch]);

  useEffect(() => {
    const getStripeKey = async () => {
      console.log("Fetching stripe key");
      try {
        const config = {
          headers: {
            "Content-Type": "application/json",
            authorization: `Bearer ${user?.token}`,
          },
        };
        const { data } = await axios.get(
          `${server}/payment/stripe-key`,
          config,
          { withCredentials: true }
        );
        setStripeKey(data.stripe_key);
        console.log(data);
      } catch (err) {
        console.error(err);
      }
    };
    if (userCurrentStatus === STATUS.SUCCESS) {
      getStripeKey();
    }
  }, [isAuthenticated]);

  const [loading, setLoading] = React.useState(true);

  useEffect(() => {
    console.log(userCurrentStatus);
    const fetchShopInfo = async () => {
      try {
        await dispatch(loadShop(user?.shop));
      } catch (err) {
        console.error(err);
      }
    };
    if (userCurrentStatus === STATUS.SUCCESS && isSeller) {
      console.log("Fetching shop info" + userCurrentStatus);
      fetchShopInfo();
    }
  }, [isAuthenticated, isSeller]);

  useEffect(() => {
    if (
      userCurrentStatus === STATUS.IDLE ||
      userCurrentStatus === STATUS.LOADING ||
      shopCurrentStatus === STATUS.LOADING
    ) {
      setLoading(true);
      return;
    }
    if (
      userCurrentStatus === STATUS.SUCCESS ||
      userCurrentStatus === STATUS.FAILURE ||
      shopCurrentStatus === STATUS.SUCCESS ||
      shopCurrentStatus === STATUS.FAILURE
    ) {
      setLoading(false);
    }
  }, [userCurrentStatus, shopCurrentStatus]);

  if (loading) {
    return <Loader />;
  }

  return (
    <>
      <BrowserRouter>
        {stripeKey && (
          <Elements stripe={loadStripe(stripeKey)}>
            <Routes>
              <Route path="/payment" element={<PaymentPage />} />
              <Route path="/order-completed" element={<OrderCompletedPage />} />
            </Routes>
          </Elements>
        )}
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/about" element={<h1>About</h1>} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route path="/activate/:role/:token" element={<ActivationPage />} />
          <Route
            path="/verification/:userId"
            element={<StartVerificationPage />}
          />
          <Route path="/forgot-password" element={<ForgotPasswordPage />} />
          <Route path="/reset-password/:token" element={<SetPasswordPage />} />
          <Route path="/products" element={<ProductsPage />} />
          <Route path="/products/:productId" element={<ProductDetailsPage />} />
          <Route path="/best-selling" element={<BestSellingPage />} />
          <Route path="/events" element={<EventsPage />} />
          <Route path="/Faq" element={<FAQPage />} />

          <Route path="/profile" element={<ProtectedRoutes />}>
            <Route index element={<ProfilePage />} />
          </Route>
          <Route path="/seller/signup" element={<ProtectedRoutes />}>
            <Route index element={<SellerSignupPage />} />
          </Route>
          <Route
            path="/shop/verification/:shopId"
            element={<StartVerificationPage />}
          />
          <Route path="/shop/dashboard" element={<ProtectedRoutes />}>
            <Route index element={<ShopDashboardPage />} />
          </Route>
          <Route
            path="/shop/order/:orderId"
            element={<ShopOrderDetailsPage />}
          />
          <Route path="/order/:orderId" element={<OrderDetailsPage />} />
          <Route path="/shop/:shopId" element={<ShopPreviewPage />} />
          <Route path="/checkout" element={<CheckoutPage />} />
        </Routes>
      </BrowserRouter>
      <ToastContainer />
    </>
  );
};

export default App;
