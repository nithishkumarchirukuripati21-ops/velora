'use client';

import React from 'react';
import { ShieldCheck } from 'lucide-react';

export function OurGoalCard() {
  return (
    <div className="relative overflow-hidden bg-white rounded-2xl border border-slate-100 p-6 shadow-xs flex flex-col justify-between h-full min-h-[220px]">
      <div>
        {/* Shield Icon Badge */}
        <div className="w-11 h-11 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-600 mb-4 shadow-xs">
          <ShieldCheck className="w-6 h-6 stroke-[2.2]" />
        </div>

        {/* Heading */}
        <h2 className="text-base font-bold text-slate-900 tracking-tight mb-2">
          Our Goal
        </h2>

        {/* Description */}
        <p className="text-xs font-normal text-slate-500 leading-relaxed max-w-[260px]">
          Identify and help fix accessibility barriers so everyone can access the web.
        </p>
      </div>

      {/* Subtle Botanical Leaf Silhouette Watermark */}
      <div className="absolute -bottom-3 -right-3 pointer-events-none opacity-40">
        <svg
          width="110"
          height="110"
          viewBox="0 0 100 100"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="text-emerald-400"
        >
          <path
            d="M80 85C50 85 30 65 30 35C45 40 60 55 65 70C66 60 62 48 55 38C70 45 80 60 80 85Z"
            fill="currentColor"
            opacity="0.35"
          />
          <path
            d="M90 90C75 60 50 50 35 45C45 35 65 30 85 45C75 48 68 55 65 62C75 65 85 75 90 90Z"
            fill="currentColor"
            opacity="0.25"
          />
        </svg>
      </div>
    </div>
  );
}
