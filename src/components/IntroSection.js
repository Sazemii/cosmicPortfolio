"use client";
import { motion } from "framer-motion";
import Image from "next/image";

export default function IntroSection({
  decorationsEnabled,
  motionEnabled,
  topStarControls,
  bottomStarControls,
  setIsTopHovering,
  setIsBottomHovering,
  currentText,
}) {
  return (
    <div className="introduction flex flex-col gap-[2rem] justify-center items-center">
      <div className="flex justify-center relative">
        {decorationsEnabled && (
          <motion.div
            className="top-star"
            animate={
              motionEnabled ? topStarControls : { scale: 1, rotate: 0 }
            }
            initial={{ scale: 1, rotate: 0 }}
            onHoverStart={() => motionEnabled && setIsTopHovering(true)}
            onHoverEnd={() => motionEnabled && setIsTopHovering(false)}
          >
            <Image
              src="/introStar.svg"
              alt="Decorative star"
              width={60}
              height={60}
              className="star-image"
            />
          </motion.div>
        )}

        <div className="introductionStatement text-center">
          Hi. I'm Carl. A <br />
          {currentText}
          <motion.span
            animate={motionEnabled ? { opacity: [1, 0] } : { opacity: 1 }}
            transition={
              motionEnabled
                ? {
                    duration: 0.8,
                    repeat: Infinity,
                    repeatType: "reverse",
                  }
                : { duration: 0 }
            }
          >
            |
          </motion.span>
        </div>

        {decorationsEnabled && (
          <motion.div
            className="bottom-star"
            animate={
              motionEnabled ? bottomStarControls : { scale: 1, rotate: 0 }
            }
            initial={{ scale: 1, rotate: 0 }}
            onHoverStart={() => motionEnabled && setIsBottomHovering(true)}
            onHoverEnd={() => motionEnabled && setIsBottomHovering(false)}
          >
            <Image
              src="/introStar.svg"
              alt="Decorative star"
              width={60}
              height={60}
              className="star-image"
            />
          </motion.div>
        )}
      </div>
      <span className="introDescription text-center">
        I'm passionate in creating modern web designs that improve user
        experience through aesthetics and motion
      </span>
    </div>
  );
}
