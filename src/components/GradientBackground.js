"use client";
import { motion } from "framer-motion";

export default function GradientBackground({ decorationsEnabled, motionEnabled }) {
  if (!decorationsEnabled) return null;

  return (
    <div className="gradient-circles-container">
      <motion.div
        className="gradient-circle violet-circle"
        initial={{ opacity: 0, scale: 0.8, x: 0, y: 0 }}
        animate={
          motionEnabled
            ? {
                opacity: [0.3, 0.6, 0.4, 0.7, 0.3],
                scale: [1, 1.3, 0.9, 1.2, 1],
                x: [0, 40, -20, 30, 0],
                y: [0, 25, 40, -15, 0],
                borderRadius: [
                  "74% 26% 47% 53% / 68% 46% 54% 32%",
                  "26% 74% 33% 67% / 54% 68% 32% 46%",
                  "67% 33% 74% 26% / 32% 54% 46% 68%",
                  "33% 67% 26% 74% / 46% 32% 68% 54%",
                  "74% 26% 47% 53% / 68% 46% 54% 32%",
                ],
                rotate: [0, 45, -30, 60, 0],
              }
            : { opacity: 0.4 }
        }
        transition={
          motionEnabled
            ? {
                duration: 8,
                ease: "easeInOut",
                repeat: Infinity,
                delay: 0.2,
              }
            : { duration: 0 }
        }
        whileHover={
          motionEnabled
            ? {
                scale: 1.4,
                opacity: 0.8,
                transition: { duration: 0.4 },
              }
            : {}
        }
      />

      <motion.div
        className="gradient-circle blue-circle"
        initial={{ opacity: 0, scale: 0.8, x: 0, y: 0 }}
        animate={
          motionEnabled
            ? {
                opacity: [0.4, 0.3, 0.7, 0.5, 0.4],
                scale: [1, 0.8, 1.4, 1.1, 1],
                x: [0, -35, 25, -10, 0],
                y: [0, 35, -20, 30, 0],
                borderRadius: [
                  "63% 37% 54% 46% / 55% 48% 52% 45%",
                  "37% 63% 46% 54% / 48% 55% 45% 52%",
                  "54% 46% 63% 37% / 52% 45% 55% 48%",
                  "46% 54% 37% 63% / 45% 52% 48% 55%",
                  "63% 37% 54% 46% / 55% 48% 52% 45%",
                ],
                rotate: [0, -60, 90, -45, 0],
              }
            : { opacity: 0.3 }
        }
        transition={
          motionEnabled
            ? {
                duration: 10,
                ease: "easeInOut",
                repeat: Infinity,
                delay: 0.8,
              }
            : { duration: 0 }
        }
        whileHover={
          motionEnabled
            ? {
                scale: 1.5,
                opacity: 0.9,
                transition: { duration: 0.4 },
              }
            : {}
        }
      />

      <motion.div
        className="gradient-circle pink-circle"
        initial={{ opacity: 0, scale: 0.8, x: 0, y: 0 }}
        animate={
          motionEnabled
            ? {
                opacity: [0.5, 0.7, 0.3, 0.6, 0.5],
                scale: [1, 1.2, 1.5, 0.9, 1],
                x: [0, 20, -30, 15, 0],
                y: [0, -25, 20, -35, 0],
                borderRadius: [
                  "81% 19% 33% 67% / 72% 44% 56% 28%",
                  "19% 81% 67% 33% / 44% 72% 28% 56%",
                  "33% 67% 81% 19% / 56% 28% 72% 44%",
                  "67% 33% 19% 81% / 28% 56% 44% 72%",
                  "81% 19% 33% 67% / 72% 44% 56% 28%",
                ],
                rotate: [0, 120, -90, 75, 0],
              }
            : { opacity: 0.5 }
        }
        transition={
          motionEnabled
            ? {
                duration: 7,
                ease: "easeInOut",
                repeat: Infinity,
                delay: 1.5,
              }
            : { duration: 0 }
        }
        whileHover={
          motionEnabled
            ? {
                scale: 1.6,
                opacity: 0.8,
                transition: { duration: 0.4 },
              }
            : {}
        }
      />
    </div>
  );
}
