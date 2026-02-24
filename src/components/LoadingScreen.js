"use client";
import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function LoadingScreen({ onComplete }) {
  const [count, setCount] = useState(0);
  const [phase, setPhase] = useState("counting"); // "counting" | "exiting"
  const rafRef = useRef(null);
  const startTimeRef = useRef(null);

  const DURATION = 2400; // ms for 0→100

  useEffect(() => {
    const tick = (timestamp) => {
      if (!startTimeRef.current) startTimeRef.current = timestamp;
      const elapsed = timestamp - startTimeRef.current;
      const progress = Math.min(elapsed / DURATION, 1);

      // Eased progress — fast start, slow near end
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(Math.floor(eased * 100));

      if (progress < 1) {
        rafRef.current = requestAnimationFrame(tick);
      } else {
        setCount(100);
        // Start exit phase immediately when counting is done
        setPhase("exiting");
      }
    };

    rafRef.current = requestAnimationFrame(tick);
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, []);

  // Notify parent as soon as we enter the exiting phase,
  // so the main content (e.g. hero text) can start animating immediately.
  useEffect(() => {
    if (phase === "exiting") {
      onComplete?.();
    }
  }, [phase, onComplete]);

  return (
    <AnimatePresence>
      {phase === "counting" && (
        <motion.div
          key="loader"
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 9999,
            display: "flex",
            flexDirection: "column",
            justifyContent: "flex-end",
            padding: "clamp(2rem, 5vw, 4rem)",
            background: "#0a0a0a",
            cursor: "wait",
            overflow: "hidden",
          }}
          exit={{
            clipPath: "inset(0 0 100% 0)",
          }}
          transition={{
            duration: 0.8,
            ease: [0.76, 0, 0.24, 1],
          }}
        >
          {/* Top label */}
          <motion.span
            style={{
              position: "absolute",
              top: "clamp(2rem, 5vw, 4rem)",
              left: "clamp(2rem, 5vw, 4rem)",
              fontFamily: "'Inter', 'Geist', Arial, sans-serif",
              fontSize: "clamp(0.7rem, 1.2vw, 0.85rem)",
              fontWeight: 400,
              color: "rgba(255,255,255,0.4)",
              letterSpacing: "0.15em",
              textTransform: "uppercase",
            }}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            Portfolio &mdash; 2025
          </motion.span>

          {/* Top-right name */}
          <motion.span
            style={{
              position: "absolute",
              top: "clamp(2rem, 5vw, 4rem)",
              right: "clamp(2rem, 5vw, 4rem)",
              fontFamily: "'Inter', 'Geist', Arial, sans-serif",
              fontSize: "clamp(0.7rem, 1.2vw, 0.85rem)",
              fontWeight: 400,
              color: "rgba(255,255,255,0.4)",
              letterSpacing: "0.15em",
              textTransform: "uppercase",
            }}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            Carl
          </motion.span>

          {/* Horizontal line — grows with progress */}
          <motion.div
            style={{
              position: "absolute",
              bottom: "calc(clamp(2rem, 5vw, 4rem) + 6rem)",
              left: "clamp(2rem, 5vw, 4rem)",
              right: "clamp(2rem, 5vw, 4rem)",
              height: "1px",
              background: "rgba(255,255,255,0.12)",
              transformOrigin: "left",
            }}
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: 2.4, ease: [0.22, 1, 0.36, 1] }}
          >
            {/* Progress fill */}
            <motion.div
              style={{
                position: "absolute",
                inset: 0,
                background: "rgba(255,255,255,0.6)",
                transformOrigin: "left",
              }}
              initial={{ scaleX: 0 }}
              animate={{ scaleX: count / 100 }}
              transition={{ duration: 0.1, ease: "linear" }}
            />
          </motion.div>

          {/* Counter */}
          <div
            style={{
              display: "flex",
              alignItems: "baseline",
              justifyContent: "space-between",
              width: "100%",
            }}
          >
            <motion.div
              style={{
                fontFamily: "var(--font-anton), 'Geist', Arial, sans-serif",
                fontSize: "clamp(4rem, 12vw, 9rem)",
                fontWeight: 400,
                fontStyle: "italic",
                color: "#fff",
                lineHeight: 1,
                letterSpacing: "-0.02em",
                overflow: "hidden",
              }}
              initial={{ opacity: 0, y: 60 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                duration: 0.7,
                ease: [0.22, 1, 0.36, 1],
              }}
            >
              {count}
            </motion.div>

            <motion.span
              style={{
                fontFamily: "'Inter', 'Geist', Arial, sans-serif",
                fontSize: "clamp(0.7rem, 1.2vw, 0.85rem)",
                fontWeight: 400,
                color: "rgba(255,255,255,0.35)",
                letterSpacing: "0.1em",
              }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              Loading
            </motion.span>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
