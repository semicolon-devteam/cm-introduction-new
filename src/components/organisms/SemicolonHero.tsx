/* eslint-disable max-lines */
/* eslint-disable complexity */
"use client";

import { useEffect, useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";

// Brand colors from Tailwind config (CI Guideline Compliant)
const COLORS = {
  primary: "#068FFF", // brand-primary
  white: "#FFFFFF", // brand-white
  black: "#1D242B", // brand-black (updated to CI standard)
  surface: "#1A1A1A", // brand-surface
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

// Galaxy-inspired comet: Endless possibilities flowing like the Milky Way, then converging
// Center must match logo semicolon position exactly where the 'I' dot appears
function CometTrail({ progress, phase }: { progress: number; phase?: string }) {
  // 600 particles for impressive visual effect
  const particles = useMemo(() => Array.from({ length: 600 }, (_, i) => i), []);

  // Center position - matches logo's semicolon dot at 26% viewport height
  const centerX = 48.5;
  const centerY = 26;

  // Animation phases:
  // 0.0 - 0.37: Comet trail streams outward (like endless galaxy)
  // 0.37 - 1.0: All particles converge back to center for logo reveal (longer converge)
  const streamEnd = 0.37;
  const convergeStart = 0.37;

  const isConverging = progress > convergeStart;
  const convergeProgress = isConverging
    ? Math.min((progress - convergeStart) / (1 - convergeStart), 1)
    : 0;

  // Easing function
  const easeOutQuart = (t: number) => 1 - Math.pow(1 - t, 4);

  // Seeded random function (consistent server/client)
  const seededRandom = (seed: number) => {
    const x = Math.sin(seed) * 10000;
    return x - Math.floor(x);
  };

  return (
    <div className="absolute inset-0 pointer-events-none">
      {/* Galaxy stream particles - multi-layer effect */}
      {particles.map((i) => {
        if (phase === "formation") return null;

        // Unique properties per particle using seeded randomness
        const seed1 = seededRandom(i * 127.1);
        const seed2 = seededRandom(i * 269.5);
        const seed3 = seededRandom(i * 183.3);
        const seed4 = seededRandom(i * 311.7);

        // Particle spawn timing (staggered for stream effect)
        const spawnTime = seed1 * streamEnd * 0.5;
        const particleAge = Math.max(0, progress - spawnTime);

        // Don't show particles that haven't spawned yet (during stream phase only)
        if (!isConverging && particleAge <= 0) return null;

        // Multi-directional stream - full 360 spread for galaxy explosion effect
        // Spread particles in all directions from center
        const angle = seed2 * Math.PI * 2; // Full 360 degrees

        // Travel distance - varied for depth effect (moderate spread to stay visible)
        const distanceLayer = seed4 < 0.3 ? 0.5 : seed4 < 0.7 ? 0.8 : 1.1; // Near, mid, far
        const maxDistance = (40 + seed3 * 50) * distanceLayer; // 20-110% screen units (keep in view)
        const streamProgress = Math.min(particleAge / (streamEnd - spawnTime + 0.01), 1);
        const travelDistance = easeOutQuart(streamProgress) * maxDistance;

        // Stream position - straight outward movement
        const streamX = centerX + Math.cos(angle) * travelDistance;
        const streamY = centerY + Math.sin(angle) * travelDistance * 0.65;

        // Converge position - all rush back to center (faster with acceleration)
        let particleX: number;
        let particleY: number;

        if (isConverging) {
          // Faster easing with power of 4 for more dramatic convergence
          const convergeEase = Math.pow(convergeProgress, 2.5);
          // Variation in converge speed creates wave effect
          const speedVar = 0.85 + seed1 * 0.3;
          const adjustedEase = Math.min(convergeEase * speedVar, 1);

          particleX = streamX + (centerX - streamX) * adjustedEase;
          particleY = streamY + (centerY - streamY) * adjustedEase;
        } else {
          particleX = streamX;
          particleY = streamY;
        }

        // Skip particles that are completely outside the viewport
        if (particleX < -10 || particleX > 110 || particleY < -10 || particleY > 110) {
          return null;
        }

        // Size - varied by layer, larger when converging
        const distanceFromCenter = Math.sqrt(
          Math.pow(particleX - centerX, 2) + Math.pow(particleY - centerY, 2),
        );
        const layerSize = seed4 < 0.3 ? 3 : seed4 < 0.7 ? 2 : 1.5;
        const baseSize = layerSize + seed2 * 2;
        const proximityBonus = Math.max(0, 1 - distanceFromCenter / 40) * 3;
        const convergeGrow = isConverging ? convergeProgress * 5 : 0;
        const size = Math.max(1, baseSize + proximityBonus + convergeGrow);

        // Opacity - layered depth effect
        const distanceFade = Math.max(0.15, 1 - streamProgress * 0.6);
        const layerOpacity = seed4 < 0.3 ? 1 : seed4 < 0.7 ? 0.8 : 0.5;
        const convergeBright = isConverging ? 0.7 + convergeProgress * 0.3 : 1;
        const finalFade =
          isConverging && convergeProgress > 0.85 ? 1 - (convergeProgress - 0.85) * 6.67 : 1;
        const opacity = distanceFade * layerOpacity * convergeBright * finalFade;

        // Glow effect - more particles with glow for impressive look
        const hasGlow = i % 3 === 0;
        const isBright = i % 8 === 0;

        return (
          <div
            key={i}
            className="absolute rounded-full"
            style={{
              left: `${particleX}%`,
              top: `${particleY}%`,
              transform: "translate(-50%, -50%) translateZ(0)",
              width: `${size}px`,
              height: `${size}px`,
              background: isBright
                ? COLORS.white
                : hasGlow
                  ? `radial-gradient(circle, ${COLORS.white} 0%, ${COLORS.primary} 50%, transparent 100%)`
                  : COLORS.primary,
              opacity,
              boxShadow: isBright
                ? `0 0 ${size * 3}px ${COLORS.white}, 0 0 ${size * 6}px ${COLORS.primary}`
                : hasGlow
                  ? `0 0 ${size * 2}px ${COLORS.primary}`
                  : "none",
              willChange: "left, top",
            }}
          />
        );
      })}
    </div>
  );
}

export function SemicolonHero() {
  const [animationPhase, setAnimationPhase] = useState<
    "space" | "bigbang" | "meteor" | "formation" | "complete"
  >("meteor"); // Start directly with meteor phase
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
      setTimeout(() => {
        setAnimationPhase("formation");
      }, 3700), // 3.7s: Particles have converged, show logo
      setTimeout(() => setAnimationPhase("complete"), 4400), // 4.4s: Formation complete
    ];

    return () => timers.forEach(clearTimeout);
  }, [skipAnimation]);

  // Animate meteor progress - burst out then converge back
  useEffect(() => {
    if (animationPhase === "meteor") {
      const startTime = Date.now();
      const duration = 3700; // 3.7s: Full cycle (scatter + hold + converge) (+1s)

      const animate = () => {
        const elapsed = Date.now() - startTime;
        const progress = Math.min(elapsed / duration, 1);
        setMeteorProgress(progress);

        if (progress < 1) {
          requestAnimationFrame(animate);
        }
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
            duration: 1.5,
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

      {/* Phase 2: Meteor Speed - Fixed center with extending tail */}
      {!skipAnimation && animationPhase === "meteor" && (
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

              {/* Hero Content - Final Layout */}
              <motion.div
                className="w-full max-w-screen-xl mx-auto px-6"
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
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                  {/* Left: Text Content */}
                  <div className="space-y-6">
                    <p className="text-gray-400 text-sm tracking-widest">SEMICOLON</p>
                    <div>
                      <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight">
                        당신의 커뮤니티
                      </h1>
                      <p className="text-4xl md:text-5xl lg:text-6xl font-bold text-[#068FFF]">
                        우리의 솔루션
                      </p>
                    </div>
                    <p className="text-gray-400 text-sm md:text-base leading-relaxed">
                      연결과 소통을 통해 모두가 쉽게 참여할 수 있는
                      <br />
                      <span className="text-[#068FFF]">혁신적인 커뮤니티 생태계</span>를 만듭니다.
                    </p>
                    <div className="flex gap-4 pt-2">
                      <a
                        href="/tech"
                        className="inline-flex items-center gap-2 bg-[#068FFF] hover:bg-[#068FFF]/90 text-white px-6 py-3 rounded-lg text-sm font-medium transition-colors"
                      >
                        우리의 기술력 보기 →
                      </a>
                      <a
                        href="/contacts"
                        className="inline-flex items-center gap-2 border border-gray-500 text-gray-300 hover:bg-white/10 px-6 py-3 rounded-lg text-sm font-medium transition-colors"
                      >
                        문의하기
                      </a>
                    </div>
                  </div>

                  {/* Right: Logo + Stats */}
                  <div className="flex flex-col items-center lg:items-end space-y-8">
                    {/* SEMICOLON Logo */}
                    <Image
                      src="/images/main/Logo.svg"
                      alt="SEMICOLON"
                      width={330}
                      height={80}
                      className="h-16 md:h-20 w-auto"
                    />
                  </div>
                </div>
              </motion.div>

              {/* Scroll Indicator */}
              <motion.div
                className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex flex-col items-center"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 2.5, duration: 0.5 }}
              >
                <span className="text-xs text-gray-500 mb-2">SCROLL</span>
                <div className="w-6 h-10 rounded-full border-2 border-gray-500 flex justify-center pt-2">
                  <motion.div
                    className="w-1.5 h-1.5 rounded-full bg-[#068FFF]"
                    animate={{ y: [0, 12, 0] }}
                    transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
                  />
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}
