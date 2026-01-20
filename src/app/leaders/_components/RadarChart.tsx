/* eslint-disable react/forbid-elements */

interface TechnicalSkill {
  name: string;
  level: number;
}

interface RadarChartProps {
  technicalSkills: TechnicalSkill[];
}

export function RadarChart({ technicalSkills }: RadarChartProps) {
  return (
    <div className="relative w-full aspect-square max-w-[280px] mx-auto">
      <svg viewBox="-60 -25 320 270" className="w-full h-full">
        {/* Pentagon background */}
        <polygon
          points="100,20 180,70 155,160 45,160 20,70"
          fill="none"
          stroke="#1a1a2e"
          strokeWidth="1"
        />
        <polygon
          points="100,45 155,80 140,140 60,140 45,80"
          fill="none"
          stroke="#1a1a2e"
          strokeWidth="1"
        />
        <polygon
          points="100,70 130,90 120,120 80,120 70,90"
          fill="none"
          stroke="#1a1a2e"
          strokeWidth="1"
        />
        {/* Data polygon */}
        <polygon
          points="100,35 160,75 145,145 55,145 40,75"
          fill="rgba(6, 143, 255, 0.3)"
          stroke="#068FFF"
          strokeWidth="2"
        />
        {/* Labels */}
        <text x="100" y="-5" textAnchor="middle" fill="#888" fontSize="14">
          {technicalSkills[0]?.name || ""}
        </text>
        <text x="200" y="75" textAnchor="start" fill="#888" fontSize="14">
          {technicalSkills[1]?.name || ""}
        </text>
        <text x="170" y="190" textAnchor="middle" fill="#888" fontSize="14">
          {technicalSkills[2]?.name || ""}
        </text>
        <text x="30" y="190" textAnchor="middle" fill="#888" fontSize="14">
          {technicalSkills[3]?.name || ""}
        </text>
        <text x="0" y="75" textAnchor="end" fill="#888" fontSize="14">
          {technicalSkills[4]?.name || ""}
        </text>
      </svg>
    </div>
  );
}
