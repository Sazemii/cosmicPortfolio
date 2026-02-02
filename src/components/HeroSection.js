"use client";
import { motion } from "framer-motion";

export default function HeroSection() {
  return (
    <section className="hero-section">
      {/* Gradient background */}
      <div className="hero-bg" />

      {/* Main text */}
      <div className="hero-inner">
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
    </section>
  );
}
