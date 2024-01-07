import React from "react";
import StyleSheet from "../../styles/styles";
import brandLogo from "../../assets/logo.svg";
import { Link } from "react-router-dom";
import { productData } from "../../static/productData";
import { categoriesData } from "../../static/categoriesData";
import { AiOutlineSearch } from "react-icons/ai";
import {
  IoIosArrowForward,
  IoIosArrowUp,
  IoIosArrowDown,
} from "react-icons/io";
import { BiMenuAltLeft } from "react-icons/bi";
import Navbar from "./Navbar";
import DropDown from "./DropDown";
import { AiOutlineHeart, AiOutlineShoppingCart } from "react-icons/ai";
import { CgProfile } from "react-icons/cg";
import { useSelector } from "react-redux";
import { RxCross1 } from "react-icons/rx";
import { useLocation } from "react-router-dom";
import { server } from "../../server";
import Cart from "../cart/Cart";
import Wishlist from "../Wishlist/Wishlist";
import axios from "axios";
import { useEffect } from "react";
import STATUS from "../../constants/status";

const Header = () => {
  const { items: cart } = useSelector((state) => state.cart);
  const { items: wishlist } = useSelector((state) => state.wishlist);

  const [mobileSidebarOpen, setMobileSidebarOpen] = React.useState(false);
  const { isAuthenticated } = useSelector((state) => state.user);
  const { user } = useSelector((state) => state.user);
  const isSeller = user?.isSeller;
  const [searchTerm, setSearchTerm] = React.useState("");
  const [searchResults, setSearchResults] = React.useState([]);
  const [isFixed, setIsFixed] = React.useState(false);
  const [dropDown, setDropDown] = React.useState(false);
  const [activeHeading, setActiveHeading] = React.useState(0);
  const [openCart, setOpenCart] = React.useState(false);
  const [openWishlist, setOpenWishlist] = React.useState(false);
  const [mobile, setMobile] = React.useState(false);
  const location = useLocation();
  const [allProducts, setAllProducts] = React.useState([]);
  const [status, setStatus] = React.useState("");

  useEffect(() => {
    const fetchAllProducts = async () => {
      setStatus(STATUS.LOADING);
      try {
        const res = await axios.get(`${server}/product/all`);
        setAllProducts(res.data.products);
        setStatus(STATUS.SUCCESS);
        console.log(res.data.products);
      } catch (err) {
        console.log(err);
        setStatus(STATUS.FAILURE);
      }
    };
    fetchAllProducts();
  }, []);

  const handleScroll = () => {
    if (window.scrollY > 100) {
      setIsFixed(true);
    } else {
      setIsFixed(false);
    }
  };

  const handleResize = () => {
    if (window.innerWidth < 800) {
      setMobile(true);
    } else {
      setMobile(false);
    }
  };

  React.useEffect(() => {
    // Use location.pathname to get the current path
    const currentPath = location.pathname;

    // Use currentPath to set activeHeading
    switch (currentPath) {
      case "/":
        setActiveHeading(1);
        break;
      case "/best-selling":
        setActiveHeading(2);
        break;
      case "/products":
        setActiveHeading(3);
        break;
      case "/events":
        setActiveHeading(4);
        break;
      case "/faq":
        setActiveHeading(5);
        break;
      default:
        // Set a default value if the path doesn't match any of the cases
        setActiveHeading(0);
        break;
    }
  }, [location.pathname]); // Run the effect whenever the route path changes

  React.useEffect(() => {
    handleResize();

    window.addEventListener("resize", handleResize);
    window.addEventListener("scroll", handleScroll);
    window.addEventListener("click", (event) => {
      if (
        event.target.id === "searchBar" ||
        event.target.id === "searchDropdown"
      )
        return;
      setSearchTerm("");
    });
    return () => {
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const handleSearchChange = (e) => {
    const term = e.target.value;
    setSearchTerm(term);

    const results = allProducts.filter((product) =>
      product.name.toLowerCase().includes(term.toLowerCase())
    );

    setSearchResults(results);
  };

  return (
    <>
      {/* top bar */}
      <div className={`${StyleSheet.section}`}>
        <div className="hidden 800px:h-[50px] 800px:my-[20px] 800px:flex items-center justify-between">
          {/* brand logo */}
          <div className="flex items-center">
            <Link to="/" className="flex gap-3 items-center">
              <img src={brandLogo} alt="logo" className="w-10 h-10" />
              <h1 className="font-bold text-4xl">
                <span className="text-[#1083DD]">Drop</span>
                <span>Box</span>
              </h1>
            </Link>
          </div>
          {/* search box */}
          <div className="w-[50%] relative" id="searchBar">
            <input
              type="text"
              placeholder="Search Product..."
              value={searchTerm}
              onChange={handleSearchChange}
              className="h-[40px] w-full px-[10px] py-[5px] rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
            <AiOutlineSearch
              size={30}
              className="absolute top-1.5 right-2 text-gray-400 cursor-pointer hover:text-gray-600 transition-all duration-300 ease-in-out"
            />
            {searchTerm && searchTerm.length !== 0 ? (
              <div
                id="searchDropdown"
                className="absolute top-[40px] left-0 w-full bg-white rounded-md shadow-md border border-gray-300 p-4 z-50"
              >
                {searchResults.map((product, index) => {
                  return (
                    <Link
                      to={`/products/${product._id}`}
                      key={index}
                      className="px-[10px] hover:bg-gray-200 transition-all duration-300 ease-in-out flex gap-2 py-3"
                    >
                      <img
                        src={`${server}/${product.images[0].url}`}
                        alt={product.name}
                        className="h-[40px] w-[40px] mr-[10px] object-cover"
                      />
                      {product.name.replace(/\b\w/g, (l) => l.toUpperCase())}
                    </Link>
                  );
                })}
              </div>
            ) : null}
          </div>
          {/* become a seller button */}
          <div className={StyleSheet.button}>
            {isSeller && (
              <Link to="/seller/signup">
                <h1 className="text-[#fff] flex items-center">
                  Shop Dashboard <IoIosArrowForward className="ml-1" />
                </h1>
              </Link>
            )}
            {isAuthenticated && !isSeller && (
              <Link to="/seller/signup">
                <h1 className="text-[#fff] flex items-center">
                  Become Seller <IoIosArrowForward className="ml-1" />
                </h1>
              </Link>
            )}
            {!isAuthenticated && (
              <Link to="/signup">
                <h1 className="text-[#fff] flex items-center">
                  Signup <IoIosArrowForward className="ml-1" />
                </h1>
              </Link>
            )}
          </div>
        </div>
      </div>

      {/* navbar */}
      <div
        className={`${
          isFixed === true ? "shadow-sm fixed top-0 left-0 z-50" : null
        } transition hidden 800px:flex items-center justify-between w-full bg-indigo-700 h-[70px]`}
      >
        <div
          className={`${StyleSheet.section} h-full relative flex justify-between`}
        >
          {/* Categories */}
          <div
            onClick={() => setDropDown(!dropDown)}
            className="relative gap-8 flex items-center justify-between bg-white px-2 mt-4 rounded-t-lg cursor-pointer"
          >
            <BiMenuAltLeft size={20} className="text-black cursor-pointer" />

            <h2 className="text-black font-semibold">All Categories</h2>
            <div>
              {!dropDown ? (
                <IoIosArrowDown
                  size={30}
                  className="text-black cursor-pointer"
                />
              ) : (
                <IoIosArrowUp size={30} className="text-black cursor-pointer" />
              )}
            </div>
            {/* dropdown */}
            {dropDown && (
              <div className="absolute bottom-0 left-0 z-100 w-full">
                <DropDown
                  categoriesData={categoriesData}
                  setDropDown={setDropDown}
                />
              </div>
            )}
          </div>

          {/* navitems */}
          <div className={`${StyleSheet.noramlFlex}`}>
            <Navbar active={activeHeading} />
          </div>

          {/* cart,wishlist and profile icons */}
          <div className="flex">
            {/* wishlist icon */}
            <div className={`${StyleSheet.noramlFlex}`}>
              <div
                className="relative cursor-pointer mr-[15px]"
                onClick={() => setOpenWishlist(true)}
              >
                <AiOutlineHeart size={30} color="rgb(255 255 255 / 83%)" />
                <span className="absolute right-0 top-0 rounded-full bg-[#3bc177] w-4 h-4 top right p-0 m-0 text-white font-mono text-[12px] leading-tight text-center">
                  {wishlist && wishlist.length}
                </span>
              </div>
            </div>

            {/* cart icon */}
            <div className={`${StyleSheet.noramlFlex}`}>
              <div
                className="relative cursor-pointer mr-[15px]"
                onClick={() => setOpenCart(true)}
              >
                <AiOutlineShoppingCart
                  size={30}
                  color="rgb(255 255 255 / 83%)"
                />
                <span className="absolute right-0 top-0 rounded-full bg-[#3bc177] w-4 h-4 top right p-0 m-0 text-white font-mono text-[12px] leading-tight text-center">
                  {cart && cart.length}
                </span>
              </div>
            </div>

            {/* profile icon */}
            <div className={`${StyleSheet.noramlFlex}`}>
              <div className="relative cursor-pointer mr-[15px]">
                {isAuthenticated ? (
                  <Link to="/profile">
                    <img
                      src={`${server}/${user?.avatar}`}
                      className="w-[35px] h-[35px] rounded-full"
                      alt=""
                    />
                  </Link>
                ) : (
                  <Link to="/login">
                    <CgProfile size={30} color="rgb(255 255 255 / 83%)" />
                  </Link>
                )}
              </div>
            </div>

            {/* cart popup */}
            {openCart ? <Cart setOpenCart={setOpenCart} /> : null}

            {/* wishlist popup */}
            {openWishlist ? (
              <Wishlist setOpenWishlist={setOpenWishlist} />
            ) : null}
          </div>
        </div>
      </div>
      {/* mobile header */}
      <div
        className={`${
          mobile === true ? "shadow-sm fixed top-0 left-0 z-50" : null
        }
      w-full h-[60px] bg-[#fff] z-50 top-0 left-0 shadow-sm 800px:hidden`}
      >
        <div className="w-full flex items-center justify-between">
          <div>
            <BiMenuAltLeft
              size={40}
              className="ml-4"
              onClick={() => setMobileSidebarOpen(true)}
            />
          </div>
          <div>
            <Link to="/">
              <img
                src={brandLogo}
                alt=""
                className="mt-3 cursor-pointer w-10"
              />
            </Link>
          </div>
          <div>
            <div
              className="relative mr-[20px]"
              onClick={() => setOpenCart(true)}
            >
              <AiOutlineShoppingCart size={30} />
              <span className="absolute right-0 top-0 rounded-full bg-[#3bc177] w-4 h-4 top right p-0 m-0 text-white font-mono text-[12px]  leading-tight text-center">
                {cart && cart.length}
              </span>
            </div>
          </div>
          {/* cart popup */}
          {openCart ? <Cart setOpenCart={setOpenCart} /> : null}

          {/* wishlist popup */}
          {openWishlist ? <Wishlist setOpenWishlist={setOpenWishlist} /> : null}
        </div>

        {/* header sidebar */}
        {mobileSidebarOpen && (
          <div
            className={`fixed w-full bg-[#0000005f] z-20 h-full top-0 left-0`}
          >
            <div className="fixed w-[70%] bg-[#fff] h-screen top-0 left-0 z-50 overflow-y-scroll px-8 py-10">
              <div className="w-full justify-between flex">
                <div>
                  <div
                    className="relative"
                    onClick={() => setOpenWishlist(true) || setOpen(false)}
                  >
                    <AiOutlineHeart size={30} />
                    <span className="absolute right-0 top-0 rounded-full bg-[#3bc177] w-4 h-4 top right p-0 m-0 text-white font-mono text-[12px]  leading-tight text-center">
                      {wishlist && wishlist.length}
                    </span>
                  </div>
                </div>
                <RxCross1
                  size={30}
                  onClick={() => setMobileSidebarOpen(false)}
                />
              </div>

              <div className="my-8 w-full h-[40px relative]" id="searchBar">
                <input
                  type="search"
                  placeholder="Search Product..."
                  className="h-[40px] w-full px-2 border-[#3957db] border-[2px] rounded-md"
                  value={searchTerm}
                  onChange={handleSearchChange}
                />
                {searchTerm && (
                  <div
                    className="absolute bg-[#fff] z-50 shadow w-full left-0 p-3"
                    id="searchDropdown"
                  >
                    {searchResults.map((i) => {
                      const d = i.name;

                      const Product_name = d.replace(/\s+/g, "-");
                      return (
                        <Link to={`/product/${Product_name}`}>
                          <div className="flex items-center">
                            <img
                              src={i.image_Url[0]?.url}
                              alt=""
                              className="w-[50px] mr-2"
                            />
                            <h5>{i.name}</h5>
                          </div>
                        </Link>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* navabr */}
              <Navbar active={activeHeading} mobile={mobile} />

              {/* Become seller button */}
              <div className={`${StyleSheet.button} rounded-md mb-5`}>
                <Link to="/shop-create">
                  <h1 className="text-[#fff] flex items-center">
                    Become Seller <IoIosArrowForward className="ml-1" />
                  </h1>
                </Link>
              </div>

              {/* profile */}
              <div className="flex w-full justify-center">
                {isAuthenticated && user.avatar ? (
                  <div>
                    <Link to="/profile">
                      <img
                        src={`${server}/${user?.avatar}`}
                        alt=""
                        className="w-[60px] h-[60px] rounded-full border-[3px] border-[#0eae88]"
                      />
                    </Link>
                  </div>
                ) : (
                  <>
                    <Link
                      to="/login"
                      className="text-[18px] pr-[10px] text-[#000000b7]"
                    >
                      Login /
                    </Link>
                    <Link
                      to="/sign-up"
                      className="text-[18px] text-[#000000b7]"
                    >
                      Sign up
                    </Link>
                  </>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default Header;
