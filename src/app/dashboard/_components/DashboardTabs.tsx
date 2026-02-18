"use client";

import { LayoutGrid, Target, DollarSign, Server, ClipboardList, Calendar } from "lucide-react";
import type { DashboardTab } from "./types";

interface DashboardTabsProps {
  activeTab: DashboardTab;
  onTabChange: (tab: DashboardTab) => void;
}

const TABS: Array<{ id: DashboardTab; label: string; icon: React.ReactNode }> = [
  { id: "overview", label: "개요", icon: <LayoutGrid className="w-4 h-4" /> },
  { id: "milestones", label: "마일스톤", icon: <Calendar className="w-4 h-4" /> },
  { id: "goals", label: "목표", icon: <Target className="w-4 h-4" /> },
  { id: "revenue", label: "수익", icon: <DollarSign className="w-4 h-4" /> },
  { id: "operations", label: "운영", icon: <Server className="w-4 h-4" /> },
  { id: "po", label: "PO", icon: <ClipboardList className="w-4 h-4" /> },
];

export function DashboardTabs({ activeTab, onTabChange }: DashboardTabsProps) {
  return (
    <div className="flex gap-1 p-1 bg-[#25262b] rounded-lg border border-[#373A40] mb-6 overflow-x-auto">
      {TABS.map((tab) => (
        <button
          key={tab.id}
          onClick={() => onTabChange(tab.id)}
          className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-all duration-150 whitespace-nowrap ${
            activeTab === tab.id
              ? "bg-brand-primary text-white"
              : "text-[#909296] hover:text-white hover:bg-white/5"
          }`}
        >
          {tab.icon}
          <span>{tab.label}</span>
        </button>
      ))}
    </div>
  );
}
