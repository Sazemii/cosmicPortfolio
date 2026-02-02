"use client";
import { useEffect, useRef, useMemo } from "react";

const StarField = ({ motionEnabled = true }) => {
  const canvasRef = useRef(null);
  const animationRef = useRef(null);
  const starsRef = useRef([]);
  const velocityRef = useRef({ x: 0, y: 0, tx: 0, ty: 0, z: 0.0005 });
  const pointerRef = useRef({ x: null, y: null });
  const touchInputRef = useRef(false);

  // Memoize config to prevent recreation
  const config = useMemo(
    () => ({
      STAR_COLOR: "#fff",
      STAR_SIZE: 3,
      STAR_MIN_SCALE: 0.2,
      OVERFLOW_THRESHOLD: 50,
      MAX_STARS: 150,
    }),
    [],
  );

  useEffect(() => {
    if (!motionEnabled) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const context = canvas.getContext("2d", { alpha: true });
    let scale = 1;
    let width, height;

    // Cap star count for performance
    const getStarCount = () =>
      Math.min(
        Math.floor((window.innerWidth + window.innerHeight) / 20),
        config.MAX_STARS,
      );

    const generate = () => {
      starsRef.current = [];
      const starCount = getStarCount();

      for (let i = 0; i < starCount; i++) {
        starsRef.current.push({
          x: 0,
          y: 0,
          z:
            config.STAR_MIN_SCALE + Math.random() * (1 - config.STAR_MIN_SCALE),
        });
      }
    };

    const placeStar = (star) => {
      star.x = Math.random() * width;
      star.y = Math.random() * height;
    };

    const recycleStar = (star) => {
      let direction = "z";
      const velocity = velocityRef.current;

      const vx = Math.abs(velocity.x);
      const vy = Math.abs(velocity.y);

      if (vx > 1 || vy > 1) {
        const axis =
          vx > vy
            ? Math.random() < vx / (vx + vy)
              ? "h"
              : "v"
            : Math.random() < vy / (vx + vy)
              ? "v"
              : "h";

        if (axis === "h") {
          direction = velocity.x > 0 ? "l" : "r";
        } else {
          direction = velocity.y > 0 ? "t" : "b";
        }
      }

      star.z =
        config.STAR_MIN_SCALE + Math.random() * (1 - config.STAR_MIN_SCALE);

      if (direction === "z") {
        star.z = 0.1;
        star.x = Math.random() * width;
        star.y = Math.random() * height;
      } else if (direction === "l") {
        star.x = -config.OVERFLOW_THRESHOLD;
        star.y = height * Math.random();
      } else if (direction === "r") {
        star.x = width + config.OVERFLOW_THRESHOLD;
        star.y = height * Math.random();
      } else if (direction === "t") {
        star.x = width * Math.random();
        star.y = -config.OVERFLOW_THRESHOLD;
      } else if (direction === "b") {
        star.x = width * Math.random();
        star.y = height + config.OVERFLOW_THRESHOLD;
      }
    };

    // Debounced resize
    let resizeTimeout;
    const resize = () => {
      clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(() => {
        scale = window.devicePixelRatio || 1;
        width = window.innerWidth * scale;
        height = window.innerHeight * scale;

        canvas.width = width;
        canvas.height = height;
        canvas.style.width = window.innerWidth + "px";
        canvas.style.height = window.innerHeight + "px";

        starsRef.current.forEach(placeStar);
      }, 100);
    };

    const update = () => {
      const velocity = velocityRef.current;
      const stars = starsRef.current;
      const threshold = config.OVERFLOW_THRESHOLD;

      velocity.tx *= 0.96;
      velocity.ty *= 0.96;
      velocity.x += (velocity.tx - velocity.x) * 0.8;
      velocity.y += (velocity.ty - velocity.y) * 0.8;

      const halfWidth = width / 2;
      const halfHeight = height / 2;

      for (let i = 0, len = stars.length; i < len; i++) {
        const star = stars[i];
        star.x += velocity.x * star.z;
        star.y += velocity.y * star.z;
        star.x += (star.x - halfWidth) * velocity.z * star.z;
        star.y += (star.y - halfHeight) * velocity.z * star.z;
        star.z += velocity.z;

        if (
          star.x < -threshold ||
          star.x > width + threshold ||
          star.y < -threshold ||
          star.y > height + threshold
        ) {
          recycleStar(star);
        }
      }
    };

    const render = () => {
      const stars = starsRef.current;
      const velocity = velocityRef.current;

      context.clearRect(0, 0, width, height);
      context.strokeStyle = config.STAR_COLOR;
      context.lineCap = "round";

      // Batch similar operations
      for (let i = 0, len = stars.length; i < len; i++) {
        const star = stars[i];

        context.beginPath();
        context.lineWidth = config.STAR_SIZE * star.z * scale;
        context.globalAlpha = 0.15 + 0.25 * Math.random();

        let tailX = velocity.x * 2;
        let tailY = velocity.y * 2;

        if (Math.abs(tailX) < 0.1) tailX = 0.5;
        if (Math.abs(tailY) < 0.1) tailY = 0.5;

        context.moveTo(star.x, star.y);
        context.lineTo(star.x + tailX, star.y + tailY);
        context.stroke();
      }
    };

    const step = () => {
      update();
      render();
      animationRef.current = requestAnimationFrame(step);
    };

    // ...existing code for movePointer, onMouseMove, onScroll, onTouchMove, onMouseLeave...

    const movePointer = (x, y, horizontalOnly = false) => {
      const pointer = pointerRef.current;
      const velocity = velocityRef.current;

      if (typeof pointer.x === "number") {
        const ox = x - pointer.x;
        velocity.tx += (ox / 16) * scale * (touchInputRef.current ? 1 : -1);

        if (!horizontalOnly && typeof pointer.y === "number") {
          const oy = y - pointer.y;
          velocity.ty += (oy / 8) * scale * (touchInputRef.current ? 1 : -1);
        }
      }

      pointer.x = x;
      if (!horizontalOnly) pointer.y = y;
    };

    const onMouseMove = (event) => {
      touchInputRef.current = false;
      movePointer(event.clientX, pointerRef.current.y || event.clientY, true);
    };

    const onScroll = () => {
      const scrollY = window.scrollY;
      if (pointerRef.current.scrollY !== undefined) {
        velocityRef.current.ty += (scrollY - pointerRef.current.scrollY) * 0.15;
      }
      pointerRef.current.scrollY = scrollY;
    };

    const onTouchMove = (event) => {
      touchInputRef.current = true;
      movePointer(event.touches[0].clientX, event.touches[0].clientY);
      event.preventDefault();
    };

    const onMouseLeave = () => {
      pointerRef.current.x = null;
      pointerRef.current.y = null;
    };

    generate();
    // Immediate resize on init
    scale = window.devicePixelRatio || 1;
    width = window.innerWidth * scale;
    height = window.innerHeight * scale;
    canvas.width = width;
    canvas.height = height;
    canvas.style.width = window.innerWidth + "px";
    canvas.style.height = window.innerHeight + "px";
    starsRef.current.forEach(placeStar);

    step();

    window.addEventListener("resize", resize, { passive: true });
    document.addEventListener("mousemove", onMouseMove, { passive: true });
    document.addEventListener("scroll", onScroll, { passive: true });
    canvas.addEventListener("touchmove", onTouchMove, { passive: false });
    canvas.addEventListener("touchend", onMouseLeave, { passive: true });
    document.addEventListener("mouseleave", onMouseLeave, { passive: true });

    return () => {
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
      clearTimeout(resizeTimeout);
      window.removeEventListener("resize", resize);
      document.removeEventListener("mousemove", onMouseMove);
      document.removeEventListener("scroll", onScroll);
      canvas.removeEventListener("touchmove", onTouchMove);
      canvas.removeEventListener("touchend", onMouseLeave);
      document.removeEventListener("mouseleave", onMouseLeave);
    };
  }, [motionEnabled, config]);

  if (!motionEnabled) return null;

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 w-full h-full pointer-events-none"
      style={{ zIndex: -10 }}
    />
  );
};

export default StarField;
