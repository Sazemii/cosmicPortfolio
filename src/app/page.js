"use client";
import { useState, useRef, useEffect } from "react";
import { motion, useAnimationControls } from "framer-motion";
import Image from "next/image";
import StarField from "../components/StarField";
import { createIcons, icons } from "lucide-react";

export default function Home() {
  const [activeTab, setActiveTab] = useState("home");
  const [indicatorStyle, setIndicatorStyle] = useState({});
  const [activePage, setActivePage] = useState(1);
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

  const projects = [
    {
      id: 1,
      name: "GAPP",
      description: "A game searcher app. This is my first ever project after escaping the tutorial hell and the simple projects such as to-do list, calculators, etc. It is built using vanilla JS where I learned DOM manipulation and fetching request from APIs.",
      image: "/projects/GAPP.svg",
      tools: [
        { name: "Javascript", icon: "/icons/js-icon.svg" },
        { name: "CSS", icon: "/icons/css-icon.svg" },
        { name: "HTML", icon: "/icons/html-icon.svg" }
      ]
    },
    {
      id: 2,
      name: "Fintech Mockup",
      description: "Made this to experiment with the visuals that ChartJS can bring. This is also my first react project, could be improved by adding excel exports options. Overall, just a simple project for data visualization.",
      image: "/projects/Fintech.svg",
      tools: [
        { name: "React", icon: "/icons/react-icon.svg" },
        { name: "CSS", icon: "/icons/css-icon.svg" }
      ]
    },
    {
      id: 3,
      name: "Panakbo",
      description: "Being a fan of sneakers, I made this purely for demonstration and aesthetics. First time I've incorporated some motion using vanilla css. Most importantly, I learned how to make projects responsive which is so time-consuming, but worth it.",
      image: "/projects/Panakbo.svg",
      tools: [
        { name: "NextJS", icon: "/icons/nextjs-icon.svg" },
        { name: "React", icon: "/icons/react-icon.svg" },
        { name: "CSS", icon: "/icons/css-icon.svg" }
      ]
    },
    {
      id: 4,
      name: "TalaCheck",
      description: "A school project proposal about fake news. Used OCR technology then interpret the data obtained using NLP word comparison and Hugging Face AI verdict. Also had fun making the pop-ups and scroll-based animations.",
      image: "/projects/TalaCheck.svg",
      tools: [
        { name: "NextJS", icon: "/icons/nextjs-icon.svg" },
        { name: "React", icon: "/icons/react-icon.svg" },
        { name: "CSS", icon: "/icons/css-icon.svg" },
        { name: "Tailwind", icon: "/icons/tailwind-icon.svg" }
      ]
    },
    {
      id: 5,
      name: "Color Haven",
      description: "I really like experimenting with color schemes. With this, I made an app that let you see whether the palette you chose is visually appealing by making realtime changes on the elements and SVGs in the site.",
      image: "/projects/ColorHaven.svg",
      tools: [
        { name: "NextJS", icon: "/icons/nextjs-icon.svg" },
        { name: "React", icon: "/icons/react-icon.svg" },
        { name: "CSS", icon: "/icons/css-icon.svg" },
        { name: "Tailwind", icon: "/icons/tailwind-icon.svg" }
      ]
    }
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
      <StarField />

      <div className="gradient-circles-container">
        <motion.div
          className="gradient-circle violet-circle"
          initial={{ opacity: 0, scale: 0.8, x: 0, y: 0 }}
          animate={{
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
          }}
          transition={{
            duration: 8,
            ease: "easeInOut",
            repeat: Infinity,
            delay: 0.2,
          }}
          whileHover={{
            scale: 1.4,
            opacity: 0.8,
            transition: { duration: 0.4 },
          }}
        />

        <motion.div
          className="gradient-circle blue-circle"
          initial={{ opacity: 0, scale: 0.8, x: 0, y: 0 }}
          animate={{
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
          }}
          transition={{
            duration: 10,
            ease: "easeInOut",
            repeat: Infinity,
            delay: 0.8,
          }}
          whileHover={{
            scale: 1.5,
            opacity: 0.9,
            transition: { duration: 0.4 },
          }}
        />

        <motion.div
          className="gradient-circle pink-circle"
          initial={{ opacity: 0, scale: 0.8, x: 0, y: 0 }}
          animate={{
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
          }}
          transition={{
            duration: 7,
            ease: "easeInOut",
            repeat: Infinity,
            delay: 1.5,
          }}
          whileHover={{
            scale: 1.6,
            opacity: 0.8,
            transition: { duration: 0.4 },
          }}
        />
      </div>

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
              {currentText}
              <motion.span
                animate={{ opacity: [1, 0] }}
                transition={{
                  duration: 0.8,
                  repeat: Infinity,
                  repeatType: "reverse",
                }}
              >
                |
              </motion.span>
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
          <motion.div 
            className="project-container flex flex-col"
            key={activePage}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
          >
            <div className="project-title">{currentProject.name}</div>
            <div className="project-description   ">{currentProject.description}</div>
            <div className="project-photo">
              <Image
                src={currentProject.image}
                alt={currentProject.name}
                width={800}
                height={100}
                className="project-img"
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
                className={`pagination-icon ${activePage === 1 ? 'disabled' : ''}`}
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
                  className={`page-number ${activePage === index + 1 ? 'active' : ''}`}
                  onClick={() => handlePageClick(index + 1)}
                >
                  {index + 1}
                </span>
              ))}

              <div 
                className={`pagination-icon ${activePage === projects.length ? 'disabled' : ''}`}
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
          </motion.div>
        </div>
      </div>
    </main>
  );
}
