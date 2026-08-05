'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

interface ConfidenceMeterProps {
  value: number;
  size?: number;
  strokeWidth?: number;
  className?: string;
}

function getConfidenceColor(value: number): { stroke: string; text: string } {
  if (value >= 80) return { stroke: '#fff', text: 'text-white' };
  if (value >= 60) return { stroke: '#ccc', text: 'text-gray-300' };
  if (value >= 40) return { stroke: '#888', text: 'text-gray-400' };
  return { stroke: '#555', text: 'text-gray-500' };
}

function getConfidenceLabel(value: number): string {
  if (value >= 80) return 'High';
  if (value >= 60) return 'Moderate';
  if (value >= 40) return 'Low';
  return 'Very Low';
}

export default function ConfidenceMeter({
  value,
  size = 48,
  strokeWidth = 4,
  className,
}: ConfidenceMeterProps) {
  const [animatedValue, setAnimatedValue] = useState(0);
  const { stroke, text } = getConfidenceColor(value);
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (animatedValue / 100) * circumference;

  useEffect(() => {
    let raf: number;
    const start = performance.now();
    const duration = 800;

    const animate = (now: number) => {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setAnimatedValue(Math.round(eased * value));
      if (progress < 1) raf = requestAnimationFrame(animate);
    };

    raf = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(raf);
  }, [value]);

  return (
    <div className={`inline-flex items-center gap-2 ${className ?? ''}`}>
      <div className="relative" style={{ width: size, height: size }}>
        <svg
          width={size}
          height={size}
          className="-rotate-90"
        >
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke="currentColor"
            strokeWidth={stroke}
            className="text-white/10"
          />
          <motion.circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke={stroke}
            strokeWidth={stroke}
            strokeLinecap="round"
            strokeDasharray={circumference}
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset: offset }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className={`text-xs font-bold ${text}`}>
            {animatedValue}%
          </span>
        </div>
      </div>
      <div className="flex flex-col">
        <span className={`text-xs font-semibold ${text}`}>
          {getConfidenceLabel(value)}
        </span>
        <span className="text-[10px] text-gray-600 leading-none">confidence</span>
      </div>
    </div>
  );
}
