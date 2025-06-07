"use client";
import { useState, useRef, useEffect } from "react";
import { motion, useAnimationControls } from "framer-motion";
import Image from "next/image";

export default function Home() {
  const [activeTab, setActiveTab] = useState("home");
  const [indicatorStyle, setIndicatorStyle] = useState({});
  const topStarControls = useAnimationControls();
  const bottomStarControls = useAnimationControls();
  const [isTopHovering, setIsTopHovering] = useState(false);
  const [isBottomHovering, setIsBottomHovering] = useState(false);
  const [currentText, setCurrentText] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [isErasing, setIsErasing] = useState(false);
  const [textIndex, setTextIndex] = useState(0);
  const [cycleComplete, setCycleComplete] = useState(false);

  const texts = ["UI designer", "frontend developer"];

  const navRefs = {
    home: useRef(null),
    about: useRef(null),
    contact: useRef(null),
  };

  const topAnimationRef = useRef({
    isAnimating: false,
    cycleStartTime: 0,
    timerId: null,
    isHovering: false,
  });

  const bottomAnimationRef = useRef({
    isAnimating: false,
    cycleStartTime: 0,
    timerId: null,
    isHovering: false,
  });

  const updateIndicatorPosition = () => {
    if (navRefs[activeTab]?.current) {
      const element = navRefs[activeTab].current;
      setIndicatorStyle({
        width: element.offsetWidth,
        height: element.offsetHeight,
        left: element.offsetLeft,
        top: element.offsetTop,
      });
    }
  };

  useEffect(() => {
    if (cycleComplete) return;

    const currentFullText = texts[textIndex];

    if (isTyping) {
      if (currentText.length < currentFullText.length) {
        const timer = setTimeout(() => {
          setCurrentText(currentFullText.slice(0, currentText.length + 1));
        }, 80);
        return () => clearTimeout(timer);
      } else {
        if (textIndex === texts.length - 1) {
          setCycleComplete(true);
          return;
        }
        const timer = setTimeout(() => {
          setIsTyping(false);
          setIsErasing(true);
        }, 2000);
        return () => clearTimeout(timer);
      }
    } else if (isErasing) {
      if (currentText.length > 0) {
        const timer = setTimeout(() => {
          setCurrentText(currentText.slice(0, -1));
        }, 60);
        return () => clearTimeout(timer);
      } else {
        setTextIndex(textIndex + 1);
        setIsErasing(false);
        setIsTyping(true);
      }
    }
  }, [currentText, isTyping, isErasing, textIndex, cycleComplete]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsTyping(true);
    }, 500);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    updateIndicatorPosition();
    window.addEventListener("resize", updateIndicatorPosition);
    return () => {
      window.removeEventListener("resize", updateIndicatorPosition);
    };
  }, [activeTab]);

  const handleStarAnimation = (controls, animRef) => {
    if (!animRef.current.isAnimating) {
      animRef.current.isAnimating = true;

      controls
        .start({
          scale: [1, 1.3, 1.3, 1],
          rotate: [0, 0, 360, 360],
          transition: {
            duration: 1.5,
            times: [0, 0.15, 0.85, 1],
            ease: "easeInOut",
            repeat: 0,
          },
        })
        .then(() => {
          animRef.current.isAnimating = false;
          if (animRef.current.isHovering) {
            handleStarAnimation(controls, animRef);
          }
        });
    }
  };

  useEffect(() => {
    topAnimationRef.current.isHovering = isTopHovering;
    if (isTopHovering && !topAnimationRef.current.isAnimating) {
      handleStarAnimation(topStarControls, topAnimationRef);
    }
  }, [isTopHovering]);

  useEffect(() => {
    bottomAnimationRef.current.isHovering = isBottomHovering;
    if (isBottomHovering && !bottomAnimationRef.current.isAnimating) {
      handleStarAnimation(bottomStarControls, bottomAnimationRef);
    }
  }, [isBottomHovering]);

  return (
    <main className="">
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
      <div className="mainBody flex justify-center items-center">
        <div className="introduction flex justify-center relative">
          <motion.div
            className="top-star"
            animate={topStarControls}
            initial={{ scale: 1, rotate: 0 }}
            onHoverStart={() => setIsTopHovering(true)}
            onHoverEnd={() => setIsTopHovering(false)}
          >
            <Image
              src="/introStar.svg"
              alt="Decorative star"
              width={60}
              height={60}
              className="star-image"
            />
          </motion.div>

          <div className="introductionStatement text-center">
            Hi. I'm Carl. A <br />
            <span
              style={{
                display: "inline-block",
                minWidth: "200px",
                textAlign: "left",
              }}
            >
              {currentText}
              <motion.span
                animate={{ opacity: [1, 0] }}
                transition={{
                  duration: 0.8,
                  repeat: Infinity,
                  repeatType: "reverse",
                }}
                style={{ display: "inline-block" }}
              >
                |
              </motion.span>
            </span>
          </div>

          <motion.div
            className="bottom-star"
            animate={bottomStarControls}
            initial={{ scale: 1, rotate: 0 }}
            onHoverStart={() => setIsBottomHovering(true)}
            onHoverEnd={() => setIsBottomHovering(false)}
          >
            <Image
              src="/introStar.svg"
              alt="Decorative star"
              width={60}
              height={60}
              className="star-image"
            />
          </motion.div>
        </div>
      </div>
    </main>
  );
}
