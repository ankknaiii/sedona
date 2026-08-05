/** Sedona-styled furniture glyphs — decorative objects, not UI chips. */

import { useId } from "react";

function Frame({ children, accent = "#c08a5a", className = "", paint }) {
  return (
    <svg
      className={`furn-art ${className}`}
      viewBox="0 0 80 80"
      aria-hidden="true"
    >
      <defs>
        <linearGradient id={paint.wood} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#efe6dc" />
          <stop offset="100%" stopColor="#d8b48a" />
        </linearGradient>
        <linearGradient id={paint.clay} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#f7f1ea" />
          <stop offset="100%" stopColor={accent} />
        </linearGradient>
        <radialGradient id={paint.glow} cx="50%" cy="35%" r="55%">
          <stop offset="0%" stopColor="#ffe0b8" stopOpacity="0.85" />
          <stop offset="100%" stopColor={accent} stopOpacity="0" />
        </radialGradient>
      </defs>
      <rect
        x="2"
        y="2"
        width="76"
        height="76"
        rx="18"
        fill={`url(#${paint.wood})`}
        opacity="0.35"
      />
      {children}
    </svg>
  );
}

const SHAPES = {
  journal: (a) => (
    <>
      <rect x="22" y="16" width="36" height="48" rx="3" fill="#6f4f40" />
      <rect x="26" y="18" width="30" height="44" rx="2" fill="#fffaf5" />
      <path d="M30 28h22M30 36h18M30 44h20" stroke={a} strokeWidth="1.6" strokeLinecap="round" />
      <rect x="20" y="16" width="6" height="48" rx="1.5" fill={a} />
    </>
  ),
  bookcase: (a) => (
    <>
      <rect x="18" y="12" width="44" height="56" rx="3" fill="#5c4033" />
      <rect x="21" y="16" width="38" height="12" rx="1" fill="#d8b48a" />
      <rect x="21" y="32" width="38" height="12" rx="1" fill="#c08a5a" />
      <rect x="21" y="48" width="38" height="12" rx="1" fill="#a47864" />
      <rect x="24" y="18" width="6" height="8" fill="#fffaf5" opacity="0.7" />
      <rect x="40" y="34" width="5" height="8" fill="#fffaf5" opacity="0.55" />
      <rect x="30" y="50" width="7" height="8" fill={a} opacity="0.8" />
    </>
  ),
  lamp: (a, p) => (
    <>
      <ellipse cx="40" cy="28" rx="16" ry="10" fill={`url(#${p.glow})`} />
      <path d="M28 30c0-10 6-16 12-16s12 6 12 16" fill={a} />
      <rect x="37" y="30" width="6" height="26" rx="2" fill="#6f4f40" />
      <ellipse cx="40" cy="58" rx="14" ry="4" fill="#8b6248" />
      <circle cx="40" cy="24" r="3.5" fill="#ffe0b8" />
    </>
  ),
  bowls: (a, p) => (
    <>
      <ellipse cx="24" cy="48" rx="10" ry="5" fill="#8b6248" />
      <path d="M14 48c0-8 5-14 10-14s10 6 10 14" fill={`url(#${p.clay})`} />
      <ellipse cx="40" cy="42" rx="11" ry="5.5" fill="#6f4f40" />
      <path d="M29 42c0-9 5-15 11-15s11 6 11 15" fill={a} />
      <ellipse cx="56" cy="50" rx="9" ry="4.5" fill="#8b6248" />
      <path d="M47 50c0-7 4-12 9-12s9 5 9 12" fill="#d8b48a" />
    </>
  ),
  telescope: (a) => (
    <>
      <rect x="18" y="54" width="44" height="6" rx="2" fill="#6f4f40" />
      <path d="M26 54 L40 28 L48 30 L34 56Z" fill={a} />
      <circle cx="50" cy="28" r="8" fill="#2a211c" />
      <circle cx="50" cy="28" r="5" fill="#efe6dc" />
      <circle cx="50" cy="28" r="2" fill={a} />
      <line x1="30" y1="56" x2="22" y2="66" stroke="#5c4033" strokeWidth="3" />
      <line x1="38" y1="56" x2="46" y2="66" stroke="#5c4033" strokeWidth="3" />
    </>
  ),
  screen: (a) => (
    <>
      <rect x="16" y="14" width="14" height="52" rx="2" fill="#efe6dc" stroke={a} strokeWidth="1.5" />
      <rect x="33" y="14" width="14" height="52" rx="2" fill="#fffaf5" stroke={a} strokeWidth="1.5" opacity="0.85" />
      <rect x="50" y="14" width="14" height="52" rx="2" fill="#efe6dc" stroke={a} strokeWidth="1.5" />
      <path d="M20 22c4 6 6 14 6 22M37 20c4 8 6 16 6 26M54 24c3 6 5 14 5 20" stroke={a} strokeOpacity="0.35" fill="none" />
    </>
  ),
  gauge: (a) => (
    <>
      <circle cx="40" cy="40" r="24" fill="#fffaf5" stroke="#6f4f40" strokeWidth="3" />
      <circle cx="40" cy="40" r="18" fill="none" stroke={a} strokeWidth="2" strokeDasharray="4 3" />
      <path d="M40 40 L52 28" stroke="#b55b4a" strokeWidth="2.5" strokeLinecap="round" />
      <circle cx="40" cy="40" r="3" fill="#2a211c" />
      <text x="40" y="58" textAnchor="middle" fontSize="7" fill="#6f4f40" fontFamily="serif">
        IG
      </text>
    </>
  ),
  seal: (a) => (
    <>
      <circle cx="40" cy="36" r="18" fill={a} />
      <circle cx="40" cy="36" r="12" fill="#fffaf5" opacity="0.25" />
      <path d="M40 22l3 8h8l-6.5 5 2.5 8L40 38l-7.5 5 2.5-8L28 30h8z" fill="#fffaf5" />
      <rect x="36" y="52" width="8" height="14" rx="1" fill="#6f4f40" />
    </>
  ),
  scale: (a) => (
    <>
      <rect x="38" y="18" width="4" height="40" rx="1" fill="#6f4f40" />
      <path d="M20 34h40" stroke="#6f4f40" strokeWidth="2.5" />
      <path d="M20 34c0 8 4 14 10 14s10-6 10-14" fill="none" stroke={a} strokeWidth="2" />
      <path d="M40 34c0 8 4 14 10 14s10-6 10-14" fill="none" stroke={a} strokeWidth="2" />
      <ellipse cx="30" cy="48" rx="10" ry="3" fill="#d8b48a" />
      <ellipse cx="50" cy="48" rx="10" ry="3" fill="#c08a5a" />
      <circle cx="40" cy="18" r="3" fill={a} />
    </>
  ),
  hourglass: (a) => (
    <>
      <rect x="26" y="14" width="28" height="6" rx="2" fill="#6f4f40" />
      <rect x="26" y="60" width="28" height="6" rx="2" fill="#6f4f40" />
      <path d="M30 20c0 12 10 14 10 20s-10 8-10 20h20c0-12-10-14-10-20s10-8 10-20z" fill={a} opacity="0.85" />
      <path d="M34 28h12M36 52h8" stroke="#fffaf5" strokeOpacity="0.5" strokeWidth="1.5" />
    </>
  ),
  clamps: (a) => (
    <>
      <rect x="18" y="30" width="44" height="10" rx="2" fill="#6f4f40" />
      <rect x="22" y="20" width="8" height="40" rx="2" fill={a} />
      <rect x="50" y="20" width="8" height="40" rx="2" fill={a} />
      <rect x="28" y="36" width="24" height="4" rx="1" fill="#d8b48a" />
      <circle cx="26" cy="22" r="3" fill="#2a211c" />
      <circle cx="54" cy="22" r="3" fill="#2a211c" />
    </>
  ),
  stone: (a) => (
    <>
      <ellipse cx="40" cy="50" rx="22" ry="8" fill="#8b6248" opacity="0.35" />
      <path
        d="M18 46c2-16 14-28 22-28s20 10 24 26c-6 8-14 12-24 12s-18-4-22-10z"
        fill={a}
      />
      <path d="M28 36c6-2 12 0 18 4" stroke="#fffaf5" strokeOpacity="0.25" fill="none" strokeWidth="2" />
    </>
  ),
  loupe: (a) => (
    <>
      <circle cx="34" cy="34" r="16" fill="none" stroke={a} strokeWidth="4" />
      <circle cx="34" cy="34" r="11" fill="#efe6dc" opacity="0.55" />
      <path d="M46 46 L62 62" stroke="#6f4f40" strokeWidth="5" strokeLinecap="round" />
      <rect x="16" y="58" width="28" height="8" rx="2" fill="#d8b48a" />
    </>
  ),
  spool: (a) => (
    <>
      <rect x="28" y="18" width="24" height="44" rx="4" fill="#efe6dc" stroke="#6f4f40" strokeWidth="2" />
      <ellipse cx="40" cy="18" rx="12" ry="5" fill={a} />
      <ellipse cx="40" cy="62" rx="12" ry="5" fill={a} />
      <path
        d="M22 34c8 4 28 4 36 0M20 42c10 5 30 5 40 0M24 50c8 3 24 3 32 0"
        stroke={a}
        strokeWidth="2"
        fill="none"
        strokeLinecap="round"
      />
    </>
  ),
};

export default function FurnitureArt({ shape, accent, className }) {
  const id = useId().replace(/:/g, "");
  const paint = { wood: `fw${id}`, clay: `fc${id}`, glow: `fg${id}` };
  const draw = SHAPES[shape] || SHAPES.journal;
  return (
    <Frame accent={accent} className={className} paint={paint}>
      {draw(accent, paint)}
    </Frame>
  );
}
