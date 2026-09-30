/**
 * Top-down mid-engine supercar, drawn as vector so it stays crisp at any size
 * and costs one inlined element rather than a bitmap request.
 *
 * Geometry (viewBox 560 x 246, nose pointing +x):
 *   - centre line is y = 123
 *   - wheel centres sit ~79 units either side of it, which `--axle` mirrors so
 *     the tyre tracks line up with the wheels that laid them
 *
 * The dark areas are one continuous spine — rear louvres, engine cover, cabin,
 * windscreen — with the orange wrapping it as fenders, nose and tail. Drawn as
 * separate dark islands instead, the same shapes read as stickers on a blob.
 * Shading is gradient-only across the full height, since banded overlays leave
 * a visible seam at this scale.
 */
const BODY_PATH = `M30 56
  C30 45 46 37 78 34
  C104 30 126 26 150 26
  C186 26 214 28 240 28
  C272 28 300 26 330 26
  C364 26 386 30 404 35
  C428 41 448 50 462 58
  C482 68 498 72 512 82
  C526 94 536 108 536 123
  C536 138 526 152 512 164
  C498 174 482 178 462 188
  C448 196 428 205 404 211
  C386 216 364 220 330 220
  C300 220 272 218 240 218
  C214 218 186 220 150 220
  C126 220 104 216 78 212
  C46 209 30 201 30 190 Z`;

export function RaceCar({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 560 246"
      className={className}
      aria-hidden="true"
      focusable="false"
    >
      <defs>
        <linearGradient id="izBody" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#FFB264" />
          <stop offset="0.32" stopColor="#F68B21" />
          <stop offset="0.74" stopColor="#DD6910" />
          <stop offset="1" stopColor="#A84C08" />
        </linearGradient>
        <linearGradient id="izSheen" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#FFFFFF" stopOpacity="0.32" />
          <stop offset="0.4" stopColor="#FFFFFF" stopOpacity="0.05" />
          <stop offset="1" stopColor="#FFFFFF" stopOpacity="0" />
        </linearGradient>
        <linearGradient id="izShade" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#7E3604" stopOpacity="0" />
          <stop offset="0.58" stopColor="#7E3604" stopOpacity="0" />
          <stop offset="1" stopColor="#7E3604" stopOpacity="0.34" />
        </linearGradient>
        <linearGradient id="izGlass" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#50505C" />
          <stop offset="0.38" stopColor="#23232B" />
          <stop offset="1" stopColor="#101015" />
        </linearGradient>
        <clipPath id="izBodyClip">
          <path d={BODY_PATH} />
        </clipPath>
        {/*
          Directional blur: stdDeviation is driven on the x axis only, so fast
          scrolling smears the car along its line of travel rather than fogging
          it uniformly. Held at 0 while idle.
        */}
        <filter
          id="izBlur"
          x="-30%"
          y="-15%"
          width="160%"
          height="130%"
          colorInterpolationFilters="sRGB"
        >
          <feGaussianBlur data-blur="" stdDeviation="0 0" />
        </filter>
      </defs>

      <g filter="url(#izBlur)">
        {/* Mirrors are drawn under the body, so the arm reads as tucked into it */}
        <path d="M322 28 L350 10 L359 23 L333 38 Z" fill="#E4770F" />
        <path d="M322 218 L350 236 L359 223 L333 208 Z" fill="#9F4707" />

        {/* Rear wing */}
        <path d="M42 26 C18 47 6 84 6 123 C6 162 18 199 42 220 Z" fill="#1E1E24" />
        <path
          d="M40 52 C24 68 16 94 16 123 C16 152 24 178 40 194"
          fill="none"
          stroke="#4D4D5A"
          strokeWidth="3"
          opacity="0.55"
        />

        <path d={BODY_PATH} fill="url(#izBody)" />

        <g clipPath="url(#izBodyClip)">
          <rect x="0" y="0" width="560" height="246" fill="url(#izSheen)" />
          <rect x="0" y="0" width="560" height="246" fill="url(#izShade)" />

          {/* One continuous dark spine, tail to windscreen */}
          <path
            d="M60 78
               C51 92 48 107 48 123
               C48 139 51 154 60 168
               C88 180 126 185 172 184
               C218 183 268 188 314 184
               C356 180 396 170 420 152
               C432 143 438 133 438 123
               C438 113 432 103 420 94
               C396 76 356 66 314 62
               C268 58 218 63 172 62
               C126 61 88 66 60 78 Z"
            fill="#1C1C22"
          />

          {/* Engine louvres sit in the spine's tail */}
          {[
            [64, 60],
            [80, 72],
            [96, 78],
            [112, 72],
            [128, 60],
          ].map(([x, h]) => (
            <rect
              key={x}
              x={x}
              y={123 - h / 2}
              width="8"
              height={h}
              rx="4"
              fill="#3E3E4A"
              opacity="0.68"
            />
          ))}

          {/* Cabin glass, nested inside the spine */}
          <path
            d="M254 70 C294 66 338 74 374 88 C400 98 420 110 430 123
               C420 136 400 148 374 158 C338 172 294 180 254 176 L248 123 Z"
            fill="url(#izGlass)"
          />
          <path
            d="M262 80 C296 76 334 84 364 96 L370 123 L364 150 C334 162 296 170 262 166 Z"
            fill="#50505C"
            opacity="0.3"
          />
          <path
            d="M352 92 C382 102 404 112 418 123 C404 134 382 144 352 154"
            fill="none"
            stroke="#9A9AA6"
            strokeWidth="9"
            strokeLinecap="round"
            opacity="0.17"
          />

          {/* Front fender vents */}
          <path
            d="M424 54 C444 62 460 72 472 82 L468 90 C456 80 440 70 420 62 Z"
            fill="#16161A"
          />
          <path
            d="M424 192 C444 184 460 174 472 164 L468 156 C456 166 440 176 420 184 Z"
            fill="#16161A"
          />
        </g>
      </g>
    </svg>
  );
}
