"use client";

import React from "react";
import Link from "next/link";
import { SiConvertio } from "react-icons/si";
import { IoInvertModeOutline } from "react-icons/io5";
import { RxCross2 } from "react-icons/rx";
import { MdOutlineInvertColors, MdRotate90DegreesCw } from "react-icons/md";
import { IoMdResize } from "react-icons/io";
import { LuCrop, LuMenu } from "react-icons/lu";
import { PiFlipHorizontalFill } from "react-icons/pi";

const Sidebar = ({ isCollapsed, setIsCollapsed }) => {  

  const menuItems = [
    { icon: <LuCrop />, label: "Image Crop", link: "/" },
    { icon: <IoMdResize />, label: "Image Resize", link: "/resizer" },
    { icon: <MdRotate90DegreesCw />, label: "Image Rotate", link: "/rotate" },
    { icon: <PiFlipHorizontalFill />, label: "Image Flip", link: "/flip" },
    { icon: <SiConvertio />, label: "passport Size", link: "/passport" },
    // { icon: <IoInvertModeOutline />, label: "blackNwhite", link: "/blackNwhite" },
    { icon: <IoInvertModeOutline />, label: "BlackWhite", link: "/BlackWhite" },
    { icon: <MdOutlineInvertColors />, label: "invert", link: "/invert" },
    // { icon: <MdOutlineInvertColors />, label: "Watermark", link: "/watermark" },
  ];

  return (
    <aside
      className={`bg-gray-800 px-4 py-2 text-white fixed top-10 left-0 h-screen transition-all duration-300 ${
        isCollapsed ? "w-16" : "w-48"
      }`}
    >
      {/* Collapse Button */}
      <button
        onClick={() => setIsCollapsed(!isCollapsed)}
        className="flex items-center justify-end my-2 p-1 mb-6 w-full"
        aria-label={isCollapsed ? "Expand Sidebar" : "Collapse Sidebar"}
      >
        {isCollapsed ? <LuMenu size={20} /> : <RxCross2 size={20} />}
      </button>

      {/* Menu Items */}
      <nav>
        {menuItems.map((item, index) => (
          <a href={item.link} key={index} className="block">
            <div className="flex items-center text-sm hover:bg-zinc-100 hover:text-black rounded p-2 my-3 cursor-pointer hover:scale-105 transition-transform select-none active:scale-7">
              <span className="mr-3">{item.icon}</span>
              {!isCollapsed && <span>{item.label}</span>}
            </div>
          </a>
        ))}
      </nav>
    </aside>
  );
};

export default Sidebar;
