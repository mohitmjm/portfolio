const LogoMM = ({ size = 40 }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 120 120"
    xmlns="http://www.w3.org/2000/svg"
    aria-label="Mohit Mohatkar logo"
  >
    <defs>
      <linearGradient id="logoBg" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#4f46e5" />
        <stop offset="100%" stopColor="#0f172a" />
      </linearGradient>
    </defs>
    <rect width="120" height="120" rx="26" fill="url(#logoBg)" />
    {/* Top M — lavender */}
    <text
      x="60" y="56"
      textAnchor="middle"
      fontFamily="Outfit, sans-serif"
      fontWeight="800"
      fontSize="42"
      fill="#c4b5fd"
    >
      M
    </text>
    {/* Bottom M — cyan */}
    <text
      x="60" y="96"
      textAnchor="middle"
      fontFamily="Outfit, sans-serif"
      fontWeight="800"
      fontSize="42"
      fill="#22d3ee"
    >
      M
    </text>
  </svg>
)

export default LogoMM
