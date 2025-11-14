/* eslint-disable max-lines */
/* eslint-disable complexity */
"use client";

import { useEffect, useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";

// Brand colors
const COLORS = {
  primary: "#068FFF",
  white: "#FFFFFF",
  black: "#1B1B1C",
  surface: "#1A1A1A",
};

// Enhanced Star particle with size and brightness variation
function Star({
  delay,
  size,
  brightness,
  x,
  y,
}: {
  delay: number;
  size: number;
  brightness: number;
  x: number;
  y: number;
}) {
  return (
    <motion.div
      className="absolute bg-white rounded-full"
      style={{
        left: `${x}%`,
        top: `${y}%`,
        width: `${size}px`,
        height: `${size}px`,
      }}
      initial={{ opacity: 0 }}
      animate={{
        opacity: [0, brightness, brightness * 0.7, brightness, brightness * 0.8],
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

// Stars background component with variation
function StarsBackground() {
  const stars = useMemo(() => {
    // Seed-based random for consistent server/client rendering
    const seededRandom = (seed: number) => {
      const x = Math.sin(seed) * 10000;
      return x - Math.floor(x);
    };

    return Array.from({ length: 50 }, (_, i) => ({
      id: i,
      x: seededRandom(i * 1.1) * 100,
      y: seededRandom(i * 2.2) * 100,
      delay: seededRandom(i * 3.3) * 2,
      size: 0.5 + seededRandom(i * 4.4) * 1.5, // 0.5px ~ 2px
      brightness: 0.5 + seededRandom(i * 5.5) * 0.5, // 0.5 ~ 1.0
    }));
  }, []);

  return (
    <div className="absolute inset-0 overflow-hidden">
      {stars.map((star) => (
        <Star
          key={star.id}
          x={star.x}
          y={star.y}
          delay={star.delay}
          size={star.size}
          brightness={star.brightness}
        />
      ))}
    </div>
  );
}

// Enhanced Comet with massive particle burst effect
function CometTrail({ progress, phase }: { progress: number; phase?: string }) {
  const particles = useMemo(() => Array.from({ length: 800 }, (_, i) => i), []); // 800 particles for dense light effect!

  // Adjusted center position to match semicolon symbol placement
  const centerX = 48; // Slightly left for better alignment
  const centerY = 42; // Slightly up for better alignment

  // Tail direction - particles scatter in opposite direction (upper-left)
  const tailDirection = { x: -1, y: -0.6 };

  // Fade out during formation phase
  const opacity = phase === "formation" ? 0 : 1;

  return (
    <>
      {/* Comet head - stays at center, bright white core, fades out when semicolon appears */}
      <motion.div
        className="absolute w-3 h-3 md:w-5 md:h-5 rounded-full"
        style={{
          left: `${centerX}%`,
          top: `${centerY}%`,
          transform: "translate(-50%, -50%)",
          background: COLORS.white,
          boxShadow: `0 0 20px 10px ${COLORS.white}, 0 0 40px 20px ${COLORS.primary}`,
          filter: "blur(1px)",
          zIndex: 20,
        }}
        animate={{
          scale: [1, 1.3, 1],
          opacity: opacity,
        }}
        transition={{
          duration: 0.4,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />

      {/* Continuous particle emission - particles spawn throughout animation */}
      {particles.map((i) => {
        // Each particle has its own lifecycle timing
        const particleSpawnTime = (i / particles.length) * 0.6; // Particles spawn only during first 60% (1.5s out of 2.5s)
        const particleAge = Math.max(0, progress - particleSpawnTime); // How long this particle has existed
        const particleLifetime = 0.6; // Each particle lives longer (60% = 1.5s) to fully disperse

        // Particle visibility based on age
        const isSpawned = progress >= particleSpawnTime;
        const particleProgress = Math.min(particleAge / particleLifetime, 1);
        const fadeIn = Math.min(particleProgress * 5, 1); // Quick fade in
        const fadeOut = Math.max(0, 1 - (particleProgress - 0.5) * 2); // Start fading out after 50% of lifetime

        // Hide all particles during formation phase (waiting period)
        if (phase === "formation") return null;
        if (!isSpawned || particleProgress > 1) return null;

        // Particle movement from center - travel faster and farther to leave screen
        const travelDistance = particleAge * 250; // Increased from 150 to 250 for faster dispersion
        const baseOpacity = 0.8;

        // Smaller particles for light effect (1-5px)
        const sizeVariation = Math.sin(i * 0.5) * 1.5;
        const size = Math.max(1, 3 - particleProgress * 2 + sizeVariation); // Shrink as they travel

        // Spread pattern - particles scatter in tail direction with variation
        const spreadAngle = ((i % 20) - 10) * 0.05; // Slight angle variation
        const randomSpread = Math.sin(i * 0.7) * 2;

        // Calculate particle position - moving away from center
        const particleX =
          centerX + (tailDirection.x * travelDistance + randomSpread) * (1 + spreadAngle);
        const particleY =
          centerY + (tailDirection.y * travelDistance + (i % 7) * 0.5) * (1 + spreadAngle);

        return (
          <motion.div
            key={i}
            className="absolute rounded-full"
            style={{
              left: `${particleX}%`,
              top: `${particleY}%`,
              transform: "translate(-50%, -50%)",
              width: `${size}px`,
              height: `${size}px`,
              background: `radial-gradient(circle, ${COLORS.white} 0%, ${COLORS.primary} 40%, ${COLORS.primary}90 60%, transparent 80%)`,
              opacity: baseOpacity * fadeIn * fadeOut, // Smooth fade in and out
              filter: "blur(0.3px)",
              boxShadow: `0 0 ${size * 3}px ${COLORS.primary}60, 0 0 ${size}px ${COLORS.white}80`,
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
  const [meteorProgress, setMeteorProgress] = useState(0);

  // Check for reduced motion preference
  useEffect(() => {
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReducedMotion) {
      setSkipAnimation(true);
      setAnimationPhase("complete");
    }
  }, []);

  // Animation sequence controller - IMPROVED TIMING
  useEffect(() => {
    if (skipAnimation) return;

    const timers = [
      setTimeout(() => setAnimationPhase("bigbang"), 1500), // 1.5s: Deep Space (shortened)
      setTimeout(() => setAnimationPhase("meteor"), 2000), // 2s: Big Bang
      setTimeout(() => {
        setAnimationPhase("formation");
        setMeteorProgress(1);
      }, 5500), // 5.5s: Meteor finishes + wait for particles to clear
      setTimeout(() => setAnimationPhase("complete"), 6500), // 6.5s: Formation (after particles clear)
    ];

    return () => timers.forEach(clearTimeout);
  }, [skipAnimation]);

  // Animate meteor progress - tail extends to create movement illusion
  useEffect(() => {
    if (animationPhase === "meteor") {
      const startTime = Date.now();
      const duration = 2500; // 2.5s: Original meteor movement duration

      const animate = () => {
        const elapsed = Date.now() - startTime;
        const progress = Math.min(elapsed / duration, 1);
        setMeteorProgress(progress);

        if (progress < 1) {
          requestAnimationFrame(animate);
        }
        // After reaching 1.0, meteor stops but particles continue to disperse
      };

      requestAnimationFrame(animate);
    }
  }, [animationPhase]);

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

      {/* Stars background - visible throughout, moves rapidly with meteor */}
      {!skipAnimation && (
        <motion.div
          animate={
            animationPhase === "meteor"
              ? {
                  x: ["0%", "30%"], // Move right faster (opposite of tail direction)
                  y: ["0%", "18%"], // Move down faster
                }
              : { x: "0%", y: "0%" }
          }
          transition={{
            duration: 2.5,
            ease: [0.25, 0.1, 0.25, 1], // Custom easing for more dynamic movement
          }}
        >
          <StarsBackground />
        </motion.div>
      )}

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
        {(animationPhase === "bigbang" || animationPhase === "meteor") && (
          <>
            {/* Central flash point - matches comet position (48%, 42%) */}
            <motion.div
              className="absolute"
              style={{
                left: "48%",
                top: "42%",
                transform: "translate(-50%, -50%)",
              }}
              initial={{ scale: 0, opacity: 0 }}
              animate={
                animationPhase === "bigbang"
                  ? { scale: [0, 2, 1], opacity: [0, 1, 1] }
                  : { scale: 0.5, opacity: 0 }
              }
              exit={{ opacity: 0 }}
              transition={
                animationPhase === "bigbang"
                  ? { duration: 0.3 }
                  : { duration: 0.5, ease: "easeOut" }
              }
            >
              <div
                className="w-3 h-3 md:w-5 md:h-5 rounded-full"
                style={{
                  background: COLORS.white,
                  boxShadow: `0 0 60px 30px ${COLORS.white}, 0 0 100px 50px ${COLORS.primary}`,
                }}
              />
            </motion.div>

            {/* Radial burst effect - only during bigbang, centered at comet position */}
            {animationPhase === "bigbang" && (
              <>
                <motion.div
                  className="absolute w-[200vw] h-[200vw]"
                  style={{
                    left: "48%",
                    top: "42%",
                    transform: "translate(-50%, -50%)",
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
          </>
        )}
      </AnimatePresence>

      {/* Phase 3: Meteor Speed - Fixed center with extending tail */}
      {!skipAnimation && (animationPhase === "meteor" || animationPhase === "formation") && (
        <CometTrail progress={meteorProgress} phase={animationPhase} />
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
                      left: "50%",
                      top: "50%",
                      transform: "translate(-50%, -50%)",
                    }
                  : {}
              }
            >
              {/* SEM I COLON Typography - Symbol as 'I', spreads left and right */}
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
                {/* Left letters: S-E-M (expand leftward) with spring */}
                <motion.div className="flex items-center gap-1 md:gap-2">
                  <motion.div
                    className="relative w-8 h-8 md:w-12 md:h-12"
                    initial={skipAnimation ? false : { opacity: 0, x: 40, scale: 0.8 }}
                    animate={{ opacity: 1, x: 0, scale: 1 }}
                    transition={
                      skipAnimation
                        ? {}
                        : {
                            type: "spring",
                            stiffness: 200,
                            damping: 15,
                            delay: 1.0,
                          }
                    }
                  >
                    <Image src="/images/logo/logo-s.svg" alt="S" fill className="object-contain" />
                  </motion.div>
                  <motion.div
                    className="relative w-6 h-6 md:w-9 md:h-9"
                    initial={skipAnimation ? false : { opacity: 0, x: 30, scale: 0.8 }}
                    animate={{ opacity: 1, x: 0, scale: 1 }}
                    transition={
                      skipAnimation
                        ? {}
                        : {
                            type: "spring",
                            stiffness: 220,
                            damping: 17,
                            delay: 0.9,
                          }
                    }
                  >
                    <Image src="/images/logo/logo-e.svg" alt="E" fill className="object-contain" />
                  </motion.div>
                  <motion.div
                    className="relative w-6 h-6 md:w-9 md:h-9"
                    initial={skipAnimation ? false : { opacity: 0, x: 20, scale: 0.8 }}
                    animate={{ opacity: 1, x: 0, scale: 1 }}
                    transition={
                      skipAnimation
                        ? {}
                        : {
                            type: "spring",
                            stiffness: 240,
                            damping: 19,
                            delay: 0.8,
                          }
                    }
                  >
                    <Image src="/images/logo/logo-m.svg" alt="M" fill className="object-contain" />
                  </motion.div>
                </motion.div>

                {/* Center: Semicolon Symbol as 'I' - appears from comet */}
                <motion.div
                  className="relative mb-0"
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
                  <div className="flex flex-col items-center mx-1 md:mx-2">
                    {/* Top dot - matches comet size exactly (w-3 h-3 md:w-5 md:h-5) */}
                    <motion.div
                      className="w-3 h-3 md:w-5 md:h-5 rounded-full relative"
                      style={{
                        backgroundColor: COLORS.white,
                        boxShadow: skipAnimation
                          ? undefined
                          : `0 0 20px 10px ${COLORS.white}, 0 0 40px 20px ${COLORS.primary}`,
                        filter: skipAnimation ? undefined : "blur(1px)",
                      }}
                      initial={skipAnimation ? false : { scale: 1, opacity: 1 }}
                      animate={{
                        scale: animationPhase === "complete" ? 1.33 : 1, // 1.33x = 4px/6.65px (approximately w-4/w-6.5)
                        opacity: 1,
                        boxShadow:
                          animationPhase === "complete"
                            ? `0 0 20px 8px ${COLORS.white}, 0 0 30px 15px ${COLORS.primary}`
                            : skipAnimation
                              ? undefined
                              : `0 0 20px 10px ${COLORS.white}, 0 0 40px 20px ${COLORS.primary}`,
                        filter:
                          animationPhase === "complete"
                            ? "blur(0px)"
                            : skipAnimation
                              ? undefined
                              : "blur(1px)",
                      }}
                      transition={
                        skipAnimation
                          ? {}
                          : animationPhase === "complete"
                            ? {
                                duration: 0.5,
                                ease: "easeOut",
                              }
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
                      className="w-4 h-6 md:w-6 md:h-8 rounded-full rounded-br-none relative mt-2 md:mt-3"
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
                  </div>
                </motion.div>

                {/* Right letters: C-O-L-O-N (expand rightward) with spring */}
                <motion.div className="flex items-center gap-1 md:gap-2">
                  <motion.div
                    className="relative w-6 h-6 md:w-9 md:h-9"
                    initial={skipAnimation ? false : { opacity: 0, x: -20, scale: 0.8 }}
                    animate={{ opacity: 1, x: 0, scale: 1 }}
                    transition={
                      skipAnimation
                        ? {}
                        : {
                            type: "spring",
                            stiffness: 240,
                            damping: 19,
                            delay: 0.8,
                          }
                    }
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
                    initial={skipAnimation ? false : { opacity: 0, x: -30, scale: 0.8 }}
                    animate={{ opacity: 1, x: 0, scale: 1 }}
                    transition={
                      skipAnimation
                        ? {}
                        : {
                            type: "spring",
                            stiffness: 220,
                            damping: 17,
                            delay: 0.9,
                          }
                    }
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
                    initial={skipAnimation ? false : { opacity: 0, x: -40, scale: 0.8 }}
                    animate={{ opacity: 1, x: 0, scale: 1 }}
                    transition={
                      skipAnimation
                        ? {}
                        : {
                            type: "spring",
                            stiffness: 200,
                            damping: 16,
                            delay: 1.0,
                          }
                    }
                  >
                    <Image src="/images/logo/logo-l.svg" alt="L" fill className="object-contain" />
                  </motion.div>
                  <motion.div
                    className="relative w-6 h-6 md:w-9 md:h-9"
                    initial={skipAnimation ? false : { opacity: 0, x: -50, scale: 0.8 }}
                    animate={{ opacity: 1, x: 0, scale: 1 }}
                    transition={
                      skipAnimation
                        ? {}
                        : {
                            type: "spring",
                            stiffness: 190,
                            damping: 15,
                            delay: 1.1,
                          }
                    }
                  >
                    <Image src="/images/logo/logo-o.svg" alt="O" fill className="object-contain" />
                  </motion.div>
                  <motion.div
                    className="relative w-6 h-6 md:w-9 md:h-9"
                    initial={skipAnimation ? false : { opacity: 0, x: -60, scale: 0.8 }}
                    animate={{ opacity: 1, x: 0, scale: 1 }}
                    transition={
                      skipAnimation
                        ? {}
                        : {
                            type: "spring",
                            stiffness: 180,
                            damping: 14,
                            delay: 1.2,
                          }
                    }
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
