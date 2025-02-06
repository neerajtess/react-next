import React from 'react'
import { FaImage, FaBolt, FaPencilRuler, FaLightbulb, FaShieldAlt, FaHeart } from "react-icons/fa";

function About() {
    const features = [
        { icon: <FaImage size={40} />, title: "Perfect quality", description: "The best online image resizer to resize your images at the highest quality." },
        { icon: <FaBolt size={40} />, title: "Lightning Fast", description: "This cloud-hosted, highly scalable tool can resize your images within seconds!" },
        { icon: <FaPencilRuler size={40} />, title: "Easy To Use", description: "Simply upload your image and enter a target size. It's as easy as that!" },
        { icon: <FaLightbulb size={40} />, title: "Works Anywhere", description: "ImageResizer.com is browser-based (no software to install). It works on any platform (Windows, Linux, Mac)." },
        { icon: <FaShieldAlt size={40} />, title: "Privacy Guaranteed", description: "Your images are uploaded via a secure 256-bit encrypted SSL connection and deleted automatically within 6 hours." },
        { icon: <FaHeart size={40} />, title: "It's Free", description: "Since 2012 we have resized millions of images for free! There is no software to install, registrations, or watermarks." }
      ];

  return (
    <section className=" text-black py-16 px-4 h-screen ">
    <div className="max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-10 text-center">
      {features.map((feature, index) => (
        <div key={index} className="flex flex-col items-center space-y-4">
          <div className="text-zinc-900">{feature.icon}</div>
          <h3 className="text-lg font-semibold">{feature.title}</h3>
          <p className="text-zinc-500">{feature.description}</p>
        </div>
      ))}
    </div>
  </section>
  )
}

export default About