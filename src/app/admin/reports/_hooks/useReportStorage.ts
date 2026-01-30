"use client";

import { useEffect, useCallback } from "react";
import type { GoalItem, MilestoneItem } from "../_components";

// 로컬스토리지 키 (대시보드와 동일)
const STORAGE_KEYS = {
  MILESTONES: "dashboard_milestones",
  GOALS: "dashboard_goals",
  REVENUE: "dashboard_revenue",
} as const;

// 수익 데이터 타입
interface RevenueData {
  currentRevenue: number;
  targetRevenue: number;
  monthlyData: Array<{
    month: string;
    current: number;
    target: number;
  }>;
}

// 로컬스토리지 헬퍼
function getFromStorage<T>(key: string, defaultValue: T): T {
  if (typeof window === "undefined") return defaultValue;
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : defaultValue;
  } catch {
    return defaultValue;
  }
}

function setToStorage<T>(key: string, value: T): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    console.error("로컬스토리지 저장 실패:", error);
  }
}

/**
 * 목표 데이터를 대시보드와 동기화하는 훅
 */
export function useSyncGoals() {
  const syncGoals = useCallback((goals: GoalItem[]) => {
    setToStorage(STORAGE_KEYS.GOALS, goals);
  }, []);

  const loadGoals = useCallback((): GoalItem[] => {
    return getFromStorage<GoalItem[]>(STORAGE_KEYS.GOALS, []);
  }, []);

  return { syncGoals, loadGoals };
}

/**
 * 마일스톤 데이터를 대시보드와 동기화하는 훅
 */
export function useSyncMilestones() {
  const syncMilestones = useCallback((milestones: MilestoneItem[]) => {
    setToStorage(STORAGE_KEYS.MILESTONES, milestones);
  }, []);

  const loadMilestones = useCallback((): MilestoneItem[] => {
    return getFromStorage<MilestoneItem[]>(STORAGE_KEYS.MILESTONES, []);
  }, []);

  return { syncMilestones, loadMilestones };
}

/**
 * 수익 데이터를 대시보드와 동기화하는 훅
 */
export function useSyncRevenue() {
  const syncRevenue = useCallback((data: { currentRevenue: number; targetRevenue: number }) => {
    const existing = getFromStorage<RevenueData>(STORAGE_KEYS.REVENUE, {
      currentRevenue: 0,
      targetRevenue: 0,
      monthlyData: [],
    });

    setToStorage(STORAGE_KEYS.REVENUE, {
      ...existing,
      currentRevenue: data.currentRevenue,
      targetRevenue: data.targetRevenue,
    });
  }, []);

  const loadRevenue = useCallback((): RevenueData => {
    return getFromStorage<RevenueData>(STORAGE_KEYS.REVENUE, {
      currentRevenue: 0,
      targetRevenue: 0,
      monthlyData: [],
    });
  }, []);

  return { syncRevenue, loadRevenue };
}

export { STORAGE_KEYS };
export type { RevenueData };
