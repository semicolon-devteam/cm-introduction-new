/* eslint-disable max-lines */
/* eslint-disable complexity */
"use client";

import { useEffect, useState, useMemo } from "react";
import { motion, useMotionValue, useTransform, AnimatePresence } from "framer-motion";

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
  const stars = useMemo(() => Array.from({ length: 50 }, (_, i) => ({ id: i, delay: Math.random() * 2 })), []);

  return (
    <div className="absolute inset-0 overflow-hidden">
      {stars.map((star) => (
        <Star key={star.id} delay={star.delay} />
      ))}
    </div>
  );
}

// Meteor trail particles
function MeteorTrail({ progress }: { progress: number }) {
  const particles = useMemo(() => Array.from({ length: 20 }, (_, i) => i), []);

  return (
    <>
      {particles.map((i) => (
        <motion.div
          key={i}
          className="absolute w-1 h-1 md:w-2 md:h-2 rounded-full"
          style={{
            background: `radial-gradient(circle, ${COLORS.primary} 0%, transparent 70%)`,
            filter: "blur(1px)",
          }}
          initial={{ opacity: 0, scale: 0 }}
          animate={{
            opacity: progress > 0.3 ? [0, 0.8, 0] : 0,
            scale: progress > 0.3 ? [0, 1.5, 0] : 0,
            x: `${50 + progress * 100 * 0.4 - i * 2}vw`,
            y: `${50 - i * 0.5}vh`,
          }}
          transition={{
            duration: 0.8,
            delay: i * 0.03,
            ease: "easeOut",
          }}
        />
      ))}
    </>
  );
}

export function SemicolonHero() {
  const [animationPhase, setAnimationPhase] = useState<"space" | "bigbang" | "meteor" | "formation" | "complete">(
    "space"
  );
  const [skipAnimation, setSkipAnimation] = useState(false);
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

  // Animate meteor progress
  useEffect(() => {
    if (animationPhase === "meteor") {
      const startTime = Date.now();
      const duration = 1500; // 1.5s

      const animate = () => {
        const elapsed = Date.now() - startTime;
        const progress = Math.min(elapsed / duration, 1);
        meteorProgress.set(progress);

        if (progress < 1) {
          requestAnimationFrame(animate);
        }
      };

      requestAnimationFrame(animate);
    }
  }, [animationPhase, meteorProgress]);

  const meteorX = useTransform(meteorProgress, [0, 1], ["50vw", "70vw"]);
  const meteorY = useTransform(meteorProgress, [0, 1], ["50vh", "45vh"]);

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

      {/* Phase 2: Big Bang - Explosion flash */}
      <AnimatePresence>
        {animationPhase === "bigbang" && (
          <>
            {/* Central flash point */}
            <motion.div
              className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: [0, 1, 0], opacity: [0, 1, 0] }}
              transition={{ duration: 0.3 }}
            >
              <div
                className="w-4 h-4 md:w-8 md:h-8 rounded-full"
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

      {/* Phase 3: Meteor Speed - Shooting across screen */}
      {!skipAnimation && (animationPhase === "meteor" || animationPhase === "formation") && (
        <>
          <MeteorTrail progress={meteorProgress.get()} />

          <motion.div
            className="absolute w-6 h-6 md:w-10 md:h-10"
            style={{
              x: meteorX,
              y: meteorY,
              willChange: "transform",
            }}
            initial={{ scale: 0 }}
            animate={{ scale: animationPhase === "meteor" ? 1 : 0 }}
            transition={{ duration: 0.2 }}
          >
            <div
              className="w-full h-full rounded-full"
              style={{
                background: `radial-gradient(circle, ${COLORS.white} 0%, ${COLORS.primary} 60%, transparent 100%)`,
                boxShadow: `0 0 40px 20px ${COLORS.primary}`,
                filter: "blur(2px)",
              }}
            />
          </motion.div>
        </>
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
            >
              {/* Semicolon Symbol */}
              <motion.div
                className="relative mb-6 md:mb-8"
                animate={
                  animationPhase === "complete"
                    ? {
                        y: [0, -3, 0],
                      }
                    : {}
                }
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              >
                <div className="text-7xl md:text-9xl font-bold flex flex-col items-center gap-2 md:gap-3">
                  {/* Top dot */}
                  <motion.div
                    className="w-4 h-4 md:w-6 md:h-6 rounded-full relative"
                    style={{
                      backgroundColor: COLORS.white,
                    }}
                    initial={
                      skipAnimation
                        ? false
                        : {
                            scale: 0,
                            x: skipAnimation ? 0 : typeof window !== "undefined" ? window.innerWidth * 0.2 : 0,
                            y: skipAnimation ? 0 : typeof window !== "undefined" ? -window.innerHeight * 0.05 : 0,
                          }
                    }
                    animate={{
                      scale: 1,
                      x: 0,
                      y: 0,
                    }}
                    transition={
                      skipAnimation
                        ? {}
                        : {
                            duration: 0.5,
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

                  {/* Bottom dot (comma part) */}
                  <motion.div
                    className="w-4 h-6 md:w-6 md:h-8 rounded-full rounded-br-none relative"
                    style={{
                      backgroundColor: COLORS.white,
                      transform: "rotate(-15deg)",
                    }}
                    initial={skipAnimation ? false : { scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={
                      skipAnimation
                        ? {}
                        : {
                            duration: 0.4,
                            delay: 0.4,
                            ease: "easeOut",
                          }
                    }
                  />
                </div>
              </motion.div>

              {/* SEMICOLON Typography */}
              <motion.div
                className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-[0.3em] md:tracking-[0.5em] text-white mb-12 md:mb-16"
                initial={
                  skipAnimation
                    ? false
                    : {
                        scaleX: 0,
                        opacity: 0,
                      }
                }
                animate={{
                  scaleX: 1,
                  opacity: 1,
                }}
                transition={
                  skipAnimation
                    ? {}
                    : {
                        duration: 0.8,
                        delay: 0.6,
                        ease: "easeOut",
                      }
                }
              >
                {"SEMICOLON".split("").map((letter, i) => (
                  <motion.span
                    key={i}
                    initial={skipAnimation ? false : { opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={
                      skipAnimation
                        ? {}
                        : {
                            duration: 0.1,
                            delay: 0.8 + i * 0.05,
                          }
                    }
                  >
                    {letter}
                  </motion.span>
                ))}
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
