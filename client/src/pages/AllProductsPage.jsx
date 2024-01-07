import { useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { server } from "../server";
import axios from "axios";
import STATUS from "../constants/status";
import { useState } from "react";
import FilterHeader from "../components/ProductFilter/FilterHeader";
import Header from "../components/AllProducts/Header";
import Footer from "../components/Layouts/Footer";
import Sidebar from "../components/ProductFilter/Sidebar";
import ProductCard from "../components/Home/ProductCard";
import styles from "../styles/styles";
import MobileFilter from "../components/ProductFilter/MobileFilter";
import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/20/solid";

export default function AllProductsPage() {
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  const [allProducts, setAllProducts] = useState([]);
  const [searchParams] = useSearchParams();
  const category = searchParams.get("category");
  const [status, setStatus] = useState(STATUS.IDLE);

  //pagination variables
  const productLimit = 20;
  const [totalProducts, setTotalProducts] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [lastPage, setLastPage] = useState(1);
  const [startingProductIndex, setStartingProductIndex] = useState(0);
  const [endProductIndex, setEndProductIndex] = useState(0);

  // Search products variables
  const [searchTerm, setSearchTerm] = useState("");

  // Sort products variables
  const [sort, setSort] = useState("Random");

  useEffect(() => {
    const fetchAllProducts = async () => {
      setStatus(STATUS.LOADING);
      try {
        const res = await axios.get(
          `${server}/product/all/?page=${currentPage}&limit=${productLimit}`
        );
        setAllProducts(res.data.products);
        setTotalProducts(res.data.totalProducts);
        setLastPage(res.data.lastPage);
        setStartingProductIndex(res.data.startingProductIndex);
        setEndProductIndex(res.data.endProductIndex);
        console.log(res.data.products);
        setStatus(STATUS.SUCCESS);
      } catch (err) {
        console.log(err);
        setStatus(STATUS.FAILURE);
      }
    };
    fetchAllProducts();
  }, []);

  useEffect(() => {
    const fetchAllProducts = async () => {
      setStatus(STATUS.LOADING);
      try {
        const res = await axios.get(
          `${server}/product/all/?page=${currentPage}&limit=${productLimit}&search=${searchTerm}&sort=${sort}`
        );
        setAllProducts(res.data.products);
        setTotalProducts(res.data.totalProducts);
        setLastPage(res.data.lastPage);
        setStartingProductIndex(res.data.startingProductIndex);
        setEndProductIndex(res.data.endProductIndex);
        console.log(res.data.products);
        setStatus(STATUS.SUCCESS);
      } catch (err) {
        console.log(err);
        setStatus(STATUS.FAILURE);
      }
    };
    fetchAllProducts();
  }, [currentPage]);

  useEffect(() => {
    const fetchAllProducts = async () => {
      console.log("search term changed");
      console.log(searchTerm);

      setStatus(STATUS.LOADING);
      setCurrentPage(1);
      try {
        console.log("request sent");

        const req = `${server}/product/all/?page=${1}&limit=${productLimit}&search=${searchTerm}&sort=${sort}`;
        console.log(req);
        const res = await axios.get(req);
        setAllProducts(res.data.products);
        setTotalProducts(res.data.totalProducts);
        setLastPage(res.data.lastPage);
        setStartingProductIndex(res.data.startingProductIndex);
        setEndProductIndex(res.data.endProductIndex);
        console.log(res.data.products);
        setStatus(STATUS.SUCCESS);
      } catch (err) {
        console.log(err);
        setStatus(STATUS.FAILURE);
      }
    };
    fetchAllProducts();
  }, [searchTerm, sort]);

  const handlePrevPage = () => {
    if (currentPage === 1) {
      return;
    }
    setCurrentPage(currentPage - 1);
  };

  const handleNextPage = () => {
    if (currentPage === lastPage) {
      return;
    }
    setCurrentPage(currentPage + 1);
  };

  return (
    <>
      <Header
        activeHeading={3}
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
      />
      {/* mobile filter */}
      <MobileFilter
        mobileFiltersOpen={mobileFiltersOpen}
        setMobileFiltersOpen={setMobileFiltersOpen}
      />
      <div className="bg-white">
        <div className={`${styles.section}`}>
          {/* Page header */}
          <FilterHeader
            setMobileFiltersOpen={setMobileFiltersOpen}
            setSort={setSort}
            sort={sort}
          />
          <div className="w-full grid grid-cols-12 items-start">
            <div className="hidden lg:block lg:col-span-2 w-full ">
              <Sidebar />
            </div>
            {/* Product grid */}
            <div className="p-3 col-span-12 lg:col-span-10 w-full  gap-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
              {allProducts &&
                status === STATUS.SUCCESS &&
                allProducts.map((i, index) => (
                  <ProductCard product={i} key={index} />
                ))}
              {/* pagination */}
              <div className="flex items-center justify-between border-t border-gray-200 bg-white px-4 py-3 sm:px-6 sm:col-span-2 md:col-span-3 lg:col-span-4 xl:col-span-5">
                <div className="flex flex-1 justify-between sm:hidden">
                  <a
                    href="#"
                    className="relative inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
                  >
                    Previous
                  </a>
                  <a
                    href="#"
                    className="relative ml-3 inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
                  >
                    Next
                  </a>
                </div>
                <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
                  <div>
                    <p className="text-sm text-gray-700">
                      Showing{" "}
                      <span className="font-medium">
                        {startingProductIndex}
                      </span>{" "}
                      to <span className="font-medium">{endProductIndex}</span>{" "}
                      of <span className="font-medium">{totalProducts}</span>{" "}
                      results
                    </p>
                  </div>
                  <div>
                    <nav
                      className="isolate inline-flex -space-x-px rounded-md shadow-sm"
                      aria-label="Pagination"
                    >
                      <button
                        onClick={() => {
                          handlePrevPage();
                        }}
                        href="#"
                        className="relative inline-flex items-center rounded-l-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0"
                      >
                        <span className="sr-only">Previous</span>
                        <ChevronLeftIcon
                          className="h-5 w-5"
                          aria-hidden="true"
                        />
                      </button>
                      {/* render pagination numbers for all the pages dinamically */}
                      {Array.from({ length: lastPage }, (_, i) => (
                        <button
                          onClick={() => {
                            setCurrentPage(i + 1);
                          }}
                          className={
                            currentPage === i + 1
                              ? "relative z-10 inline-flex items-center bg-indigo-600 px-4 py-2 text-sm font-semibold text-white focus:z-20 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                              : "relative inline-flex items-center px-4 py-2 text-sm font-semibold text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0"
                          }
                          key={i}
                        >
                          {i + 1}
                        </button>
                      ))}
                      <button
                        onClick={() => {
                          handleNextPage();
                        }}
                        href="#"
                        className="relative inline-flex items-center rounded-r-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0"
                      >
                        <span className="sr-only">Previous</span>
                        <ChevronRightIcon
                          className="h-5 w-5"
                          aria-hidden="true"
                        />
                      </button>
                    </nav>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}
