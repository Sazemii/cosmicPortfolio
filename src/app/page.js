"use client";
import { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
export default function Home() {
  const [activeTab, setActiveTab] = useState("home");
  const [indicatorStyle, setIndicatorStyle] = useState({});
  const navRefs = {
    home: useRef(null),
    about: useRef(null),
    contact: useRef(null),
  };

  useEffect(() => {
    if (navRefs[activeTab].current) {
      const element = navRefs[activeTab].current;
      setIndicatorStyle({
        width: element.offsetWidth,
        height: element.offsetHeight,
        left: element.offsetLeft,
        top: element.offsetTop,
      });
    }
  }, [activeTab]);

  return (
    <main className="">
      <div className="Header flex justify-center gap-[4rem] relative">
        {/* used framer motion here to move the navigation design, (springy like animation) */}
        <motion.div
          className="absolute bg-[#323232] rounded-[20px]"
          animate={indicatorStyle}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
        />

        <div
          ref={navRefs.home}
          className={`homeBar nav-item ${
            activeTab === "home" ? "text-white" : "text-gray-300"
          }`}
          onClick={() => setActiveTab("home")}
        >
          Home
        </div>
        <div
          ref={navRefs.about}
          className={`aboutBar nav-item ${
            activeTab === "about" ? "text-white" : "text-gray-300"
          }`}
          onClick={() => setActiveTab("about")}
        >
          About
        </div>
        <div
          ref={navRefs.contact}
          className={`contactBar nav-item  ${
            activeTab === "contact" ? "text-white" : "text-gray-300"
          }`}
          onClick={() => setActiveTab("contact")}
        >
          Contact
        </div>
      </div>
    </main>
  );
}
