import React from "react";
import ProductCard from "../Home/ProductCard";
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

const Sidebar = ({ allProducts, setAllProducts }) => {
  const handleFilterChange = ({ option, section }) => {
    console.log(option.value);
    console.log(section.id);

    // update the filters array by setting the checked property to the opposite of what it currently is
    const updatedFilters = filters.map((filter) => {
      if (filter.id === section.id) {
        return {
          ...filter,
          options: filter.options.map((item) => {
            if (item.value === option.value) {
              return { ...item, checked: !item.checked };
            }
            return item;
          }),
        };
      }
      return filter;
    });
    console.log(updatedFilters);
  };

  const subCategories = [
    { name: "Totes", href: "#" },
    { name: "Backpacks", href: "#" },
    { name: "Travel Bags", href: "#" },
    { name: "Hip Bags", href: "#" },
    { name: "Laptop Sleeves", href: "#" },
  ];
  const filters = [
    {
      id: "color",
      name: "Color",
      options: [
        { value: "white", label: "White", checked: false },
        { value: "beige", label: "Beige", checked: false },
        { value: "blue", label: "Blue", checked: false },
        { value: "brown", label: "Brown", checked: false },
        { value: "green", label: "Green", checked: false },
        { value: "purple", label: "Purple", checked: false },
        { value: "red", label: "Red", checked: false },
        { value: "yellow", label: "Yellow", checked: false },
        { value: "orange", label: "Orange", checked: false },
        { value: "pink", label: "Pink", checked: false },
        { value: "black", label: "Black", checked: false },
        { value: "grey", label: "Grey", checked: false },
        { value: "multi", label: "Multi", checked: false },
      ],
    },
    {
      id: "price",
      name: "Price range",
      options: [
        { value: "under-25", label: "Under $25", checked: false },
        { value: "25-50", label: "$25 to $50", checked: false },
        { value: "50-100", label: "$50 to $100", checked: false },
        { value: "100-200", label: "$100 to $200", checked: false },
        { value: "200-over", label: "$200 &amp; Over", checked: false },
      ],
    },
    {
      id: "size",
      name: "Size",
      options: [
        { value: "XS", label: "XS", checked: false },
        { value: "S", label: "S", checked: false },
        { value: "M", label: "M", checked: false },
        { value: "L", label: "L", checked: false },
        { value: "XL", label: "XL", checked: false },
        { value: "XXL", label: "XXL", checked: false },
      ],
    },
  ];

  return (
    <section aria-labelledby="products-heading" className="pb-24 pt-6">
      <div className="">
        {/* Filters */}
        <form className="hidden lg:block">
          <h3 className="sr-only">Categories</h3>
          <ul
            role="list"
            className="space-y-4 border-b border-gray-200 pb-6 text-sm font-medium text-gray-900"
          >
            {subCategories.map((category) => (
              <li key={category.name}>
                <a href={category.href}>{category.name}</a>
              </li>
            ))}
          </ul>

          {filters.map((section) => (
            <Disclosure
              as="div"
              key={section.id}
              className="border-b border-gray-200 py-6"
            >
              {({ open }) => (
                <>
                  <h3 className="-my-3 flow-root">
                    <Disclosure.Button className="flex w-full items-center justify-between bg-white py-3 text-sm text-gray-400 hover:text-gray-500">
                      <span className="font-medium text-gray-900">
                        {section.name}
                      </span>
                      <span className="ml-6 flex items-center">
                        {open ? (
                          <MinusIcon className="h-5 w-5" aria-hidden="true" />
                        ) : (
                          <PlusIcon className="h-5 w-5" aria-hidden="true" />
                        )}
                      </span>
                    </Disclosure.Button>
                  </h3>
                  <Disclosure.Panel className="pt-6">
                    <div className="space-y-4">
                      {section.options.map((option, optionIdx) => (
                        <div key={option.value} className="flex items-center">
                          <input
                            id={`filter-${section.id}-${optionIdx}`}
                            name={`${section.id}[]`}
                            defaultValue={option.value}
                            type="checkbox"
                            defaultChecked={option.checked}
                            className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                            onChange={(e) =>
                              handleFilterChange({ option, section })
                            }
                          />
                          <label
                            htmlFor={`filter-${section.id}-${optionIdx}`}
                            className="ml-3 text-sm text-gray-600"
                          >
                            {option.label}
                          </label>
                        </div>
                      ))}
                    </div>
                  </Disclosure.Panel>
                </>
              )}
            </Disclosure>
          ))}
        </form>
      </div>
    </section>
  );
};

export default Sidebar;
