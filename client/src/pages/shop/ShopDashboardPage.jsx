import React from "react";
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

  React.useEffect(() => {
    setLoading(true);
    if (!isAuthenticated || !isSeller) {
      const nextState = { from: location };
      navigate("/login", { state: nextState });
    }
  }, [user, shop]);

  return (
    <>
      {loading ? (
        <Loader />
      ) : (
        <div>
          <DashboardHeader />
          <div className="flex gap-2 w-full">
            <div className="w-[80px] 800px:w-[330px]">
              <DashboardSideBar active={active} setActive={setActive} />
            </div>
            <div className="w-full">
              <DashboardContent active={active} />
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
