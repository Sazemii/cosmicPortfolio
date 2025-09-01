"use client";
import { motion } from "framer-motion";

export default function Navigation({
  activeTab,
  setActiveTab,
  indicatorStyle,
  navRefs,
}) {
  return (
    <div className="Header flex justify-center lg:gap-[4rem] md:gap-[2rem] gap-[1rem] relative">
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
  );
}
