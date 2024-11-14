import React from 'react';
import { formatDuration } from '../utils/timeFormat';

interface CircleTimerProps {
  radius: number;
  progress: number;
  color: string;
  label: string;
  time: number;
  total: number;
  showTotal: boolean;
}

export default function CircleTimer({
  radius,
  progress,
  color,
  label,
  time,
  total,
  showTotal,
}: CircleTimerProps) {
  const circumference = 2 * Math.PI * radius;
  // Ensure progress is between 0 and 100, defaulting to 100 if invalid
  const validProgress = !isNaN(progress) && isFinite(progress) ? 
    Math.max(0, Math.min(100, progress)) : 100;
  const strokeDashoffset = circumference - (validProgress / 100) * circumference;

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="relative w-64 h-64">
      <svg className="w-full h-full transform -rotate-90">
        {/* Background circle */}
        <circle
          cx="128"
          cy="128"
          r={radius}
          stroke="rgba(255,255,255,0.1)"
          strokeWidth="12"
          fill="none"
        />
        {/* Progress circle */}
        <circle
          cx="128"
          cy="128"
          r={radius}
          stroke={color}
          strokeWidth="12"
          fill="none"
          strokeLinecap="round"
          style={{
            strokeDasharray: `${circumference}px`,
            strokeDashoffset: `${strokeDashoffset}px`,
            transition: 'stroke-dashoffset 0.5s ease',
          }}
        />
      </svg>
      
      {/* Timer display */}
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <div className="text-5xl font-bold mb-2" style={{ color }}>
          {formatTime(Math.max(0, time))}
        </div>
        <div className="text-white/70 text-lg">
          {label}
          {showTotal && ` • ${formatDuration(Math.max(0, total))}`}
        </div>
      </div>
    </div>
  );
}