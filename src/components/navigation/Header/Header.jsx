"use client";

import React, { useState } from "react";
import { IoIosMenu, IoMdClose } from "react-icons/io";

const Header = () => {


  const [isNavOpen, setIsNavOpen] = useState(false);
  const toggleNav = () => {
    setIsNavOpen(!isNavOpen);
  };

  return (
    <header className="bg-gradient-to-r from-blue-400 to-blue-600 text-white py-2 px-2  flex justify-between items-center fixed top-0 left-0 w-full z-50 shadow-lg">
      <div className="text-sm font-bold sm:text-xl">
        JPEG Compressor.com
      </div>

      <div className="sm:hidden">
        <button onClick={() => { toggleNav(); }}  className="focus:outline-none">
          {isNavOpen ? <IoMdClose size={24} /> : <IoIosMenu size={24} />}
        </button>
      </div>

      <nav className="space-x-6 hidden sm:block">
        <button className="hover:text-blue-200 transition-colors duration-200">Image Converter</button>
        <button className="hover:text-blue-200 transition-colors duration-200">Home</button>
      </nav>

     
      
    </header>

    // <h1>Header</h1>
  );
};

export default Header;