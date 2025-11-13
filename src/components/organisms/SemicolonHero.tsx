/* eslint-disable max-lines */
/* eslint-disable complexity */
"use client";

import { useEffect, useState, useMemo } from "react";
import { motion, useMotionValue, AnimatePresence } from "framer-motion";
import Image from "next/image";

// Brand colors
const COLORS = {
  primary: "#068FFF",
  white: "#FFFFFF",
  black: "#1B1B1C",
  surface: "#1A1A1A",
};

// Star particle for deep space background
function Star({ delay }: { delay: number }) {
  return (
    <motion.div
      className="absolute w-0.5 h-0.5 bg-white rounded-full"
      style={{
        left: `${Math.random() * 100}%`,
        top: `${Math.random() * 100}%`,
      }}
      initial={{ opacity: 0 }}
      animate={{
        opacity: [0, 1, 0.7, 1, 0.8],
        scale: [1, 1.5, 1, 1.3, 1],
      }}
      transition={{
        duration: 3,
        delay,
        repeat: Infinity,
        repeatType: "reverse",
      }}
    />
  );
}

// Stars background component
function StarsBackground() {
  const stars = useMemo(
    () => Array.from({ length: 50 }, (_, i) => ({ id: i, delay: Math.random() * 2 })),
    [],
  );

  return (
    <div className="absolute inset-0 overflow-hidden">
      {stars.map((star) => (
        <Star key={star.id} delay={star.delay} />
      ))}
    </div>
  );
}

// Comet with long glowing tail
function CometTrail({ x, y }: { x: number; y: number }) {
  const particles = useMemo(() => Array.from({ length: 30 }, (_, i) => i), []);

  return (
    <>
      {/* Comet head - bright white core */}
      <motion.div
        className="absolute w-3 h-3 md:w-5 md:h-5 rounded-full"
        style={{
          left: `${x}%`,
          top: `${y}%`,
          background: COLORS.white,
          boxShadow: `0 0 20px 10px ${COLORS.white}, 0 0 40px 20px ${COLORS.primary}`,
          filter: "blur(1px)",
        }}
      />

      {/* Long trailing tail particles */}
      {particles.map((i) => {
        const offset = i * 2; // Spacing between particles
        const opacity = Math.max(0, 1 - i / 30); // Fade out gradually
        const size = Math.max(1, 5 - i / 6); // Get smaller towards end

        return (
          <motion.div
            key={i}
            className="absolute rounded-full"
            style={{
              left: `${x - offset * 0.5}%`,
              top: `${y - offset * 0.3}%`,
              width: `${size}px`,
              height: `${size}px`,
              background: `radial-gradient(circle, ${COLORS.primary} 0%, transparent 70%)`,
              opacity: opacity * 0.8,
              filter: "blur(2px)",
            }}
          />
        );
      })}
    </>
  );
}

export function SemicolonHero() {
  const [animationPhase, setAnimationPhase] = useState<
    "space" | "bigbang" | "meteor" | "formation" | "complete"
  >("space");
  const [skipAnimation, setSkipAnimation] = useState(false);
  const [cometPosition, setCometPosition] = useState({ x: 50, y: 50 }); // Start at center
  const meteorProgress = useMotionValue(0);

  // Check for reduced motion preference
  useEffect(() => {
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReducedMotion) {
      setSkipAnimation(true);
      setAnimationPhase("complete");
    }
  }, []);

  // Animation sequence controller
  useEffect(() => {
    if (skipAnimation) return;

    const timers = [
      setTimeout(() => setAnimationPhase("bigbang"), 2000), // 2s: Deep Space
      setTimeout(() => setAnimationPhase("meteor"), 2500), // 2.5s: Big Bang
      setTimeout(() => {
        setAnimationPhase("formation");
        meteorProgress.set(1);
      }, 4000), // 4s: Meteor Speed
      setTimeout(() => setAnimationPhase("complete"), 5000), // 5s: Formation
    ];

    return () => timers.forEach(clearTimeout);
  }, [skipAnimation, meteorProgress]);

  // Animate meteor progress and comet movement
  useEffect(() => {
    if (animationPhase === "meteor") {
      const startTime = Date.now();
      const duration = 1500; // 1.5s
      const startX = 50; // Center
      const startY = 50; // Center
      const endX = 60; // Move right
      const endY = 40; // Move up slightly

      const animate = () => {
        const elapsed = Date.now() - startTime;
        const progress = Math.min(elapsed / duration, 1);
        meteorProgress.set(progress);

        // Update comet position
        const currentX = startX + (endX - startX) * progress;
        const currentY = startY + (endY - startY) * progress;
        setCometPosition({ x: currentX, y: currentY });

        if (progress < 1) {
          requestAnimationFrame(animate);
        }
      };

      requestAnimationFrame(animate);
    }
  }, [animationPhase, meteorProgress]);

  return (
    <section className="relative min-h-screen w-full overflow-hidden bg-gradient-to-b from-[#141622] to-[#000000]">
      {/* Skip animation button for accessibility */}
      {!skipAnimation && animationPhase !== "complete" && (
        <button
          onClick={() => {
            setSkipAnimation(true);
            setAnimationPhase("complete");
          }}
          className="absolute top-4 right-4 z-50 px-4 py-2 text-sm text-white/70 hover:text-white transition-colors"
        >
          Skip Animation
        </button>
      )}

      {/* Stars background - visible throughout */}
      {!skipAnimation && <StarsBackground />}

      {/* Phase 1: Deep Space - Pure black background with stars */}
      <AnimatePresence>
        {animationPhase === "space" && (
          <motion.div
            className="absolute inset-0 bg-black"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          />
        )}
      </AnimatePresence>

      {/* Phase 2: Big Bang - Explosion flash that becomes comet */}
      <AnimatePresence>
        {animationPhase === "bigbang" && (
          <>
            {/* Central flash point - stays visible and becomes comet head */}
            <motion.div
              className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: [0, 2, 1], opacity: [0, 1, 1] }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              <div
                className="w-3 h-3 md:w-5 md:h-5 rounded-full"
                style={{
                  background: COLORS.white,
                  boxShadow: `0 0 60px 30px ${COLORS.white}, 0 0 100px 50px ${COLORS.primary}`,
                }}
              />
            </motion.div>

            {/* Radial burst effect */}
            <motion.div
              className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[200vw] h-[200vw]"
              style={{
                background: `radial-gradient(circle, ${COLORS.white} 0%, ${COLORS.primary}40 10%, transparent 40%)`,
              }}
              initial={{ scale: 0, opacity: 0 }}
              animate={{
                scale: [0, 2, 1.5],
                opacity: [0, 1, 0],
              }}
              transition={{ duration: 0.5, ease: "easeOut" }}
            />

            {/* Screen flash */}
            <motion.div
              className="absolute inset-0 bg-white"
              initial={{ opacity: 0 }}
              animate={{ opacity: [0, 0.6, 0] }}
              transition={{ duration: 0.4 }}
            />
          </>
        )}
      </AnimatePresence>

      {/* Phase 3: Meteor Speed - Moving comet with long tail */}
      {!skipAnimation && animationPhase === "meteor" && (
        <CometTrail x={cometPosition.x} y={cometPosition.y} />
      )}

      {/* Phase 4 & 5: Semicolon Formation and Final State */}
      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen px-4">
        <AnimatePresence mode="wait">
          {(animationPhase === "formation" || animationPhase === "complete" || skipAnimation) && (
            <motion.div
              className="flex flex-col items-center"
              initial={skipAnimation ? false : { opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
              style={
                !skipAnimation && animationPhase === "formation"
                  ? {
                      position: "absolute",
                      left: `${cometPosition.x}%`,
                      top: `${cometPosition.y}%`,
                      transform: "translate(-50%, -50%)",
                    }
                  : {}
              }
            >
              {/* Comet becomes Semicolon Symbol */}
              <motion.div
                className="relative mb-6 md:mb-8"
                initial={
                  !skipAnimation && animationPhase === "formation"
                    ? {
                        position: "absolute",
                        left: 0,
                        top: 0,
                      }
                    : undefined
                }
                animate={
                  animationPhase === "complete"
                    ? {
                        y: [0, -3, 0],
                        position: "relative",
                        left: "auto",
                        top: "auto",
                      }
                    : animationPhase === "formation"
                      ? {
                          position: "relative",
                          left: 0,
                          top: 0,
                        }
                      : {}
                }
                transition={
                  animationPhase === "complete"
                    ? {
                        duration: 3,
                        repeat: Infinity,
                        ease: "easeInOut",
                      }
                    : {
                        duration: 0.8,
                        ease: "easeOut",
                      }
                }
              >
                {/* Top dot - from center light */}
                <motion.div
                  className="w-4 h-4 md:w-6 md:h-6 rounded-full relative mx-auto"
                  style={{
                    backgroundColor: COLORS.white,
                  }}
                  initial={skipAnimation ? false : { scale: 1.5, opacity: 1 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={
                    skipAnimation
                      ? {}
                      : {
                          duration: 0.3,
                          ease: "easeOut",
                          delay: 0.2,
                        }
                  }
                >
                  {/* Glow pulse effect */}
                  {animationPhase === "complete" && (
                    <motion.div
                      className="absolute inset-0 rounded-full"
                      style={{
                        boxShadow: `0 0 30px 10px ${COLORS.primary}`,
                      }}
                      animate={{
                        opacity: [0.5, 1, 0.5],
                      }}
                      transition={{
                        duration: 2,
                        repeat: Infinity,
                        ease: "easeInOut",
                      }}
                    />
                  )}
                </motion.div>

                {/* Bottom dot (comma part) - grows downward from top dot */}
                <motion.div
                  className="w-4 h-6 md:w-6 md:h-8 rounded-full rounded-br-none relative mx-auto mt-2 md:mt-3"
                  style={{
                    backgroundColor: COLORS.white,
                    transform: "rotate(-15deg)",
                  }}
                  initial={skipAnimation ? false : { scaleY: 0, opacity: 0, originY: 0 }}
                  animate={{ scaleY: 1, opacity: 1 }}
                  transition={
                    skipAnimation
                      ? {}
                      : {
                          duration: 0.3,
                          delay: 0.4,
                          ease: "easeOut",
                        }
                  }
                />
              </motion.div>

              {/* SEMICOLON Logo Typography - Spreads from semicolon */}
              <motion.div
                className="flex items-center justify-center gap-1 md:gap-2 mb-12 md:mb-16"
                initial={skipAnimation ? false : { opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={
                  skipAnimation
                    ? {}
                    : {
                        duration: 0.3,
                        delay: 0.5,
                      }
                }
              >
                {/* Left letters: S-E-M (expand leftward) */}
                <motion.div className="flex items-center gap-1 md:gap-2">
                  <motion.div
                    className="relative w-8 h-8 md:w-12 md:h-12"
                    initial={skipAnimation ? false : { opacity: 0, x: 40 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={skipAnimation ? {} : { duration: 0.4, delay: 1.0, ease: "easeOut" }}
                  >
                    <Image src="/images/logo/logo-s.svg" alt="S" fill className="object-contain" />
                  </motion.div>
                  <motion.div
                    className="relative w-6 h-6 md:w-9 md:h-9"
                    initial={skipAnimation ? false : { opacity: 0, x: 30 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={skipAnimation ? {} : { duration: 0.4, delay: 0.9, ease: "easeOut" }}
                  >
                    <Image src="/images/logo/logo-e.svg" alt="E" fill className="object-contain" />
                  </motion.div>
                  <motion.div
                    className="relative w-6 h-6 md:w-9 md:h-9"
                    initial={skipAnimation ? false : { opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={skipAnimation ? {} : { duration: 0.4, delay: 0.8, ease: "easeOut" }}
                  >
                    <Image src="/images/logo/logo-m.svg" alt="M" fill className="object-contain" />
                  </motion.div>
                </motion.div>

                {/* Center: Semicolon (;) - appears after tail forms */}
                <motion.div
                  className="relative w-3 h-8 md:w-4 md:h-10 mx-1 md:mx-2"
                  initial={skipAnimation ? false : { opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={skipAnimation ? {} : { duration: 0.3, delay: 0.6, ease: "easeOut" }}
                >
                  <Image
                    src="/images/logo/logo-semicolon.svg"
                    alt=";"
                    fill
                    className="object-contain"
                  />
                </motion.div>

                {/* Right letters: C-O-L-O-N (expand rightward) */}
                <motion.div className="flex items-center gap-1 md:gap-2">
                  <motion.div
                    className="relative w-6 h-6 md:w-9 md:h-9"
                    initial={skipAnimation ? false : { opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={skipAnimation ? {} : { duration: 0.4, delay: 0.8, ease: "easeOut" }}
                  >
                    <Image
                      src="/images/logo/logo-i-c.svg"
                      alt="C"
                      fill
                      className="object-contain"
                    />
                  </motion.div>
                  <motion.div
                    className="relative w-6 h-6 md:w-9 md:h-9"
                    initial={skipAnimation ? false : { opacity: 0, x: -30 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={skipAnimation ? {} : { duration: 0.4, delay: 0.9, ease: "easeOut" }}
                  >
                    <Image
                      src="/images/logo/logo-i-o.svg"
                      alt="O"
                      fill
                      className="object-contain"
                    />
                  </motion.div>
                  <motion.div
                    className="relative w-6 h-6 md:w-8 md:h-9"
                    initial={skipAnimation ? false : { opacity: 0, x: -40 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={skipAnimation ? {} : { duration: 0.4, delay: 1.0, ease: "easeOut" }}
                  >
                    <Image src="/images/logo/logo-l.svg" alt="L" fill className="object-contain" />
                  </motion.div>
                  <motion.div
                    className="relative w-6 h-6 md:w-9 md:h-9"
                    initial={skipAnimation ? false : { opacity: 0, x: -50 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={skipAnimation ? {} : { duration: 0.4, delay: 1.1, ease: "easeOut" }}
                  >
                    <Image src="/images/logo/logo-o.svg" alt="O" fill className="object-contain" />
                  </motion.div>
                  <motion.div
                    className="relative w-6 h-6 md:w-9 md:h-9"
                    initial={skipAnimation ? false : { opacity: 0, x: -60 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={skipAnimation ? {} : { duration: 0.4, delay: 1.2, ease: "easeOut" }}
                  >
                    <Image src="/images/logo/logo-n.svg" alt="N" fill className="object-contain" />
                  </motion.div>
                </motion.div>
              </motion.div>

              {/* Hero Text - Korean */}
              <motion.div
                className="text-center space-y-3 md:space-y-4 max-w-3xl"
                initial={skipAnimation ? false : { opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={
                  skipAnimation
                    ? {}
                    : {
                        duration: 0.8,
                        delay: 1.5,
                      }
                }
              >
                <h1 className="text-2xl md:text-4xl lg:text-5xl font-bold text-white">
                  연결과 소통의 가치를 실현하다
                </h1>
                <p className="text-base md:text-xl lg:text-2xl text-white/80">
                  세미콜론의 리더들과 함께하는 인재들을 소개합니다.
                </p>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}
