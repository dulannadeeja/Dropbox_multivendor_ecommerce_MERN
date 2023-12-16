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
} from "./Routes.js";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer } from "react-toastify";
import StartVerificationPage from "./pages/StartVerificationPage.jsx";
import { useEffect } from "react";
import Store from "./redux/store.js";
import { loadUser } from "./redux/actions/user.js";
import OrdersPage from "./components/Profile/OrdersTable";
import ProtectedRoutes from "./ProtectedRoutes.jsx";
import { useSelector } from "react-redux";
import ShopCreatePage from "./pages/ShopCreatePage.jsx";

const App = () => {
  const { isAuthenticated } = useSelector((state) => state.user);

  useEffect(() => {
    Store.dispatch(loadUser());
  }, []); // The empty dependency array means this effect runs once when the component mounts

  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/about" element={<h1>About</h1>} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route
            path="/verification/:userId"
            element={<StartVerificationPage />}
          />
          <Route path="/activate/:token" element={<ActivationPage />} />
          <Route path="/forgot-password" element={<ForgotPasswordPage />} />
          <Route path="/reset-password/:token" element={<SetPasswordPage />} />
          <Route path="/products" element={<ProductsPage />} />
          <Route path="/products/:productId" element={<ProductDetailsPage />} />
          <Route path="/best-selling" element={<BestSellingPage />} />
          <Route path="/events" element={<EventsPage />} />
          <Route path="/Faq" element={<FAQPage />} />
          <Route
            path="/orders"
            element={
              <ProtectedRoutes isAuthenticated={isAuthenticated}>
                <OrdersPage />
              </ProtectedRoutes>
            }
          />
          <Route
            path="/profile"
            element={
              <ProtectedRoutes isAuthenticated={isAuthenticated}>
                <ProfilePage />
              </ProtectedRoutes>
            }
          />
          <Route path="/shop-create" element={<ShopCreatePage />} />
        </Routes>
      </BrowserRouter>
      <ToastContainer />
    </>
  );
};

export default App;
