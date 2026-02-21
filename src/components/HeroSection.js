"use client";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import Navigation from "./Navigation";

export default function HeroSection({
  activeTab,
  setActiveTab,
  indicatorStyle,
  navRefs,
}) {
  const [isNavVisible, setIsNavVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      if (currentScrollY < 10) {
        // Always show nav at the very top
        setIsNavVisible(true);
      } else if (currentScrollY > lastScrollY) {
        // Scrolling down - show nav
        setIsNavVisible(false);
      } else {
        // Scrolling up - hide nav
        setIsNavVisible(true);
      }

      setLastScrollY(currentScrollY);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastScrollY]);

  return (
    <section className="hero-section">
      {/* Gradient background */}
      <div className="hero-bg" />

      {/* Sticky Navigation */}
      <AnimatePresence>
        {isNavVisible && (
          <motion.div
            className="fixed top-0 left-0 right-0 z-50 flex justify-center pt-4"
            initial={{ y: -100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -100, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
          >
            <Navigation
              activeTab={activeTab}
              setActiveTab={setActiveTab}
              indicatorStyle={indicatorStyle}
              navRefs={navRefs}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main text */}
      <div className="hero-inner">
        <div className="hero-text-wrapper">
          <span className="hero-text-shadow" aria-hidden="true">
            MOVING AIN'T BORING
          </span>
          <motion.h1
            className="hero-text"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          >
            MOVING AIN'T
            <br />
            BORING
          </motion.h1>
        </div>
      </div>
    </section>
  );
}
