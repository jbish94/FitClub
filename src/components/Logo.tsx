interface LogoProps {
  size?: number;
  className?: string;
}

export function Logo({ size = 120, className = '' }: LogoProps) {
  return (
    <svg 
      width={size} 
      height={size} 
      viewBox="0 0 120 120" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      {/* Outer circle with gradient */}
      <circle cx="60" cy="60" r="58" fill="url(#gradient1)" />
      
      {/* Inner circle */}
      <circle cx="60" cy="60" r="50" fill="white" opacity="0.2" />
      
      {/* People/Community icons arranged in a circle */}
      {/* Person 1 - Top */}
      <g transform="translate(60, 25)">
        <circle cx="0" cy="0" r="6" fill="white" />
        <circle cx="0" cy="12" r="8" fill="white" />
      </g>
      
      {/* Person 2 - Top Right */}
      <g transform="translate(82, 38)">
        <circle cx="0" cy="0" r="5" fill="white" opacity="0.9" />
        <circle cx="0" cy="10" r="7" fill="white" opacity="0.9" />
      </g>
      
      {/* Person 3 - Right */}
      <g transform="translate(88, 60)">
        <circle cx="0" cy="0" r="5" fill="white" opacity="0.8" />
        <circle cx="0" cy="10" r="7" fill="white" opacity="0.8" />
      </g>
      
      {/* Person 4 - Bottom Right */}
      <g transform="translate(78, 82)">
        <circle cx="0" cy="0" r="5" fill="white" opacity="0.9" />
        <circle cx="0" cy="10" r="7" fill="white" opacity="0.9" />
      </g>
      
      {/* Person 5 - Bottom Left */}
      <g transform="translate(42, 82)">
        <circle cx="0" cy="0" r="5" fill="white" opacity="0.9" />
        <circle cx="0" cy="10" r="7" fill="white" opacity="0.9" />
      </g>
      
      {/* Person 6 - Left */}
      <g transform="translate(32, 60)">
        <circle cx="0" cy="0" r="5" fill="white" opacity="0.8" />
        <circle cx="0" cy="10" r="7" fill="white" opacity="0.8" />
      </g>
      
      {/* Person 7 - Top Left */}
      <g transform="translate(38, 38)">
        <circle cx="0" cy="0" r="5" fill="white" opacity="0.9" />
        <circle cx="0" cy="10" r="7" fill="white" opacity="0.9" />
      </g>
      
      {/* Gradient definitions */}
      <defs>
        <linearGradient id="gradient1" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#0066FF" />
          <stop offset="100%" stopColor="#50E3C2" />
        </linearGradient>
      </defs>
    </svg>
  );
}
