const LogoMM = ({ size = 36 }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 120 120"
    xmlns="http://www.w3.org/2000/svg"
    aria-label="Mohit Mohatkar logo"
  >
    <rect width="120" height="120" rx="28" fill="#6366f1" />
    <text
      x="60" y="52"
      textAnchor="middle"
      fontFamily="Outfit, sans-serif"
      fontWeight="800"
      fontSize="38"
      fill="#ffffff"
    >
      M
    </text>
    <line
      x1="28" y1="62"
      x2="92" y2="62"
      stroke="#ffffff"
      strokeWidth="1.5"
      strokeOpacity="0.35"
    />
    <text
      x="60" y="84"
      textAnchor="middle"
      fontFamily="Outfit, sans-serif"
      fontWeight="800"
      fontSize="38"
      fill="#22d3ee"
    >
      M
    </text>
  </svg>
)

export default LogoMM
