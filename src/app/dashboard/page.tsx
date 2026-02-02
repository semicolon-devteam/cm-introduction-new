"use client";

import { DashboardHeader } from "./_components";

export default function DashboardPage() {
  return (
    <div className="min-h-screen bg-[#0d0e12]">
      <main className="max-w-screen-xl mx-auto px-6 py-8">
        <DashboardHeader period="month" onPeriodChange={() => {}} />
        <div className="text-center text-gray-400 mt-20">
          <p>Dashboard - Coming Soon</p>
        </div>
      </main>
    </div>
  );
}
