import type React from "react"

interface LogoProps {
  className?: string
  size?: "sm" | "md" | "lg"
}

export const StarCapitalLogo: React.FC<LogoProps> = ({ className = "", size = "md" }) => {
  // 根据size确定尺寸
  const dimensions = {
    sm: "w-8 h-8",
    md: "w-12 h-12",
    lg: "w-16 h-16",
  }

  const sizeClass = dimensions[size]

  return (
    <div className={`relative ${sizeClass} ${className}`}>
      {/* 使用SVG创建异型logo */}
      <svg viewBox="0 0 100 100" className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
        {/* 定义渐变 */}
        <defs>
          {/* 夜空背景渐变 */}
          <linearGradient id="skyGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#0F2149" />
            <stop offset="100%" stopColor="#1A1B4B" />
          </linearGradient>

          {/* 流星渐变 */}
          <linearGradient id="meteorGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FFD700" />
            <stop offset="100%" stopColor="#FFA500" />
          </linearGradient>

          {/* 流星尾迹渐变 */}
          <linearGradient id="tailGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#FFD700" stopOpacity="0.8" />
            <stop offset="100%" stopColor="#FFD700" stopOpacity="0" />
          </linearGradient>

          {/* 星光效果 */}
          <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="2" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>

        {/* 异型背景 - 夜空 */}
        <path
          d="M10,50 C10,25 25,10 50,10 C75,10 90,25 90,50 C90,75 75,90 50,90 C25,90 10,75 10,50 Z"
          fill="url(#skyGradient)"
        />

        {/* 点缀的小星星 */}
        <circle cx="25" cy="30" r="1" fill="white" opacity="0.7" />
        <circle cx="35" cy="65" r="1.2" fill="white" opacity="0.8" />
        <circle cx="70" cy="25" r="1.5" fill="white" opacity="0.9" />
        <circle cx="80" cy="60" r="1" fill="white" opacity="0.7" />
        <circle cx="60" cy="75" r="1.3" fill="white" opacity="0.8" />
        <circle cx="20" cy="50" r="1" fill="white" opacity="0.6" />

        {/* 流星尾迹 */}
        <path
          d="M15,75 Q40,55 65,35"
          stroke="url(#tailGradient)"
          strokeWidth="6"
          strokeLinecap="round"
          fill="none"
          opacity="0.8"
        />

        {/* 流星主体 */}
        <circle cx="65" cy="35" r="8" fill="url(#meteorGradient)" filter="url(#glow)" />

        {/* 流星光芒 */}
        <path d="M65,27 L67,35 L75,35 L69,40 L71,48 L65,43 L59,48 L61,40 L55,35 L63,35 Z" fill="white" opacity="0.7" />
      </svg>

      {/* 光晕动画效果 */}
      <div className="absolute inset-0 opacity-0 animate-pulse">
        <svg viewBox="0 0 100 100" className="w-full h-full">
          <circle cx="65" cy="35" r="10" fill="rgba(255, 215, 0, 0.3)" />
        </svg>
      </div>
    </div>
  )
}

export default StarCapitalLogo

