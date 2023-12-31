import React from "react";
import { Fragment, useState } from "react";
import { Dialog, Disclosure, Menu, Transition } from "@headlessui/react";
import { XMarkIcon } from "@heroicons/react/24/outline";
import styles from "../../styles/styles";
import {
  ChevronDownIcon,
  FunnelIcon,
  MinusIcon,
  PlusIcon,
  Squares2X2Icon,
} from "@heroicons/react/20/solid";
import SORT_OPTIONS from "../../constants/sortOptions";

// array of sort options by using SORT_OPTIONS constant
const sortOptions = [
  SORT_OPTIONS.BEST_SELLING,
  SORT_OPTIONS.PRICE_LOW_TO_HIGH,
  SORT_OPTIONS.PRICE_HIGH_TO_LOW,
  SORT_OPTIONS.NEW_ARRIVALS,
  SORT_OPTIONS.TOP_RATED,
];

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

const FilterHeader = ({ setMobileFiltersOpen, setSort, sort }) => {
  // const sortProducts = (products, sort) => {
  //   try {
  //     setSort(sort);

  //     console.log(sort);

  //     let sortedProducts = [];

  //     if (sort === "Price-low-to-high") {
  //       sortedProducts = products.sort(
  //         (a, b) => a.discountPrice - b.discountPrice
  //       );
  //     }
  //     if (sort === "Price-high-to-low") {
  //       sortedProducts = products.sort(
  //         (a, b) => b.discountPrice - a.discountPrice
  //       );
  //     }
  //     if (sort === "Best-rating") {
  //       sortedProducts = products.sort((a, b) => b.rating - a.rating);
  //     }
  //     if (sort === "Most-popular") {
  //       sortedProducts = products.sort((a, b) => b.sold_out - a.sold_out);
  //     }
  //     if (sort === "Newest") {
  //       sortedProducts = products.sort(
  //         (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
  //       );
  //     }

  //     setAllProducts([...sortedProducts]);
  //   } catch (err) {
  //     console.log(err);
  //   }
  // };

  return (
    <div className="flex justify-between py-4">
      {/* recommendations */}
      <div className="flex justify-start items-center gap-2">
        <span className="flex items-center">
          <button
            type="button"
            className="inline-flex items-center px-3 py-0.5 rounded-full text-sm font-medium bg-gray-100 text-gray-800"
          >
            All Products
          </button>
        </span>
        <span className="flex items-center">
          <button
            type="button"
            className="inline-flex items-center px-3 py-0.5 rounded-full text-sm font-medium bg-gray-100 text-gray-800"
          >
            Puma
          </button>
        </span>
        <span className="flex items-center">
          <button
            type="button"
            className="inline-flex items-center px-3 py-0.5 rounded-full text-sm font-medium bg-gray-100 text-gray-800"
          >
            Addidas
          </button>
        </span>
        <span className="flex items-center">
          <button
            type="button"
            className="inline-flex items-center px-3 py-0.5 rounded-full text-sm font-medium bg-gray-100 text-gray-800"
          >
            Reebok
          </button>
        </span>
        <span className="flex items-center">
          <button
            type="button"
            className="inline-flex items-center px-3 py-0.5 rounded-full text-sm font-medium bg-gray-100 text-gray-800"
          >
            Fila
          </button>
        </span>
      </div>
      <div className="flex items-center">
        <Menu as="div" className="relative inline-block text-left">
          <div>
            <Menu.Button className="group inline-flex justify-center text-sm font-medium text-gray-700 hover:text-gray-900">
              Sort
              <ChevronDownIcon
                className="-mr-1 ml-1 h-5 w-5 flex-shrink-0 text-gray-400 group-hover:text-gray-500"
                aria-hidden="true"
              />
            </Menu.Button>
          </div>

          <Transition
            as={Fragment}
            enter="transition ease-out duration-100"
            enterFrom="transform opacity-0 scale-95"
            enterTo="transform opacity-100 scale-100"
            leave="transition ease-in duration-75"
            leaveFrom="transform opacity-100 scale-100"
            leaveTo="transform opacity-0 scale-95"
          >
            <Menu.Items className="absolute right-0 z-10 mt-2 w-40 origin-top-right rounded-md bg-white shadow-2xl ring-1 ring-black ring-opacity-5 focus:outline-none">
              <div className="py-1">
                {sortOptions.map((option) => (
                  <Menu.Item key={option}>
                    {({ active }) => (
                      <button
                        className={classNames(
                          option === sort
                            ? "font-medium text-gray-900"
                            : "text-gray-500",
                          active ? "bg-gray-100" : "",
                          "block px-4 py-2 text-sm"
                        )}
                        onClick={() => {
                          setSort(option);
                        }}
                      >
                        {option}
                      </button>
                    )}
                  </Menu.Item>
                ))}
              </div>
            </Menu.Items>
          </Transition>
        </Menu>

        {/* Arrange listings buttons */}
        <button
          type="button"
          className="-m-2 ml-5 p-2 text-gray-400 hover:text-gray-500 sm:ml-7"
        >
          <span className="sr-only">View grid</span>
          <Squares2X2Icon className="h-5 w-5" aria-hidden="true" />
        </button>
        <button
          type="button"
          className="-m-2 ml-4 p-2 text-gray-400 hover:text-gray-500 sm:ml-6 lg:hidden"
          onClick={() => setMobileFiltersOpen(true)}
        >
          <span className="sr-only">Filters</span>
          <FunnelIcon className="h-5 w-5" aria-hidden="true" />
        </button>
      </div>
    </div>
  );
};

export default FilterHeader;
