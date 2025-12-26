/**
 * PartTimersSection Component
 *
 * 파트타이머 섹션 (클라이언트 컴포넌트)
 * React Query를 통해 데이터를 가져옴
 */

"use client";

import { usePartTimers } from "../_hooks";

import { PartTimerList } from "./PartTimerList";

export function PartTimersSection() {
  const { data, isLoading, isError, error } = usePartTimers();

  if (isLoading) {
    return (
      <section className="py-12">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Part-timers</h2>
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="h-16 bg-gray-100 rounded-lg animate-pulse"
              />
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (isError) {
    return (
      <section className="py-12">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Part-timers</h2>
          <div className="text-center py-8 text-red-500">
            데이터를 불러오는 중 오류가 발생했습니다.
            {error?.message && (
              <p className="text-sm mt-2">{error.message}</p>
            )}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-12">
      <div className="container mx-auto px-4">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Part-timers</h2>
        <PartTimerList partTimers={data?.partTimers ?? []} />
      </div>
    </section>
  );
}
