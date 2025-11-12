
"use client"

import { useEffect, useState } from "react"

interface SentimentGaugeProps {
  label: string
  subtitle: string
  value: number // 0-100
  color: string
}

export function SentimentGauge({ label, subtitle, value, color }: SentimentGaugeProps) {
  const [displayValue, setDisplayValue] = useState(0)

  // Animate value on mount
  useEffect(() => {
    const timer = setTimeout(() => {
      setDisplayValue(value)
    }, 100)
    return () => clearTimeout(timer)
  }, [value])

  // Calculate rotation for the needle (-90 to 90 degrees)
  const rotation = (displayValue / 100) * 180 - 90

  // Determine sentiment
  const getSentiment = (val: number) => {
    if (val >= 70) return { text: "Bullish", color: "text-green-500" }
    if (val >= 40) return { text: "Neutral", color: "text-yellow-500" }
    return { text: "Bearish", color: "text-red-500" }
  }

  const sentiment = getSentiment(value)

  return (
    <div className="flex flex-col items-center">
      <div className="relative w-full aspect-square max-w-[200px]">
        {/* Background Arc */}
        <svg className="w-full h-full" viewBox="0 0 200 120">
          {/* Red to Green gradient arc */}
          <defs>
            <linearGradient id={`gauge-gradient-${label}`} x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="rgb(239, 68, 68)" />
              <stop offset="50%" stopColor="rgb(234, 179, 8)" />
              <stop offset="100%" stopColor="rgb(34, 197, 94)" />
            </linearGradient>
          </defs>

          {/* Background arc */}
          <path
            d="M 20 100 A 80 80 0 0 1 180 100"
            fill="none"
            stroke="hsl(var(--border))"
            strokeWidth="12"
            strokeLinecap="round"
          />
