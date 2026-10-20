'use client';

import React from 'react';
import { DashboardShell } from '@/components/layout/DashboardShell';
import { HeroBanner } from '@/components/dashboard/HeroBanner';
import { AuditActionBar } from '@/components/dashboard/AuditActionBar';
import { OurGoalCard } from '@/components/dashboard/OurGoalCard';
import { MetricsGrid } from '@/components/dashboard/MetricsGrid';
import { RecentAuditsCard } from '@/components/dashboard/RecentAuditsCard';
import { HowItWorksCard } from '@/components/dashboard/HowItWorksCard';

export default function DashboardPage() {
  return (
    <DashboardShell>
      <div className="space-y-6">
        {/* Top Section: Hero Banner + Action Bar (Left) and Our Goal Card (Right) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-stretch">
          {/* Left 8 columns: Hero Banner & Start Audit Card */}
          <div className="lg:col-span-8 flex flex-col justify-between space-y-4">
            <HeroBanner />
            <AuditActionBar />
          </div>

          {/* Right 4 columns: Our Goal Card */}
          <div className="lg:col-span-4 flex">
            <div className="w-full">
              <OurGoalCard />
            </div>
          </div>
        </div>

        {/* Metrics Section: 4 Cards */}
        <section aria-label="Key Accessibility Metrics">
          <MetricsGrid />
        </section>

        {/* Lower Section: Recent Audits (Left) & How It Works (Right) */}
        <section
          className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-stretch"
          aria-label="Audits and Workflow"
        >
          {/* Left 7 columns: Recent Audits */}
          <div className="lg:col-span-7 flex">
            <div className="w-full">
              <RecentAuditsCard />
            </div>
          </div>

          {/* Right 5 columns: How It Works */}
          <div className="lg:col-span-5 flex">
            <div className="w-full">
              <HowItWorksCard />
            </div>
          </div>
        </section>
      </div>
    </DashboardShell>
  );
}
