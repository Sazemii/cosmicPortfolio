"use client";
import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";

const TAB_ORDER = ["home", "about", "contact"];

export default function PageTransition({ activeTab, children }) {
  const [displayedTab, setDisplayedTab] = useState(activeTab);
  const [phase, setPhase] = useState("idle"); // "idle" | "enter" | "exit"
  const [direction, setDirection] = useState(1);
  const pendingTab = useRef(activeTab);

  useEffect(() => {
    if (activeTab === displayedTab && phase === "idle") return;
    if (phase !== "idle") {
      // Already transitioning, store the latest target
      pendingTab.current = activeTab;
      return;
    }

    pendingTab.current = activeTab;
    const oldIndex = TAB_ORDER.indexOf(displayedTab);
    const newIndex = TAB_ORDER.indexOf(activeTab);
    setDirection(newIndex > oldIndex ? 1 : -1);
    setPhase("enter");
  }, [activeTab]);

  const handleAnimationComplete = () => {
    if (phase === "enter") {
      // Curtain fully covers screen — swap content, then exit
      setDisplayedTab(pendingTab.current);
      setPhase("exit");
    } else if (phase === "exit") {
      setPhase("idle");
    }
  };

  const curtainEase = [0.76, 0, 0.24, 1];

  const getAnimProps = () => {
    if (phase === "enter") {
      return {
        initial: { x: direction === 1 ? "-100%" : "100%" },
        animate: { x: "0%" },
        transition: { duration: 0.6, ease: curtainEase },
      };
    }
    if (phase === "exit") {
      return {
        initial: { x: "0%" },
        animate: { x: direction === 1 ? "100%" : "-100%" },
        transition: { duration: 0.6, ease: curtainEase },
      };
    }
    return {};
  };

  const animProps = getAnimProps();

  return (
    <>
      {children(displayedTab)}

      {phase !== "idle" && (
        <motion.div
          key={`${phase}-${pendingTab.current}`}
          className="fixed inset-0 z-40 pointer-events-none"
          style={{ backgroundColor: "#d3d3d3" }}
          {...animProps}
          onAnimationComplete={handleAnimationComplete}
        />
      )}
    </>
  );
}
