'use client';

import React, { useState, useEffect } from 'react';
import { motion, useScroll, useTransform, useSpring } from 'framer-motion';
import { Radio, Crosshair, Sparkles, Activity, ShieldCheck, Zap } from 'lucide-react';

export function AgentRover() {
  const { scrollYProgress } = useScroll();
  const [activeDepth, setActiveDepth] = useState<string>('STAGE_0 // HERO_SURVEILLANCE');
  const [pulseCount, setPulseCount] = useState<number>(142);
  const [isLaserActive, setIsLaserActive] = useState<boolean>(true);

  // Smooth physics-based spring transformation for horizontal roaming
  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 80,
    damping: 24,
    restDelta: 0.001,
  });

  // Rover traverses left to right and oscillates smoothly across viewport
  const x = useTransform(
    smoothProgress,
    [0, 0.22, 0.48, 0.72, 1],
    ['4vw', '76vw', '18vw', '78vw', '48vw']
  );

  const rotate = useTransform(
    smoothProgress,
    [0, 0.25, 0.5, 0.75, 1],
    [0, 5, -4, 5, 0]
  );

  // Update telemetry label according to scroll depth
  useEffect(() => {
    return scrollYProgress.on('change', (latest) => {
      if (latest < 0.2) {
        setActiveDepth('STAGE_0 // HERO_SURVEILLANCE');
      } else if (latest < 0.45) {
        setActiveDepth('STAGE_1 // RUNTIME_BARRIER_PROBE');
      } else if (latest < 0.7) {
        setActiveDepth('STAGE_2 // GEMINI_FAILOVER_MESH');
      } else {
        setActiveDepth('STAGE_3 // SHA256_LEDGER_LOCKED');
      }
      setPulseCount((prev) => (prev + 1) % 9999);
    });
  }, [scrollYProgress]);

  return (
    <div className="fixed top-24 left-0 right-0 z-40 pointer-events-none select-none">
      <motion.div
        style={{ x, rotate }}
        className="pointer-events-auto inline-flex flex-col items-center group cursor-pointer"
        onClick={() => setIsLaserActive((prev) => !prev)}
      >
        {/* Sleek Glassmorphic Rover Capsule */}
        <div className="relative px-4 py-2 rounded-full bg-slate-950/85 border border-cyan-500/40 backdrop-blur-xl shadow-[0_0_35px_rgba(6,182,212,0.35)] flex items-center gap-3 transition-transform duration-200 group-hover:scale-105">
          {/* Animated Radar Lens / Core Eye */}
          <div className="relative flex items-center justify-center">
            <span className="w-3 h-3 rounded-full bg-cyan-400 animate-ping absolute opacity-75" />
            <span className="relative w-2.5 h-2.5 rounded-full bg-gradient-to-tr from-cyan-400 to-blue-500 shadow-[0_0_12px_#06b6d4]" />
          </div>

          {/* Telemetry Status Badges */}
          <div className="flex items-center gap-2 font-mono text-[10px] tracking-wider">
            <span className="flex items-center gap-1.5 text-cyan-300 font-bold">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shadow-[0_0_8px_#10b981] animate-pulse" />
              SCANNING_DOM
            </span>
            <span className="text-slate-600">//</span>
            <span className="text-slate-300 font-semibold">{activeDepth}</span>
          </div>

          {/* Live Ping & Node Counters */}
          <div className="hidden sm:flex items-center gap-2 pl-2 border-l border-cyan-500/20 text-[9px] font-mono text-cyan-400/80">
            <span className="bg-cyan-950/60 border border-cyan-500/30 px-1.5 py-0.5 rounded">
              PULSE #{pulseCount}
            </span>
            <span className="text-emerald-400 font-bold">● 60 FPS</span>
          </div>

          {/* Scanline / Sweep accent on pill border */}
          <div className="absolute inset-x-4 bottom-0 h-px bg-gradient-to-r from-transparent via-cyan-400 to-transparent opacity-80" />
        </div>

        {/* Downward Projecting Scanning Laser Beam */}
        {isLaserActive && (
          <div className="relative w-52 h-20 -mt-1 pointer-events-none flex flex-col items-center">
            {/* Soft conical scanning beam */}
            <div
              className="w-full h-full bg-gradient-to-b from-cyan-400/25 via-blue-500/10 to-transparent blur-sm animate-laser-sweep"
              style={{
                clipPath: 'polygon(50% 0%, 0% 100%, 100% 100%)',
              }}
            />
            {/* Sharp horizontal focal laser line */}
            <div className="absolute bottom-1 w-40 h-[1.5px] bg-gradient-to-r from-transparent via-cyan-300 to-transparent shadow-[0_0_12px_#06b6d4]" />
          </div>
        )}
      </motion.div>
    </div>
  );
}
