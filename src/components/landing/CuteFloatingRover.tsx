"use client";

import React, { useEffect, useState } from "react";
import { motion, useScroll, useSpring, useTransform } from "framer-motion";
import { Sparkles, Activity, ShieldCheck, Cpu } from "lucide-react";

export function CuteFloatingRover() {
  const { scrollYProgress } = useScroll();

  // Physics-based spring config: eliminates jitter and creates smooth organic trailing
  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 70,
    damping: 18,
    mass: 0.8,
    restDelta: 0.001,
  });

  // Calculate smooth viewport positions (clamped to gutters, never clipping content)
  // 0% (Hero): Right gutter
  // 25% (Section 1): Left gutter
  // 50% (Section 2): Right gutter
  // 75% (Section 3): Left gutter
  // 100% (Section 4): Center-right
  const x = useTransform(
    smoothProgress,
    [0, 0.15, 0.4, 0.65, 0.85, 1],
    ["72vw", "68vw", "8vw", "68vw", "8vw", "55vw"]
  );

  const y = useTransform(
    smoothProgress,
    [0, 0.15, 0.4, 0.65, 0.85, 1],
    ["15vh", "22vh", "38vh", "50vh", "65vh", "75vh"]
  );

  // Subtle tilt banking when moving
  const rotate = useTransform(
    smoothProgress,
    [0, 0.2, 0.4, 0.6, 0.8, 1],
    [0, -6, 8, -6, 6, 0]
  );

  // Fade in after hero and fade out cleanly near footer
  const opacity = useTransform(
    smoothProgress,
    [0, 0.08, 0.88, 0.98],
    [0, 1, 1, 0]
  );

  // Reactive telemetry badge changes smoothly without breaking motion
  const [badgeState, setBadgeState] = useState({
    icon: <Sparkles className="w-3.5 h-3.5 text-cyan-500" />,
    text: "Target Scoped // Ready",
  });

  useEffect(() => {
    return smoothProgress.on("change", (latest) => {
      if (latest < 0.25) {
        setBadgeState({
          icon: <Activity className="w-3.5 h-3.5 text-cyan-500" />,
          text: "Tracing Keystroke Loops",
        });
      } else if (latest < 0.5) {
        setBadgeState({
          icon: <Cpu className="w-3.5 h-3.5 text-blue-500" />,
          text: "Sampling Canvas Pixels",
        });
      } else if (latest < 0.75) {
        setBadgeState({
          icon: <Sparkles className="w-3.5 h-3.5 text-amber-500" />,
          text: "Pinging 3-Key Gemini Pool",
        });
      } else {
        setBadgeState({
          icon: <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />,
          text: "SHA-256 Ledger Locked",
        });
      }
    });
  }, [smoothProgress]);

  return (
    <motion.div
      style={{
        x,
        y,
        rotate,
        opacity,
        willChange: "transform, opacity",
      }}
      className="fixed top-0 left-0 z-40 pointer-events-none select-none flex items-center gap-3"
    >
      {/* CUTE ROBOT CAPSULE BODY */}
      <div className="relative group">
        {/* Soft Ambient Glow */}
        <div className="absolute -inset-1.5 bg-gradient-to-r from-cyan-400/30 to-blue-500/30 rounded-3xl blur-md opacity-75" />

        <div className="relative bg-white/95 border-2 border-cyan-400/70 shadow-[0_8px_30px_rgba(6,182,212,0.25)] rounded-2xl p-2.5 flex items-center gap-2 backdrop-blur-md">
          {/* Head Antenna */}
          <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 flex flex-col items-center">
            <span className="w-2 h-2 rounded-full bg-cyan-400 shadow-[0_0_8px_#22d3ee] animate-pulse" />
            <span className="w-0.5 h-2 bg-cyan-300" />
          </div>

          {/* Droid Visor Face */}
          <div className="bg-slate-900 rounded-xl px-2.5 py-1.5 flex items-center gap-1.5 shadow-inner">
            <span className="w-2 h-2 rounded-full bg-cyan-400 shadow-[0_0_6px_#22d3ee] animate-ping" />
            <span className="w-2 h-2 rounded-full bg-cyan-400 shadow-[0_0_6px_#22d3ee]" />
          </div>

          {/* Scanning Beam Projector */}
          <div className="hidden sm:block text-slate-700 font-mono text-[11px] font-semibold tracking-wider px-1">
            VEL-01
          </div>
        </div>

        {/* Downward Scanning Laser Pulse */}
        <div className="absolute left-1/2 -translate-x-1/2 top-full w-8 h-10 bg-gradient-to-b from-cyan-400/25 to-transparent blur-[1px] pointer-events-none" />
      </div>

      {/* REACTIVE TELEMETRY BADGE */}
      <motion.div
        key={badgeState.text}
        initial={{ opacity: 0, x: -5 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.25 }}
        className="hidden md:flex items-center gap-2 px-3 py-1.5 bg-white/90 border border-slate-200/90 shadow-md shadow-slate-200/50 rounded-full backdrop-blur-md"
      >
        {badgeState.icon}
        <span className="text-xs font-medium text-slate-800 tracking-tight whitespace-nowrap">
          {badgeState.text}
        </span>
      </motion.div>
    </motion.div>
  );
}
