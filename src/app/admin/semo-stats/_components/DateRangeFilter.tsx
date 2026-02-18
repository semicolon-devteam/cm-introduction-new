"use client";

import { Button } from "@/components/atoms/Button";

import type { DateRange } from "../_api-clients";

interface DateRangeFilterProps {
  value: DateRange;
  onChange: (range: DateRange) => void;
}

const ranges: { value: DateRange; label: string }[] = [
  { value: "7d", label: "7일" },
  { value: "30d", label: "30일" },
  { value: "90d", label: "90일" },
];

export function DateRangeFilter({ value, onChange }: DateRangeFilterProps) {
  return (
    <div className="flex gap-2">
      {ranges.map((range) => (
        <Button
          key={range.value}
          variant={value === range.value ? "default" : "outline"}
          size="sm"
          onClick={() => onChange(range.value)}
        >
          {range.label}
        </Button>
      ))}
    </div>
  );
}
