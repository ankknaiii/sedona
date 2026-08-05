import { motion } from "framer-motion";

/**
 * L1 glance indicator — readiness-style ring for training signal health.
 * @param {'learning' | 'silent' | 'harmful'} state
 * @param {number} value 0–1 fill amount
 */
export default function SignalRing({
  state = "learning",
  value = 0.72,
  label = "Signal",
  caption = "",
  size = 168,
}) {
  const stroke = 10;
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  const clamped = Math.max(0, Math.min(1, value));
  const offset = c * (1 - clamped);

  return (
    <div className={`signal-ring sem-${state}`} style={{ width: size }}>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        <circle
          className="ring-track"
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          strokeWidth={stroke}
        />
        <motion.circle
          className="ring-value"
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={c}
          initial={false}
          animate={{ strokeDashoffset: offset }}
          transition={{ type: "spring", stiffness: 90, damping: 18 }}
          transform={`rotate(-90 ${size / 2} ${size / 2})`}
        />
      </svg>
      <div className="ring-center">
        <span className="ring-label">{label}</span>
        <strong>{Math.round(clamped * 100)}</strong>
        {caption ? <span className="ring-caption">{caption}</span> : null}
      </div>
    </div>
  );
}
