"use client";
import { motion } from "framer-motion";

export default function HeroSection({ heroOverlayRef, isLoading }) {
  return (
    <section className="hero-section">
      {/* Gradient background */}
      <div className="hero-bg" />

      {/* Main text */}
      <div className="hero-inner">
        <div className="hero-text-wrapper">
          <span className="hero-text-shadow" aria-hidden="true">
            MOVING AIN'T BORING
          </span>
          <motion.h1
            className="hero-text"
            initial={{ filter: "blur(24px)", opacity: 0 }}
            animate={!isLoading ? { filter: "blur(0px)", opacity: 1 } : {}}
            transition={{
              duration: 1.4,
              ease: [0.22, 1, 0.36, 1],
              delay: 0.45,
            }}
          >
            MOVING AIN'T BORING
          </motion.h1>
        </div>
      </div>

      {/* Darkening overlay — controlled by scroll in page.js */}
      <div
        ref={heroOverlayRef}
        style={{
          position: "absolute",
          inset: 0,
          background: "#000",
          opacity: 0,
          zIndex: 2,
          pointerEvents: "none",
        }}
      />
    </section>
  );
}
