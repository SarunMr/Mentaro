import React, { useState } from "react";
import { Link } from 'react-router-dom';
import { FaShoppingCart, FaBell } from "react-icons/fa";
import { MdLogout } from "react-icons/md";
import { HiOutlineUserCircle } from "react-icons/hi";
import mentaroLogo from "./../assets/images/mentarologo.png";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"


const Navbar = () => {

  return (
    <nav className="bg-white border-b border-gray-200 px-4 py-2 flex items-center justify-between">
      {/* Logo and Brand */}
      <div className="flex items-center">
          <img src={mentaroLogo} alt="Mentaro Logo" className="h-10" />
      </div>

      {/* Search Bar */}
      <div className="flex-1 mx-8">
        <input
          type="text"
          placeholder="Search for course"
          className="w-full px-4 py-2 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
      </div>

      {/* Navigation & User */}
      <div className="flex items-center space-x-4">
        <button className="text-gray-700 hover:text-blue-600 font-medium">
          Become Instructor
        </button>
        <FaShoppingCart className="text-xl text-gray-600 hover:text-blue-600 cursor-pointer" />
        <FaBell className="text-xl text-gray-600 hover:text-blue-600 cursor-pointer" />
      </div>
<DropdownMenu>
  <DropdownMenuTrigger>Open</DropdownMenuTrigger>
  <DropdownMenuContent>
    <DropdownMenuLabel>My Account</DropdownMenuLabel>
    <DropdownMenuSeparator />
    <DropdownMenuItem>Profile</DropdownMenuItem>
    <DropdownMenuItem>Billing</DropdownMenuItem>
    <DropdownMenuItem>Team</DropdownMenuItem>
    <DropdownMenuItem>Subscription</DropdownMenuItem>
  </DropdownMenuContent>
</DropdownMenu>
    </nav>
  );
};

export default Navbar;
