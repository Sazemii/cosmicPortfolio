"use client";
import { useState, useRef, useEffect } from "react";
import {
  motion,
  useAnimationControls,
  useInView,
  AnimatePresence,
} from "framer-motion";
import Image from "next/image";
import StarField from "../components/StarField";
import SettingsPanel from "../components/SettingsPanel";
import HeroSection from "../components/HeroSection";
import Navigation from "../components/Navigation";
import IntroSection from "../components/IntroSection";
import GradientBackground from "../components/GradientBackground";
import PageTransition from "../components/PageTransition";
import AboutPage from "../components/AboutPage";
import ContactPage from "../components/ContactPage";
import LoadingScreen from "../components/LoadingScreen";

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
  const [isNavVisible, setIsNavVisible] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  const [showLoader, setShowLoader] = useState(true);

  const introRef = useRef(null);
  const heroOverlayRef = useRef(null);
  const introShadowRef = useRef(null);
  const lastScrollYRef = useRef(0);
  const previousTabRef = useRef(activeTab);
  const introInView = useInView(introRef, { amount: 0.8 });

  const texts = ["Fullstack Dev", "UI Designer"];

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

  // Reset typewriter when switching back to home tab
  useEffect(() => {
    if (activeTab === "home" && previousTabRef.current !== "home") {
      setCurrentText("");
      setIsTyping(false);
      setIsErasing(false);
      setTextIndex(0);
      setCycleComplete(false);
      // Start typing after a short delay when switching to home
      const timer = setTimeout(() => {
        setIsTyping(true);
      }, 800); // Delay to allow transition to complete
      previousTabRef.current = activeTab;
      return () => clearTimeout(timer);
    }
    previousTabRef.current = activeTab;
  }, [activeTab]);

  useEffect(() => {
    if (introInView && !isTyping && !cycleComplete && currentText === "") {
      const timer = setTimeout(() => {
        setIsTyping(true);
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [introInView, isTyping, cycleComplete, currentText]);

  useEffect(() => {
    updateIndicatorPosition();
    window.addEventListener("resize", updateIndicatorPosition);
    return () => {
      window.removeEventListener("resize", updateIndicatorPosition);
    };
  }, [activeTab]);

  // Scroll handler: nav visibility + hero fade + intro shadow
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      const vh = window.innerHeight;

      // --- Nav visibility ---
      if (currentScrollY < 10) {
        setIsNavVisible(true);
      } else if (currentScrollY > lastScrollYRef.current) {
        setIsNavVisible(false);
      } else {
        setIsNavVisible(true);
      }

      // --- Hero fade to black as it scrolls away ---
      if (heroOverlayRef.current) {
        const fadeProgress = Math.min(currentScrollY / vh, 1);
        const easedOpacity = fadeProgress * fadeProgress * 0.7;
        heroOverlayRef.current.style.opacity = easedOpacity;
      }

      // --- IntroSection shadow during peel reveal ---
      if (introShadowRef.current) {
        const peelProgress = Math.min(currentScrollY / vh, 1.5);
        let shadowOpacity;
        if (peelProgress < 0.35) {
          // Shadow builds as hero starts peeling
          shadowOpacity = (peelProgress / 0.35) * 0.5;
        } else if (peelProgress < 1.2) {
          // Shadow fades as intro is fully revealed
          shadowOpacity = 0.5 * (1 - (peelProgress - 0.35) / 0.85);
        } else {
          shadowOpacity = 0;
        }
        introShadowRef.current.style.opacity = Math.max(0, shadowOpacity);
      }

      lastScrollYRef.current = currentScrollY;
    };

    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

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

  // Initial spin animation when intro comes into view
  useEffect(() => {
    if (
      !initialAnimationComplete &&
      motionEnabled &&
      decorationsEnabled &&
      introInView
    ) {
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
    introInView,
    topStarControls,
    bottomStarControls,
  ]);

  const handleLoadingComplete = () => {
    // Allow hero / main content to start animating immediately
    setIsLoading(false);
    // Keep the loader visible just long enough to play its exit animation
    setTimeout(() => setShowLoader(false), 800); // matches LoadingScreen exit duration
  };

  return (
    <main className="">
      {/* Loading Screen */}
      {showLoader && <LoadingScreen onComplete={handleLoadingComplete} />}

      {/* Navigation — rendered at top level so it's not trapped in hero's stacking context */}
      <AnimatePresence>
        {isNavVisible && (
          <motion.div
            className="fixed top-0 left-0 right-0 z-50 flex justify-center pt-4"
            initial={{ y: -100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -100, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
          >
            <Navigation
              activeTab={activeTab}
              setActiveTab={setActiveTab}
              indicatorStyle={indicatorStyle}
              navRefs={navRefs}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Settings Button */}
      <motion.button
        onClick={toggleSettings}
        className="settings-button fixed top-7 right-6 z-50 bg-[#323232] hover:bg-[#404040] text-white p-3 rounded-full transition-all duration-300 shadow-lg"
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

      {/* Page Transition Wrapper */}
      <PageTransition activeTab={activeTab}>
        {(displayedTab) => (
          <>
            {displayedTab === "home" && (
              <>
                {/* IntroSection — fixed layer behind everything, revealed by hero peel */}
                <div className="intro-fixed-layer" ref={introRef}>
                  {/* Shadow overlay — darkens during peel, fades when revealed */}
                  <div ref={introShadowRef} className="intro-shadow-overlay" />
                  {/* Grey-to-white gradient at top edge (paper underside effect) */}

                  <StarField motionEnabled={motionEnabled} />

                  <div style={{ position: "relative" }}>
                    <GradientBackground
                      decorationsEnabled={decorationsEnabled}
                      motionEnabled={motionEnabled}
                    />
                    <IntroSection
                      decorationsEnabled={decorationsEnabled}
                      motionEnabled={motionEnabled}
                      topStarControls={topStarControls}
                      bottomStarControls={bottomStarControls}
                      setIsTopHovering={setIsTopHovering}
                      setIsBottomHovering={setIsBottomHovering}
                      currentText={currentText}
                      introInView={introInView}
                      isHomeTab={displayedTab === "home"}
                    />
                  </div>
                </div>

                {/* Hero Section — scrolls normally with curved bottom peel edge */}
                <div className="">
                  <HeroSection
                    heroOverlayRef={heroOverlayRef}
                    isLoading={isLoading}
                  />
                </div>

                {/* Spacer — accounts for the fixed intro layer */}
                <div className="intro-spacer" />

                {/* <div className="mainBody flex flex-col gap-[2rem] justify-center items-center"></div> */}
              </>
            )}

            {displayedTab === "about" && <AboutPage />}
            {displayedTab === "contact" && <ContactPage />}
          </>
        )}
      </PageTransition>
    </main>
  );
}
