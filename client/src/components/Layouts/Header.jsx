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

const Header = () => {
  const [searchTerm, setSearchTerm] = React.useState("");
  const [searchResults, setSearchResults] = React.useState([]);
  const [isFixed, setIsFixed] = React.useState(false);
  const [dropDown, setDropDown] = React.useState(false);
  const [activeHeading, setActiveHeading] = React.useState(0);
  const [openCart, setOpenCart] = React.useState(false);
  const [openWishlist, setOpenWishlist] = React.useState(false);
  const { userId, isAuthenticated } = useSelector((state) => state);
  const [mobile, setMobile] = React.useState(false);

  const wishlist = [1, 2];
  const cart = [1, 2];

  const handleScroll = () => {
    if (window.scrollY > 100) {
      setIsFixed(true);
    } else {
      setIsFixed(false);
    }
  };

  React.useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleSearchChange = (e) => {
    const term = e.target.value;
    setSearchTerm(term);

    if (term !== "") {
      const newProducts = productData.filter((product) => {
        return Object.values(product)
          .join(" ")
          .toLowerCase()
          .includes(term.toLowerCase());
      });
      setSearchResults(newProducts);
    }
  };

  return (
    <>
      {/* top bar */}
      <div className={`${StyleSheet.section}`}>
        <div className="hidden 800px:h-[50px] 800px:my-[20px] 800px:flex items-center justify-between">
          {/* brand logo */}
          <div className="flex items-center">
            <Link to="/">
              <img
                src={brandLogo}
                alt="logo"
                className="h-[30px] w-[30px] mr-[10px]"
              />
            </Link>
          </div>
          {/* search box */}
          <div className="w-[50%] relative">
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
              <div className="absolute top-[40px] left-0 w-full bg-white rounded-md shadow-md border border-gray-300 p-4">
                {searchResults.map((product, index) => {
                  return (
                    <Link
                      to={`/product/${product.id}`}
                      key={index}
                      className="px-[10px] hover:bg-gray-200 transition-all duration-300 ease-in-out flex gap-2 py-3"
                    >
                      <img
                        src={product.image_Url[0].url}
                        alt={product.image_Url[0].name}
                        className="h-[40px] w-[40px] mr-[10px]"
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
            <button className="text-white font-semibold flex items-center flex-shrink-0">
              Become Seller
              <span className="ml-2">
                {" "}
                <IoIosArrowForward />
              </span>
            </button>
          </div>
        </div>
      </div>

      {/* navbar */}
      <div
        className={`${
          isFixed === true ? "shadow-sm fixed top-0 left-0 z-10" : null
        } transition hidden 800px:flex items-center justify-between w-full bg-indigo-700 h-[70px]`}
      >
        <div
          className={`${StyleSheet.section} h-full relative flex justify-between border-red-500 border-2`}
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
                      src={`${user?.avatar?.url}`}
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
          mobile === true ? "shadow-sm fixed top-0 left-0 z-10" : null
        }
      w-full h-[60px] bg-[#fff] z-50 top-0 left-0 shadow-sm 800px:hidden`}
      >
        <div className="w-full flex items-center justify-between">
          <div>
            <BiMenuAltLeft
              size={40}
              className="ml-4"
              onClick={() => setOpen(true)}
            />
          </div>
          <div>
            <Link to="/">
              <img src={brandLogo} alt="" className="mt-3 cursor-pointer" />
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
        {open && (
          <div
            className={`fixed w-full bg-[#0000005f] z-20 h-full top-0 left-0`}
          >
            <div className="fixed w-[70%] bg-[#fff] h-screen top-0 left-0 z-10 overflow-y-scroll">
              <div className="w-full justify-between flex pr-3">
                <div>
                  <div
                    className="relative mr-[15px]"
                    onClick={() => setOpenWishlist(true) || setOpen(false)}
                  >
                    <AiOutlineHeart size={30} className="mt-5 ml-3" />
                    <span className="absolute right-0 top-0 rounded-full bg-[#3bc177] w-4 h-4 top right p-0 m-0 text-white font-mono text-[12px]  leading-tight text-center">
                      {wishlist && wishlist.length}
                    </span>
                  </div>
                </div>
                <RxCross1
                  size={30}
                  className="ml-4 mt-5"
                  onClick={() => setOpen(false)}
                />
              </div>

              <div className="my-8 w-[92%] m-auto h-[40px relative]">
                <input
                  type="search"
                  placeholder="Search Product..."
                  className="h-[40px] w-full px-2 border-[#3957db] border-[2px] rounded-md"
                  value={searchTerm}
                  onChange={handleSearchChange}
                />
                {searchResults && (
                  <div className="absolute bg-[#fff] z-10 shadow w-full left-0 p-3">
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

              <Navbar active={activeHeading} />
              <div className={`${StyleSheet.button} ml-4 !rounded-[4px]`}>
                <Link to="/shop-create">
                  <h1 className="text-[#fff] flex items-center">
                    Become Seller <IoIosArrowForward className="ml-1" />
                  </h1>
                </Link>
              </div>
              <br />
              <br />
              <br />

              <div className="flex w-full justify-center">
                {isAuthenticated ? (
                  <div>
                    <Link to="/profile">
                      <img
                        src={`${user.avatar?.url}`}
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
