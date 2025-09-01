"use client";
import { useEffect, useRef } from "react";

const StarField = ({ motionEnabled = true }) => {
  const canvasRef = useRef(null);
  const animationRef = useRef(null);
  const starsRef = useRef([]);
  const velocityRef = useRef({ x: 0, y: 0, tx: 0, ty: 0, z: 0.0005 });
  const pointerRef = useRef({ x: null, y: null });
  const touchInputRef = useRef(false);

  const config = {
    STAR_COLOR: "#fff",
    STAR_SIZE: 3,
    STAR_MIN_SCALE: 0.2,
    OVERFLOW_THRESHOLD: 50,
  };

  useEffect(() => {
    if (!motionEnabled) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const context = canvas.getContext("2d");
    let scale = 1;
    let width, height;

    const getStarCount = () => (window.innerWidth + window.innerHeight) / 20;

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

      let vx = Math.abs(velocity.x);
      let vy = Math.abs(velocity.y);

      if (vx > 1 || vy > 1) {
        let axis;
        if (vx > vy) {
          axis = Math.random() < vx / (vx + vy) ? "h" : "v";
        } else {
          axis = Math.random() < vy / (vx + vy) ? "v" : "h";
        }

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

    const resize = () => {
      scale = window.devicePixelRatio || 1;
      width = window.innerWidth * scale;
      height = window.innerHeight * scale;

      canvas.width = width;
      canvas.height = height;
      canvas.style.width = window.innerWidth + "px";
      canvas.style.height = window.innerHeight + "px";

      starsRef.current.forEach(placeStar);
    };

    const update = () => {
      const velocity = velocityRef.current;

      velocity.tx *= 0.96;
      velocity.ty *= 0.96;

      velocity.x += (velocity.tx - velocity.x) * 0.8;
      velocity.y += (velocity.ty - velocity.y) * 0.8;

      starsRef.current.forEach((star) => {
        star.x += velocity.x * star.z;
        star.y += velocity.y * star.z;

        star.x += (star.x - width / 2) * velocity.z * star.z;
        star.y += (star.y - height / 2) * velocity.z * star.z;
        star.z += velocity.z;

        if (
          star.x < -config.OVERFLOW_THRESHOLD ||
          star.x > width + config.OVERFLOW_THRESHOLD ||
          star.y < -config.OVERFLOW_THRESHOLD ||
          star.y > height + config.OVERFLOW_THRESHOLD
        ) {
          recycleStar(star);
        }
      });
    };

    const render = () => {
      context.clearRect(0, 0, width, height);
      const velocity = velocityRef.current;

      starsRef.current.forEach((star) => {
        context.beginPath();
        context.lineCap = "round";
        context.lineWidth = config.STAR_SIZE * star.z * scale;
        context.globalAlpha = 0.15 + 0.25 * Math.random();
        context.strokeStyle = config.STAR_COLOR;

        context.moveTo(star.x, star.y);

        let tailX = velocity.x * 2;
        let tailY = velocity.y * 2;

        if (Math.abs(tailX) < 0.1) tailX = 0.5;
        if (Math.abs(tailY) < 0.1) tailY = 0.5;

        context.lineTo(star.x + tailX, star.y + tailY);
        context.stroke();
      });
    };

    const step = () => {
      update();
      render();
      animationRef.current = requestAnimationFrame(step);
    };

    const movePointer = (x, y, horizontalOnly = false) => {
      const pointer = pointerRef.current;
      const velocity = velocityRef.current;

      if (typeof pointer.x === "number") {
        let ox = x - pointer.x;

        velocity.tx =
          velocity.tx + (ox / 16) * scale * (touchInputRef.current ? 1 : -1);

        if (!horizontalOnly && typeof pointer.y === "number") {
          let oy = y - pointer.y;
          velocity.ty =
            velocity.ty + (oy / 8) * scale * (touchInputRef.current ? 1 : -1);
        }
      }

      pointer.x = x;
      if (!horizontalOnly) {
        pointer.y = y;
      }
    };

    const onMouseMove = (event) => {
      touchInputRef.current = false;

      movePointer(event.clientX, pointerRef.current.y || event.clientY, true);
    };

    const onScroll = () => {
      const scrollY = window.scrollY;
      if (pointerRef.current.scrollY !== undefined) {
        const deltaY = scrollY - pointerRef.current.scrollY;
        const velocity = velocityRef.current;
        velocity.ty += deltaY * 0.15;
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
    resize();
    step();

    window.addEventListener("resize", resize);
    document.addEventListener("mousemove", onMouseMove);
    document.addEventListener("scroll", onScroll);
    canvas.addEventListener("touchmove", onTouchMove);
    canvas.addEventListener("touchend", onMouseLeave);
    document.addEventListener("mouseleave", onMouseLeave);

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
      window.removeEventListener("resize", resize);
      document.removeEventListener("mousemove", onMouseMove);
      document.removeEventListener("scroll", onScroll);
      canvas.removeEventListener("touchmove", onTouchMove);
      canvas.removeEventListener("touchend", onMouseLeave);
      document.removeEventListener("mouseleave", onMouseLeave);
    };
  }, [motionEnabled]);

  // Don't render anything if motion is disabled
  if (!motionEnabled) {
    return null;
  }

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 w-full h-full pointer-events-none"
      style={{
        zIndex: -10,
      }}
    />
  );
};

export default StarField;
