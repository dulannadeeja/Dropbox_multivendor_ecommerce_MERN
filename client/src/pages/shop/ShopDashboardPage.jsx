import React, { useEffect } from "react";
import DashboardHeader from "../../components/Shop/Layout/DashboardHeader";
import DashboardSideBar from "../../components/Shop/Layout/DashboardSideBar";
import DashboardContent from "../../components/Shop/Layout/DashboardContent.jsx";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router";
import { useLocation } from "react-router-dom";
import Loader from "../../components/Loader.jsx";
const ShopDashboardPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, isAuthenticated, isSeller } = useSelector(
    (state) => state.user
  );
  const { shop } = useSelector((state) => state.shop);
  const [active, setActive] = React.useState(1);
  const [loading, setLoading] = React.useState(false);

  useEffect(() => {
    setLoading(true);
    if (!isAuthenticated) {
      const nextState = { from: location };
      navigate("/login", { state: nextState });
    }
    if (isAuthenticated && isSeller) {
      navigate("/shop/dashboard");
    }
  }, [user, shop]);

  useEffect(() => {
    // if query is present then set the active tab
    if (location.search) {
      const query = new URLSearchParams(location.search);
      if (query.get("tab") === "orders") {
        setActive(2);
      }
      console.log(query.get("tab"));
    }
  }, []);

  return (
    <>
      {loading ? (
        <Loader />
      ) : (
        <div>
          <DashboardHeader />
          <div className="grid grid-cols-12 gap-2 min-h-screen">
            <div className="col-span-2">
              <DashboardSideBar active={active} setActive={setActive} />
            </div>
            <div className="col-span-10">
              <DashboardContent active={active} setActive={setActive} />
            </div>
          </div>
        </div>
      )}
      {/* Move setLoading(false) here */}
      {loading && setLoading(false)}
    </>
  );
};

export default ShopDashboardPage;
