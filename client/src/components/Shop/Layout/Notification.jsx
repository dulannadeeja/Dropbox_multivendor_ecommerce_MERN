import React, { useState } from "react";
import { Link } from "react-router-dom";

const NotificationDropdown = () => {
  return (
    <div className="absolute top-0 right-0 mt-12 w-56 bg-white rounded-md overflow-hidden shadow-xl z-50">
      {/* notification item*/}
      <Link to="/dashboard-messages">
        <div className="flex items-center px-4 py-3 hover:bg-gray-100 -mx-2">
          <div className="mx-3">
            <span className="font-semibold text-gray-900">12 new messages</span>
            <p className="text-sm text-gray-600 ">2 min ago</p>
          </div>
        </div>
      </Link>
    </div>
  );
};

export default NotificationDropdown;
