"use client"

import { useEffect, useState } from "react"

interface SentimentGaugeProps {
  value: number
  crypto: string
}

export function SentimentGauge({ value, crypto }: SentimentGaugeProps) {
  const [animatedValue, setAnimatedValue] = useState(0)

  useEffect(() => {
    const timer = setTimeout(() => {
      setAnimatedValue(value)
    }, 500)
    return () => clearTimeout(timer)
  }, [value])

  const getSentimentColor = (val: number) => {
    if (val >= 70) return "#10b981" // green
    if (val >= 40) return "#f59e0b" // amber
    return "#ef4444" // red
  }

  const getSentimentLabel = (val: number) => {
    if (val >= 70) return "Bullish"
    if (val >= 40) return "Neutral"
    return "Bearish"
  }

  const rotation = (animatedValue / 100) * 180 - 90
  const color = getSentimentColor(value)
  const label = getSentimentLabel(value)

  return (
    <div className="relative">
      <svg viewBox="0 0 200 120" className="w-full">
        {/* Background arc */}
        <path
          d="M 20 100 A 80 80 0 0 1 180 100"
          fill="none"
          stroke="rgb(51, 65, 85)"
          strokeWidth="12"
          strokeLinecap="round"
        />

        {/* Colored arc */}
        <path
          d="M 20 100 A 80 80 0 0 1 180 100"
          fill="none"
          stroke={color}
          strokeWidth="12"
          strokeLinecap="round"
          strokeDasharray="251.2"
          strokeDashoffset={251.2 - (251.2 * animatedValue) / 100}
          style={{
            transition: "stroke-dashoffset 1.5s ease-out",
          }}
        />

        {/* Needle */}
        <g transform={`rotate(${rotation} 100 100)`} style={{ transition: "transform 1.5s ease-out" }}>
          <line x1="100" y1="100" x2="100" y2="30" stroke={color} strokeWidth="3" strokeLinecap="round" />
          <circle cx="100" cy="100" r="6" fill={color} />
        </g>

        {/* Center circle */}
        <circle cx="100" cy="100" r="8" fill="rgb(15, 23, 42)" />
      </svg>

      {/* Value display */}
      <div className="absolute inset-0 flex flex-col items-center justify-center mt-8">
        <div className="text-4xl font-bold text-white">{animatedValue}%</div>
        <div className="text-sm font-medium mt-1" style={{ color }}>
          {label}
        </div>
      </div>
    </div>
  )
}
