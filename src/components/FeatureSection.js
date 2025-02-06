"use client";

import { useState } from 'react'
import Sidebar from '../components/navigation/Sidebar/Sidebar';
import Header from '../components/navigation/Header/Header';
import MainApp from "../components/mainApp/MainApp";
import About from "./about/About"

import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

// import Ads from "../image-items/advertisement/Ads";

function FeatureSection() {
  const [isCollapsed, setIsCollapsed] = useState(false); // State for sidebar collapse
  

  return (

    <div className="min-h-screen bg-zinc-100">
      {/* Header */}
      <Header />

      <div className="flex pt-12">
        {/* Sidebar */}
        <Sidebar
          isCollapsed={isCollapsed}
          setIsCollapsed={setIsCollapsed}
        />

        {/* Main Content */}
        <main
          className={`flex-1 transition-all duration-300 h-screen ${isCollapsed ? "ml-16 w-[calc(100%-4rem)]" : "ml-48 w-[calc(100%-12rem)]"
            }`}
        >

          <Router>


            <Routes>
              <Route path="/" element={<MainApp url={"croper"} />} />
              <Route path="/resizer" element={<MainApp url={"resizer"} />} />
              <Route path="/rotate" element={<MainApp url={"rotate"} />} />
              <Route path="/passport" element={<MainApp url={"passport"} />} />
              <Route path="/watermark" element={<MainApp url={"watermark"} />} />
              <Route path="/invert" element={<MainApp url={"invert"} />} />
              <Route path="/flip" element={<MainApp url={"flip"} />} />
              <Route path="/BlackWhite" element={<MainApp url={"BlackWhite"} />} />
             

            </Routes>

          </Router>
        </main>
      </div>

      <div className={`flex-1 transition-all duration-300 h-screen ${isCollapsed ? "ml-16 w-[calc(100%-4rem)]" : "ml-48 w-[calc(100%-12rem)]"
        }`}>

        <About />
      </div>
    </div>

  );
}

export default FeatureSection;