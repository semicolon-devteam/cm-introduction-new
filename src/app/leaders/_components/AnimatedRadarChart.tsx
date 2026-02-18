"use client";

import { useEffect, useState } from "react";
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, ResponsiveContainer } from "recharts";

interface TechnicalSkill {
  name: string;
  level: number;
}

interface AnimatedRadarChartProps {
  technicalSkills: TechnicalSkill[];
  delay?: number;
  isVisible?: boolean;
}

export function AnimatedRadarChart({
  technicalSkills,
  delay = 0,
  isVisible = true,
}: AnimatedRadarChartProps) {
  const [animationProgress, setAnimationProgress] = useState(0);

  useEffect(() => {
    if (!isVisible) return;

    const startTime = Date.now();
    const duration = 1000;

    const animate = () => {
      const elapsed = Date.now() - startTime - delay;
      if (elapsed < 0) {
        requestAnimationFrame(animate);
        return;
      }

      const progress = Math.min(elapsed / duration, 1);
      // Ease out cubic
      const eased = 1 - Math.pow(1 - progress, 3);

      setAnimationProgress(eased);

      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };

    requestAnimationFrame(animate);
  }, [isVisible, delay]);

  const data = technicalSkills.map((skill) => ({
    subject: skill.name,
    value: skill.level * animationProgress,
    fullMark: 100,
  }));

  return (
    <div className="w-full h-[220px]">
      <ResponsiveContainer width="100%" height="100%">
        <RadarChart cx="50%" cy="50%" outerRadius="70%" data={data}>
          <PolarGrid stroke="#2a2a4a" />
          <PolarAngleAxis dataKey="subject" tick={{ fill: "#9ca3af", fontSize: 11 }} />
          <Radar
            name="기술력"
            dataKey="value"
            stroke="#068FFF"
            fill="#068FFF"
            fillOpacity={0.3}
            strokeWidth={2}
          />
        </RadarChart>
      </ResponsiveContainer>
    </div>
  );
}
