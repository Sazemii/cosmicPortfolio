"use client";
import { motion } from "framer-motion";
import { Settings, X } from "lucide-react";

export default function SettingsPanel({
  isSettingsOpen,
  decorationsEnabled,
  motionEnabled,
  toggleSettings,
  handleDecorationsToggle,
  handleMotionToggle,
}) {
  if (!isSettingsOpen) return null;

  return (
    <>
      {/* Blur Overlay */}
      <motion.div
        style={{ backgroundColor: 'rgba(0, 0, 0, 0.05)' }}
        className="fixed inset-0 backdrop-blur-sm z-40"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={toggleSettings}
      />

      {/* Settings Panel */}
      <motion.div
        className="settings-panel fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50 bg-[#1a1a1a]/95 border border-[#333] rounded-lg p-8 shadow-2xl min-w-[300px]"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
      >
        {/* Close Button */}
        <button
          onClick={toggleSettings}
          className="close-button absolute top-4 right-4 bg-[#323232] hover:bg-[#404040] text-white p-2 rounded-full transition-all duration-300"
        >
          <X size={16} />
        </button>

        {/* Header */}
        <div className="flex items-center gap-3 mb-8">
          <Settings size={24} className="text-white" />
          <h2 className="text-xl font-semibold text-white">Settings</h2>
        </div>

        {/* Settings Options */}
        <div className="space-y-6 mb-8 pr-8">
          {/* Decorations Toggle */}
          <div className="flex items-center justify-between">
            <span className="text-white text-base font-medium">Decorations</span>
            <button
              onClick={handleDecorationsToggle}
              className={`toggle-switch ${decorationsEnabled ? "active" : ""}`}
            >
              <div className="toggle-slider"></div>
            </button>
          </div>

          {/* Motion Toggle */}
          <div className="flex items-center justify-between">
            <span className="text-white text-base font-medium">Motion</span>
            <button
              onClick={handleMotionToggle}
              className={`toggle-switch ${motionEnabled ? "active" : ""}`}
            >
              <div className="toggle-slider"></div>
            </button>
          </div>
        </div>


      </motion.div>
    </>
  );
}
