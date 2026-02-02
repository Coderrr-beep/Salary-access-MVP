"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";

/**
 * Animated donut / pie chart with cool loading animation
 */
export function AnimatedDonutChart({
  value = 0,
  max = 100,
  size = 140,
  strokeWidth = 14,
  label,
  color = "#22c55e",
  secondaryColor = "#1f2937",
}) {
  const [isLoaded, setIsLoaded] = useState(false);
  const safeMax = max <= 0 ? 1 : max;
  const progress = Math.min(Math.max(value / safeMax, 0), 1);

  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const dashArray = circumference.toFixed(2);
  const dashOffset = (circumference * (1 - progress)).toFixed(2);

  const percentage = Math.round(progress * 100);

  useEffect(() => {
    // Trigger loading animation after mount
    const timer = setTimeout(() => setIsLoaded(true), 100);
    return () => clearTimeout(timer);
  }, []);

  return (
    <motion.div
      className="relative flex items-center justify-center"
      style={{ width: size, height: size }}
      initial={{ scale: 0, rotate: -180 }}
      animate={{ scale: 1, rotate: 0 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
    >
      <svg width={size} height={size} className="-rotate-90">
        {/* Background ring */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={secondaryColor}
          strokeWidth={strokeWidth}
          fill="transparent"
        />

        {/* Animated progress ring with spinning effect */}
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={color}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={dashArray}
          fill="transparent"
          initial={{ strokeDashoffset: dashArray, opacity: 0 }}
          animate={{ 
            strokeDashoffset: isLoaded ? dashOffset : dashArray,
            opacity: isLoaded ? 1 : 0
          }}
          transition={{ 
            duration: 1.5, 
            ease: [0.43, 0.13, 0.23, 0.96],
            delay: 0.3
          }}
        />

        {/* Glowing effect */}
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={color}
          strokeWidth={strokeWidth * 0.3}
          strokeLinecap="round"
          strokeDasharray={dashArray}
          fill="transparent"
          opacity={0.3}
          initial={{ strokeDashoffset: dashArray, rotate: 0 }}
          animate={{ 
            strokeDashoffset: isLoaded ? dashOffset : dashArray,
            rotate: isLoaded ? 360 : 0
          }}
          transition={{ 
            duration: 2,
            ease: "linear",
            repeat: Infinity
          }}
        />
      </svg>

      {/* Center label with fade-in */}
      <motion.div 
        className="absolute inset-0 flex flex-col items-center justify-center"
        initial={{ opacity: 0, scale: 0.5 }}
        animate={{ opacity: isLoaded ? 1 : 0, scale: isLoaded ? 1 : 0.5 }}
        transition={{ duration: 0.5, delay: 0.8 }}
      >
        <span className="text-2xl font-semibold text-white">
          {percentage}
          <span className="text-xs text-gray-400">%</span>
        </span>
        {label && (
          <span className="mt-1 text-[11px] text-gray-400 text-center px-2">
            {label}
          </span>
        )}
      </motion.div>
    </motion.div>
  );
}

/**
 * Cool animated vertical bar chart with loading effects
 */
export function AnimatedBarChart({ data = [], maxValue, height = 160 }) {
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoaded(true), 200);
    return () => clearTimeout(timer);
  }, []);

  if (!data || data.length === 0) return null;

  const computedMax =
    typeof maxValue === "number"
      ? maxValue
      : Math.max(...data.map((d) => d.value || 0), 1);

  return (
    <motion.div 
      className="w-full"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <div className="flex items-end gap-4" style={{ height: `${height}px` }}>
        {data.map((item, idx) => {
          const value = item.value || 0;
          const heightPct = `${Math.max(
            8,
            Math.min(100, (value / computedMax) * 100)
          ).toFixed(0)}%`;

          return (
            <motion.div
              key={item.label || idx}
              className="flex-1 flex flex-col items-center justify-end"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: idx * 0.1, duration: 0.4 }}
            >
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ 
                  height: isLoaded ? heightPct : 0, 
                  opacity: isLoaded ? 1 : 0 
                }}
                transition={{
                  duration: 1.2,
                  delay: 0.3 + idx * 0.15,
                  ease: [0.43, 0.13, 0.23, 0.96],
                }}
                className="w-full rounded-t-xl relative overflow-hidden group hover:scale-105 transition-transform"
                style={{
                  background: `linear-gradient(to top, ${item.color || "#22c55e"}, ${item.color || "#22c55e"}80)`,
                  boxShadow: `0 4px 20px ${item.color || "#22c55e"}40`,
                }}
              >
                {/* Shimmer effect */}
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
                  initial={{ x: "-100%" }}
                  animate={{ x: isLoaded ? "200%" : "-100%" }}
                  transition={{
                    duration: 2,
                    delay: 1 + idx * 0.2,
                    repeat: Infinity,
                    repeatDelay: 3,
                  }}
                />
                
                {/* Value label on bar */}
                {isLoaded && value > 0 && (
                  <motion.div
                    className="absolute -top-6 left-1/2 transform -translate-x-1/2 text-xs font-bold text-white whitespace-nowrap"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 1 + idx * 0.15 }}
                  >
                    {typeof value === "number" ? value.toLocaleString() : value}
                  </motion.div>
                )}
              </motion.div>
              
              <motion.div 
                className="mt-3 text-center"
                initial={{ opacity: 0 }}
                animate={{ opacity: isLoaded ? 1 : 0 }}
                transition={{ delay: 0.8 + idx * 0.1 }}
              >
                <div className="text-xs font-medium text-gray-300 truncate max-w-[5rem]">
                  {item.label}
                </div>
              </motion.div>
            </motion.div>
          );
        })}
      </div>
    </motion.div>
  );
}

