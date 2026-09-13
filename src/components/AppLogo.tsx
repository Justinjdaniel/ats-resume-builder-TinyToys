import React from "react";

interface AppLogoProps {
  className?: string;
  size?: number;
}

export const AppLogo: React.FC<AppLogoProps> = ({
  className = "w-8 h-8",
  size = 32,
}) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 64 64"
      width={size}
      height={size}
      fill="none"
      className={className}
      aria-label="CurateCV Logo"
    >
      <defs>
        {/* Document Card Background */}
        <linearGradient
          id="docGradLogo"
          x1="14"
          y1="8"
          x2="50"
          y2="56"
          gradientUnits="userSpaceOnUse"
        >
          <stop offset="0%" stopColor="#FFFFFF" />
          <stop offset="100%" stopColor="#F8FAFC" />
        </linearGradient>

        {/* Curated AI Accent Badge */}
        <linearGradient
          id="accentGradLogo"
          x1="38"
          y1="38"
          x2="58"
          y2="58"
          gradientUnits="userSpaceOnUse"
        >
          <stop offset="0%" stopColor="#6366F1" />
          <stop offset="100%" stopColor="#0EA5E9" />
        </linearGradient>

        {/* Soft Ambient Drop Shadow */}
        <filter
          id="cardShadowLogo"
          x="8"
          y="5"
          width="48"
          height="56"
          filterUnits="userSpaceOnUse"
          colorInterpolationFilters="sRGB"
        >
          <feDropShadow
            dx="0"
            dy="3"
            stdDeviation="2.5"
            floodColor="#0F172A"
            floodOpacity="0.12"
          />
        </filter>
      </defs>

      {/* Base Document Sheet */}
      <rect
        x="14"
        y="8"
        width="36"
        height="48"
        rx="5"
        fill="url(#docGradLogo)"
        stroke="#CBD5E1"
        strokeWidth="1.5"
        filter="url(#cardShadowLogo)"
      />

      {/* Profile Header Avatar & Identity Lines */}
      <rect
        x="19"
        y="14"
        width="8"
        height="8"
        rx="2"
        fill="#6366F1"
        opacity="0.15"
      />
      <circle cx="23" cy="17" r="2" fill="#6366F1" />
      <path
        d="M20 21C20 19.8954 20.8954 19 22 19H24C25.1046 19 26 19.8954 26 21V21H20V21Z"
        fill="#6366F1"
      />

      <rect x="30" y="15" width="14" height="2.5" rx="1.25" fill="#0F172A" />
      <rect x="30" y="19.5" width="9" height="2" rx="1" fill="#64748B" />

      {/* Divider Line */}
      <line
        x1="19"
        y1="25"
        x2="45"
        y2="25"
        stroke="#E2E8F0"
        strokeWidth="1"
        strokeLinecap="round"
      />

      {/* Curated ATS Experience Section */}
      <rect x="19" y="28" width="12" height="2" rx="1" fill="#475569" />
      <rect x="19" y="32" width="26" height="1.5" rx="0.75" fill="#94A3B8" />
      <rect x="19" y="35.5" width="21" height="1.5" rx="0.75" fill="#94A3B8" />

      {/* Curated Skills & Education Section */}
      <rect x="19" y="40" width="10" height="2" rx="1" fill="#475569" />
      <rect x="19" y="44" width="17" height="1.5" rx="0.75" fill="#94A3B8" />
      <rect x="19" y="47.5" width="14" height="1.5" rx="0.75" fill="#94A3B8" />

      {/* "Curated" Precision Sparkle Badge (Bottom-Right Overlay) */}
      <g transform="translate(36, 36)">
        <circle
          cx="11"
          cy="11"
          r="10"
          fill="url(#accentGradLogo)"
          stroke="#FFFFFF"
          strokeWidth="2"
        />
        {/* Four-Point Precision Curation Sparkle */}
        <path
          d="M11 5C11 8.3 13.7 11 17 11C13.7 11 11 13.7 11 17C11 13.7 8.3 11 5 11C8.3 11 11 8.3 11 5Z"
          fill="#FFFFFF"
        />
      </g>
    </svg>
  );
};
