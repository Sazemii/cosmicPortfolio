"use client";
import { useState, useRef, useEffect } from "react";
import { motion, useAnimationControls } from "framer-motion";
import Image from "next/image";
import StarField from "../components/StarField";
import { Settings, X } from "lucide-react";

export default function Home() {
  const [activeTab, setActiveTab] = useState("home");
  const [indicatorStyle, setIndicatorStyle] = useState({});
  const [activePage, setActivePage] = useState(1);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [decorationsEnabled, setDecorationsEnabled] = useState(true);
  const [motionEnabled, setMotionEnabled] = useState(true);
  const topStarControls = useAnimationControls();
  const bottomStarControls = useAnimationControls();
  const [isTopHovering, setIsTopHovering] = useState(false);
  const [isBottomHovering, setIsBottomHovering] = useState(false);
  const [currentText, setCurrentText] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [isErasing, setIsErasing] = useState(false);
  const [textIndex, setTextIndex] = useState(0);
  const [cycleComplete, setCycleComplete] = useState(false);
  const [initialAnimationComplete, setInitialAnimationComplete] =
    useState(false);

  const texts = ["UI designer", "frontend developer"];

  const projects = [
    {
      id: 1,
      name: "GAPP",
      description:
        "A game searcher app. This is my first ever project after escaping the tutorial hell and the simple projects such as to-do list, calculators, etc. It is built using vanilla JS where I learned DOM manipulation and fetching request from APIs.",
      image: "/projects/GAPP.svg",
      tools: [
        { name: "Javascript", icon: "/icons/js-icon.svg" },
        { name: "CSS", icon: "/icons/css-icon.svg" },
        { name: "HTML", icon: "/icons/html-icon.svg" },
      ],
    },
    {
      id: 2,
      name: "Fintech Mockup",
      description:
        "Made this to experiment with the visuals that ChartJS can bring. This is also my first react project, could be improved by adding excel exports options. Overall, just a simple project for data visualization.",
      image: "/projects/Fintech.svg",
      tools: [
        { name: "React", icon: "/icons/react-icon.svg" },
        { name: "CSS", icon: "/icons/css-icon.svg" },
      ],
    },
    {
      id: 3,
      name: "Panakbo",
      description:
        "Being a fan of sneakers, I made this purely for demonstration and aesthetics. First time I've incorporated some motion using vanilla css. Most importantly, I learned how to make projects responsive which is so time-consuming, but worth it.",
      image: "/projects/Panakbo.svg",
      tools: [
        { name: "NextJS", icon: "/icons/nextjs-icon.svg" },
        { name: "React", icon: "/icons/react-icon.svg" },
        { name: "CSS", icon: "/icons/css-icon.svg" },
      ],
    },
    {
      id: 4,
      name: "TalaCheck",
      description:
        "A school project proposal about fake news. Used OCR technology then interpret the data obtained using NLP word comparison and Hugging Face AI verdict. Also had fun making the pop-ups and scroll-based animations.",
      image: "/projects/TalaCheck.svg",
      tools: [
        { name: "NextJS", icon: "/icons/nextjs-icon.svg" },
        { name: "React", icon: "/icons/react-icon.svg" },
        { name: "CSS", icon: "/icons/css-icon.svg" },
        { name: "Tailwind", icon: "/icons/tailwind-icon.svg" },
      ],
    },
    {
      id: 5,
      name: "Color Haven",
      description:
        "I really like experimenting with color schemes. With this, I made an app that let you see whether the palette you chose is visually appealing by making realtime changes on the elements and SVGs in the site.",
      image: "/projects/ColorHaven.svg",
      tools: [
        { name: "NextJS", icon: "/icons/nextjs-icon.svg" },
        { name: "React", icon: "/icons/react-icon.svg" },
        { name: "CSS", icon: "/icons/css-icon.svg" },
        { name: "Tailwind", icon: "/icons/tailwind-icon.svg" },
      ],
    },
  ];

  const currentProject = projects[activePage - 1];
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
    if (cycleComplete || !motionEnabled) return;

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
  }, [
    currentText,
    isTyping,
    isErasing,
    textIndex,
    cycleComplete,
    motionEnabled,
  ]);

  // Set static text when motion is disabled
  useEffect(() => {
    if (!motionEnabled) {
      setCurrentText("UI designer");
      setIsTyping(false);
      setIsErasing(false);
      setCycleComplete(true);
    } else if (motionEnabled && cycleComplete) {
      // Reset animation when motion is re-enabled
      setCurrentText("");
      setTextIndex(0);
      setCycleComplete(false);
      setIsTyping(true);
    }
  }, [motionEnabled]);

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

  const handlePageClick = (pageNumber) => {
    if (pageNumber >= 1 && pageNumber <= projects.length) {
      setActivePage(pageNumber);
    }
  };

  const handlePreviousPage = () => {
    if (activePage > 1) {
      setActivePage(activePage - 1);
    }
  };

  const handleNextPage = () => {
    if (activePage < projects.length) {
      setActivePage(activePage + 1);
    }
  };

  // Settings functions
  const toggleSettings = () => {
    setIsSettingsOpen(!isSettingsOpen);
  };

  const handleDecorationsToggle = () => {
    const newValue = !decorationsEnabled;
    setDecorationsEnabled(newValue);
    localStorage.setItem("decorationsEnabled", JSON.stringify(newValue));
  };

  const handleMotionToggle = () => {
    const newValue = !motionEnabled;
    setMotionEnabled(newValue);
    localStorage.setItem("motionEnabled", JSON.stringify(newValue));
  };

  // Load settings from localStorage on mount
  useEffect(() => {
    const savedDecorations = localStorage.getItem("decorationsEnabled");
    const savedMotion = localStorage.getItem("motionEnabled");

    if (savedDecorations !== null) {
      setDecorationsEnabled(JSON.parse(savedDecorations));
    }
    if (savedMotion !== null) {
      setMotionEnabled(JSON.parse(savedMotion));
    }
  }, []);

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

  // Initial spin animation on first render
  useEffect(() => {
    if (!initialAnimationComplete && motionEnabled && decorationsEnabled) {
      const performInitialAnimation = async () => {
        // First spin the top star
        await topStarControls.start({
          rotate: [0, 360],
          transition: {
            duration: 1,
            ease: "easeInOut",
          },
        });

        // Then spin the bottom star
        await bottomStarControls.start({
          rotate: [0, 360],
          transition: {
            duration: 1,
            ease: "easeInOut",
          },
        });

        setInitialAnimationComplete(true);
      };

      performInitialAnimation();
    }
  }, [
    motionEnabled,
    decorationsEnabled,
    initialAnimationComplete,
    topStarControls,
    bottomStarControls,
  ]);

  return (
    <main className="">
      <StarField />

      {/* Settings Button */}
      <button
        onClick={toggleSettings}
        className="settings-button fixed top-4 left-4 z-50 bg-[#323232] hover:bg-[#404040] text-white p-3 rounded-full transition-all duration-300 shadow-lg"
      >
        <Settings size={20} />
      </button>

      {/* Settings Panel with Blur Background */}
      {isSettingsOpen && (
        <>
          {/* Blur Overlay */}
          <motion.div
            className="fixed inset-0 bg-black bg-opacity-30 backdrop-blur-sm z-40"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={toggleSettings}
          />

          {/* Settings Panel */}
          <motion.div
            className="settings-panel fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50 bg-[#1a1a1a] border border-[#333] rounded-lg p-6 shadow-2xl"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
          >
            {/* Header */}
            <div className="flex items-center gap-3 mb-6">
              <Settings size={24} className="text-white" />
              <h2 className="text-xl font-semibold text-white">Settings</h2>
            </div>

            {/* Settings Options */}
            <div className="space-y-4 mb-6">
              {/* Decorations Toggle */}
              <div className="flex items-center justify-between">
                <span className="text-white text-lg">Decorations</span>
                <button
                  onClick={handleDecorationsToggle}
                  className={`toggle-switch ${
                    decorationsEnabled ? "active" : ""
                  }`}
                >
                  <div className="toggle-slider"></div>
                </button>
              </div>

              {/* Motion Toggle */}
              <div className="flex items-center justify-between">
                <span className="text-white text-lg">Motion</span>
                <button
                  onClick={handleMotionToggle}
                  className={`toggle-switch ${motionEnabled ? "active" : ""}`}
                >
                  <div className="toggle-slider"></div>
                </button>
              </div>
            </div>

            {/* Close Button */}
            <button
              onClick={toggleSettings}
              className="close-button absolute bottom-4 right-4 bg-[#323232] hover:bg-[#404040] text-white p-2 rounded-full transition-all duration-300"
            >
              <X size={16} />
            </button>
          </motion.div>
        </>
      )}

      {/* Preload all project images for better performance */}
      <div style={{ display: "none" }}>
        {projects.map((project) => (
          <Image
            key={`preload-${project.id}`}
            src={project.image}
            alt=""
            width={800}
            height={450}
            priority={project.id <= 2}
          />
        ))}
      </div>

      {decorationsEnabled && (
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
      )}

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
      <div className="mainBody flex flex-col gap-[2rem] justify-center items-center">
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
        <div className="aboutBlock flex flex-col justify-center items-center">
          <span className="aboutTitle">About me</span>
          <span className="aboutDescription">
            A 19 year old bloke whose hobby is to create websites. Started with
            coding robots 3 years ago. Now focusing on using ReactJS and
            libraries.
          </span>
          <div className="aboutRow flex">
            <span className="more-btn flex">
              More about me{" "}
              <Image
                src="/searchIcon.svg"
                alt="searchIcon"
                width={20}
                height={20}
                className="searchIcon"
              />
            </span>
            <span className="contact-btn flex">
              Contact me
              <Image
                src="/arrowRight.svg"
                alt="arrowRight"
                width={20}
                height={20}
                className="arrowRight"
              />
            </span>
          </div>
        </div>
        <div className="projects flex flex-col flex-center items-center">
          <div className="project-header">My Projects</div>
          <div className="project-container flex flex-col">
            <div className="project-title">{currentProject.name}</div>
            <div className="project-description   ">
              {currentProject.description}
            </div>
            <div className="project-photo">
              <Image
                src={currentProject.image}
                alt={currentProject.name}
                width={1000}
                height={600}
                className="project-img"
                priority={true}
                sizes="(max-width: 900px) 100vw, (max-width: 1200px) 80vw, 70vw"
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                }}
              />
            </div>
            <div className="tech-used flex">
              {currentProject.tools.map((tool, index) => (
                <div key={index} className="tech-item flex">
                  <Image
                    src={tool.icon}
                    alt={tool.name}
                    width={20}
                    height={20}
                    className="s-icon"
                  />
                  <span className="tech-title">{tool.name}</span>
                </div>
              ))}
            </div>
            <div className="pagination flex justify-center items-center gap-[.3rem]">
              <div
                className={`pagination-icon ${
                  activePage === 1 ? "disabled" : ""
                }`}
                onClick={handlePreviousPage}
              >
                <Image
                  src="/icons/previouspage.svg"
                  alt="previous page"
                  width={25}
                  height={25}
                />
              </div>
              {projects.map((_, index) => (
                <span
                  key={index + 1}
                  className={`page-number ${
                    activePage === index + 1 ? "active" : ""
                  }`}
                  onClick={() => handlePageClick(index + 1)}
                >
                  {index + 1}
                </span>
              ))}

              <div
                className={`pagination-icon ${
                  activePage === projects.length ? "disabled" : ""
                }`}
                onClick={handleNextPage}
              >
                <Image
                  src="/icons/nextpage.svg"
                  alt="next page"
                  width={25}
                  height={25}
                />
              </div>
            </div>
          </div>
        </div>
        <div className="max-w-[70%] w-[70%]">
          <div className="text-stack flex algin-self">Tech Stack</div>
        </div>
      </div>
    </main>
  );
}
