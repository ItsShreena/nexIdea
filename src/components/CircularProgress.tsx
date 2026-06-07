import React from 'react';

interface CircularProgressProps {
  score: number; // 0 to 10
  size?: number;
  strokeWidth?: number;
}

export default function CircularProgress({
  score,
  size = 180,
  strokeWidth = 14
}: CircularProgressProps) {
  const percentage = Math.max(0, Math.min(100, score * 10)); // Scale to 100
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  return (
    <div className="relative flex items-center justify-center" style={{ width: size, height: size }}>
      {/* Background glow circle */}
      <div className="absolute inset-0 rounded-full bg-brand-orange/5 blur-xl animate-pulse-slow"></div>

      <svg className="transform -rotate-90" width={size} height={size}>
        <defs>
          <linearGradient id="scoreGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FF8C42" />
            <stop offset="100%" stopColor="#FF6B00" />
          </linearGradient>
        </defs>
        
        {/* Background Ring */}
        <circle
          className="text-white/5"
          stroke="currentColor"
          strokeWidth={strokeWidth}
          fill="transparent"
          r={radius}
          cx={size / 2}
          cy={size / 2}
        />
        
        {/* Progress Circular Stroke */}
        <circle
          stroke="url(#scoreGradient)"
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          fill="transparent"
          r={radius}
          cx={size / 2}
          cy={size / 2}
          style={{ transition: 'stroke-dashoffset 1s ease-out' }}
        />
      </svg>

      {/* Floating Center Score Typography */}
      <div className="absolute flex flex-col items-center justify-center text-center">
        <span className="font-display text-4xl font-bold text-white tracking-tighter">
          {score.toFixed(1)}
        </span>
        <span className="text-[10px] uppercase tracking-wider text-brand-secondary font-mono">
          Startup Score
        </span>
      </div>
    </div>
  );
}
