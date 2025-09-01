"use client";
import { useState, useRef, useEffect } from "react";
import { motion, useAnimationControls } from "framer-motion";
import Image from "next/image";
import StarField from "../components/StarField";
import SettingsPanel from "../components/SettingsPanel";
import Navigation from "../components/Navigation";
import IntroSection from "../components/IntroSection";
import AboutSection from "../components/AboutSection";
import ProjectsSection from "../components/ProjectsSection";
import TechStackSection from "../components/TechStackSection";
import GradientBackground from "../components/GradientBackground";
import { Settings } from "lucide-react";

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
      <StarField motionEnabled={motionEnabled} />

      {/* Settings Button */}
      <motion.button
        onClick={toggleSettings}
        className="settings-button fixed top-4 right-4 z-50 bg-[#323232] hover:bg-[#404040] text-white p-3 rounded-full transition-all duration-300 shadow-lg"
        animate={{ rotate: isSettingsOpen ? 180 : 0 }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
      >
        <Settings size={30} />
      </motion.button>

      {/* Settings Panel */}
      <SettingsPanel
        isSettingsOpen={isSettingsOpen}
        decorationsEnabled={decorationsEnabled}
        motionEnabled={motionEnabled}
        toggleSettings={toggleSettings}
        handleDecorationsToggle={handleDecorationsToggle}
        handleMotionToggle={handleMotionToggle}
      />

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

      {/* Gradient Background */}
      <GradientBackground
        decorationsEnabled={decorationsEnabled}
        motionEnabled={motionEnabled}
      />

      {/* Navigation */}
      <Navigation
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        indicatorStyle={indicatorStyle}
        navRefs={navRefs}
      />
      <div className="mainBody flex flex-col gap-[2rem] justify-center items-center">
        {/* Introduction Section */}
        <IntroSection
          decorationsEnabled={decorationsEnabled}
          motionEnabled={motionEnabled}
          topStarControls={topStarControls}
          bottomStarControls={bottomStarControls}
          setIsTopHovering={setIsTopHovering}
          setIsBottomHovering={setIsBottomHovering}
          currentText={currentText}
        />
        {/* About Section */}
        <AboutSection />
        {/* Projects Section */}
        <ProjectsSection
          projects={projects}
          activePage={activePage}
          handlePageClick={handlePageClick}
          handlePreviousPage={handlePreviousPage}
          handleNextPage={handleNextPage}
        />
        {/* Tech Stack Section */}
        <TechStackSection />
      </div>
    </main>
  );
}
