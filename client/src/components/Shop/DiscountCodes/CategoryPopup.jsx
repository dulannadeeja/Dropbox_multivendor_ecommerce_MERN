import React, { useEffect, useState } from "react";
import { useCreateEventContext } from "../../../contexts/CreateEventContext";

const CategoryPopup = ({ onClose }) => {
  const { setSelectedCategories, selectedCategories, allCategories } =
    useCreateEventContext();

  const handleCategorySelect = (category) => {
    // Check if the category is not already selected
    if (!selectedCategories.includes(category)) {
      setSelectedCategories([...selectedCategories, category]);
    }
  };

  const handleRemoveCategory = (category) => {
    setSelectedCategories((prevCategories) =>
      prevCategories.filter((c) => c !== category)
    );
  };

  return (
    <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center bg-gray-800 bg-opacity-50 z-50">
      <div className="bg-white p-6 rounded shadow-md">
        <h2 className="text-2xl font-bold mb-4">Select Category</h2>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">
            Categories
          </label>
          <select
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            onChange={(e) => handleCategorySelect(e.target.value)}
          >
            <option value="" disabled>
              Select a category
            </option>
            {allCategories.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
        </div>
        {selectedCategories.length > 0 && (
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">
              Selected Categories
            </label>
            <ul className="mt-1">
              {selectedCategories.map((category) => (
                <li key={category} className="flex items-center">
                  <span className="mr-2">{category}</span>
                  <button
                    onClick={() => handleRemoveCategory(category)}
                    className="text-red-500"
                  >
                    Remove
                  </button>
                </li>
              ))}
            </ul>
          </div>
        )}
        <div className="flex justify-end">
          <button
            onClick={() => {
              onClose();
            }}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 focus:outline-none focus:ring focus:border-blue-300"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default CategoryPopup;
