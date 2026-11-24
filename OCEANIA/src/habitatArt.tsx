import type { CSSProperties, ReactNode } from "react";
import type { WorldTheme } from "./ambientMusic";

/* Decorative SVG art for the "Mundos submarinos" map and the immersive worlds. */

const delay = (seconds: number): CSSProperties => ({ animationDelay: `${seconds}s` });

/* A curved, rounded stroke that sways from its base (seagrass, anemone arms...). */
function Blade({
  x,
  base,
  height,
  bend,
  width,
  color,
  wait = 0,
  className = "sway",
}: {
  x: number;
  base: number;
  height: number;
  bend: number;
  width: number;
  color: string;
  wait?: number;
  className?: string;
}) {
  const d = `M${x} ${base} C${x + bend * 0.35} ${base - height * 0.35}, ${x - bend * 0.25} ${
    base - height * 0.7
  }, ${x + bend} ${base - height}`;
  return (
    <path
      className={className}
      style={delay(wait)}
      d={d}
      fill="none"
      stroke={color}
      strokeWidth={width}
      strokeLinecap="round"
    />
  );
}

function BranchCoral({
  x,
  y,
  scale = 1,
  color,
}: {
  x: number;
  y: number;
  scale?: number;
  color: string;
}) {
  return (
    <g
      transform={`translate(${x} ${y}) scale(${scale})`}
      stroke={color}
      strokeLinecap="round"
      fill="none"
    >
      <path
        d="M0 0V-70M0-30-24-58M0-48 20-78M-24-58-34-80M-24-58-12-84M20-78 30-96M20-78 8-98"
        strokeWidth="11"
      />
      <g fill="#fff" stroke="none" opacity=".45">
        <circle cx="-30" cy="-78" r="2.5" />
        <circle cx="24" cy="-90" r="2.5" />
        <circle cx="2" cy="-60" r="2.2" />
      </g>
    </g>
  );
}

function BrainCoral({ x, y, r, color }: { x: number; y: number; r: number; color: string }) {
  return (
    <g>
      <path d={`M${x - r} ${y}a${r} ${r * 0.8} 0 0 1 ${r * 2} 0Z`} fill={color} />
      <path
        d={`M${x - r * 0.7} ${y - r * 0.2}c${r * 0.2}-${r * 0.3} ${r * 0.4} ${r * 0.3} ${r * 0.6} 0s${r * 0.4} ${r * 0.3} ${r * 0.6} 0 ${r * 0.3}-${r * 0.3} ${r * 0.4} 0M${x - r * 0.45} ${y - r * 0.5}c${r * 0.2}-${r * 0.25} ${r * 0.4} ${r * 0.25} ${r * 0.55} 0s${r * 0.35} ${r * 0.25} ${r * 0.4} 0`}
        fill="none"
        stroke="#fff"
        strokeOpacity=".45"
        strokeWidth={Math.max(2, r * 0.07)}
        strokeLinecap="round"
      />
    </g>
  );
}

function FanCoral({ x, y, size, color }: { x: number; y: number; size: number; color: string }) {
  const ribs = [-62, -40, -20, 0, 20, 40, 62];
  return (
    <g stroke={color} strokeLinecap="round" fill="none">
      {ribs.map((angle) => {
        const rad = ((angle - 90) * Math.PI) / 180;
        return (
          <line
            key={angle}
            x1={x}
            y1={y}
            x2={x + Math.cos(rad) * size}
            y2={y + Math.sin(rad) * size}
            strokeWidth={size * 0.06}
          />
        );
      })}
      <path
        d={`M${x - size * 0.84} ${y - size * 0.5}Q${x} ${y - size * 1.25} ${x + size * 0.84} ${y - size * 0.5}`}
        strokeWidth={size * 0.07}
      />
      <path
        d={`M${x - size * 0.5} ${y - size * 0.4}Q${x} ${y - size * 0.82} ${x + size * 0.5} ${y - size * 0.4}`}
        strokeWidth={size * 0.05}
      />
    </g>
  );
}

function TubeCoral({ x, y, color }: { x: number; y: number; color: string }) {
  return (
    <g fill={color}>
      {[
        [-16, 44],
        [0, 62],
        [16, 36],
      ].map(([dx, h]) => (
        <g key={dx}>
          <rect x={x + dx - 7} y={y - h} width="14" height={h} rx="7" />
          <ellipse cx={x + dx} cy={y - h + 3} rx="5" ry="3" fill="#b65f12" opacity=".45" />
        </g>
      ))}
    </g>
  );
}

function Anemone({ x, y, scale = 1 }: { x: number; y: number; scale?: number }) {
  const arms = [-34, -24, -14, -4, 6, 16, 26, 36];
  return (
    <g transform={`translate(${x} ${y}) scale(${scale})`}>
      {arms.map((dx, index) => (
        <Blade
          key={dx}
          x={dx * 0.5}
          base={0}
          height={44 + (index % 3) * 8}
          bend={dx * 0.6}
          width={7}
          color={index % 2 ? "#ff9fc4" : "#ffc2dc"}
          wait={index * 0.25}
          className="sway sway-fast"
        />
      ))}
      <ellipse cx="0" cy="2" rx="22" ry="8" fill="#d9558e" />
    </g>
  );
}

function Shell({
  x,
  y,
  scale = 1,
  color = "#f9c7d8",
}: {
  x: number;
  y: number;
  scale?: number;
  color?: string;
}) {
  return (
    <g transform={`translate(${x} ${y}) scale(${scale})`}>
      <path d="M0 0-20-6C-24-22-12-36 0-38 12-36 24-22 20-6Z" fill={color} />
      <path d="M0 0V-36M0 0-12-33M0 0 12-33M0 0-19-20M0 0 19-20" stroke="#d98ba6" strokeWidth="2" />
      <path d="M-6 0h12l-2 5h-8Z" fill="#d98ba6" />
    </g>
  );
}

function Starfish({
  x,
  y,
  scale = 1,
  color = "#ffb06b",
}: {
  x: number;
  y: number;
  scale?: number;
  color?: string;
}) {
  return (
    <g transform={`translate(${x} ${y}) scale(${scale})`}>
      <path
        d="M0-22C3-10 6-8 20-7 9 0 7 4 12 18 2 10-2 10-12 18-8 4-9 0-20-7-6-8-3-10 0-22Z"
        fill={color}
        stroke="#e0813d"
        strokeWidth="2"
        strokeLinejoin="round"
      />
      <g fill="#fff" opacity=".55">
        <circle cx="0" cy="-12" r="1.6" />
        <circle cx="9" cy="-4" r="1.6" />
        <circle cx="-9" cy="-4" r="1.6" />
        <circle cx="5" cy="8" r="1.6" />
        <circle cx="-5" cy="8" r="1.6" />
      </g>
    </g>
  );
}

function Bubbles({ items }: { items: [number, number, number, number][] }) {
  return (
    <g fill="none" stroke="#fff" strokeOpacity=".75" strokeWidth="2">
      {items.map(([cx, cy, r, wait]) => (
        <circle key={`${cx}-${cy}`} className="rise" style={delay(wait)} cx={cx} cy={cy} r={r} />
      ))}
    </g>
  );
}

/* ---------- Map card illustrations (viewBox 0 0 320 190) ---------- */

export function MapArt({ theme }: { theme: WorldTheme }) {
  if (theme === "coral")
    return (
      <svg viewBox="0 0 320 190" preserveAspectRatio="xMidYMax slice" aria-hidden="true">
        <path d="M-10 160c60-18 120-22 180-14s120 4 160-6v60H-10Z" fill="#f6dca2" />
        <path
          d="M-10 168c70-12 130-12 200-4s100 2 140-4"
          stroke="#fff3cf"
          strokeWidth="4"
          fill="none"
        />
        <FanCoral x={70} y={162} size={62} color="#b987e6" />
        <BranchCoral x={130} y={166} scale={0.95} color="#ff6f7d" />
        <BrainCoral x={196} y={168} r={30} color="#ff9e57" />
        <TubeCoral x={262} y={168} color="#ffcf4a" />
        <Anemone x={30} y={170} scale={0.7} />
        <Bubbles
          items={[
            [110, 70, 5, 0],
            [124, 46, 3.5, 1.2],
            [238, 80, 4, 0.6],
          ]}
        />
      </svg>
    );
  if (theme === "open")
    return (
      <svg viewBox="0 0 320 190" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
        <g fill="none" stroke="#9fe7ff" strokeLinecap="round">
          <path
            className="flow"
            d="M-20 50c50-20 90 20 140 0s90-20 140 0 60 10 80 0"
            strokeWidth="3"
            strokeOpacity=".5"
          />
          <path
            className="flow flow-slow"
            d="M-20 150c60-16 100 16 160 0s100-16 200 0"
            strokeWidth="3"
            strokeOpacity=".35"
          />
        </g>
        <g fill="#e9fbff">
          {[
            [40, 30, 2, 0],
            [92, 120, 1.6, 1],
            [150, 24, 1.8, 2],
            [210, 160, 2, 0.5],
            [270, 40, 1.6, 1.5],
            [300, 120, 2, 2.5],
            [20, 140, 1.4, 1.8],
          ].map(([cx, cy, r, wait]) => (
            <circle
              key={`${cx}-${cy}`}
              className="twinkle"
              style={delay(wait)}
              cx={cx}
              cy={cy}
              r={r}
            />
          ))}
        </g>
      </svg>
    );
  if (theme === "grass")
    return (
      <svg viewBox="0 0 320 190" preserveAspectRatio="xMidYMax slice" aria-hidden="true">
        <path d="M-10 164c70-14 140-16 200-8s100 4 140-2v50H-10Z" fill="#f2d39a" />
        {Array.from({ length: 18 }, (_, i) => {
          const x = 8 + i * 18 + (i % 3) * 4;
          return (
            <Blade
              key={x}
              x={x}
              base={170}
              height={70 + ((i * 37) % 60)}
              bend={(i % 2 ? 1 : -1) * (14 + (i % 4) * 5)}
              width={i % 3 === 0 ? 9 : 7}
              color={["#2f9a63", "#46b97a", "#62cc8d"][i % 3]}
              wait={(i % 6) * 0.4}
            />
          );
        })}
        <Shell x={250} y={176} scale={0.55} />
      </svg>
    );
  return (
    <svg viewBox="0 0 320 190" preserveAspectRatio="xMidYMax slice" aria-hidden="true">
      <path d="M-10 172c80-10 160-12 340-4v30H-10Z" fill="#b9a6d6" />
      <path d="M10 182c0-40 40-66 96-66 44 0 74 22 82 66Z" fill="#5c5f98" />
      <path d="M150 182c4-32 34-52 74-52 46 0 86 22 90 52Z" fill="#4a4c82" />
      <path d="M62 182c4-20 18-30 40-30s36 10 40 30Z" fill="#2a2b55" />
      <path
        d="M36 142c18-16 44-22 70-20"
        stroke="#b6a2ea"
        strokeWidth="5"
        strokeLinecap="round"
        fill="none"
        opacity=".55"
      />
      <Shell x={250} y={182} scale={0.6} />
      <Starfish x={290} y={176} scale={0.6} />
    </svg>
  );
}

/* ---------- Immersive world panoramas (viewBox 0 0 1200 560) ---------- */

export type SpotCounts = Record<string, number>;

type FxStyle = CSSProperties & Record<`--${string}`, string>;

/*
 * An interactive part of the scenery. It is a real keyboard-accessible button inside the SVG,
 * with an invisible hit area, a focus ring and a small pulsing "touch me" hint.
 */
function Hotspot({
  id,
  label,
  onSpot,
  ring,
  children,
}: {
  id: string;
  label: string;
  onSpot: (id: string) => void;
  ring: { cx: number; cy: number; rx: number; ry: number };
  children: ReactNode;
}) {
  return (
    <g
      className="world-hotspot"
      role="button"
      tabIndex={0}
      aria-label={label}
      data-spot={id}
      onClick={() => onSpot(id)}
      onKeyDown={(event) => {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          onSpot(id);
        }
      }}
    >
      <ellipse className="hotspot-area" {...ring} />
      {children}
      <ellipse className="hotspot-ring" {...ring} />
      <circle
        className="hotspot-hint"
        cx={ring.cx + ring.rx * 0.62}
        cy={ring.cy - ring.ry * 0.78}
        r="10"
      />
    </g>
  );
}

/* Bubbles bursting upward from a point; replays whenever its key changes. */
function BubbleBurst({
  x,
  y,
  count = 9,
  spread = 60,
  height = 220,
}: {
  x: number;
  y: number;
  count?: number;
  spread?: number;
  height?: number;
}) {
  return (
    <g className="fx-group" fill="#ffffff" fillOpacity=".25" stroke="#fff" strokeWidth="2.5">
      {Array.from({ length: count }, (_, i) => {
        const dx = ((i * 37) % (spread * 2)) - spread;
        const style: FxStyle = {
          "--dx": `${dx}px`,
          "--dy": `${-height - (i % 3) * 40}px`,
          animationDelay: `${(i % 5) * 0.12}s`,
        };
        return (
          <circle
            key={i}
            className="fx fx-burst"
            style={style}
            cx={x + (i % 3) * 6 - 6}
            cy={y}
            r={4 + (i % 4) * 3}
          />
        );
      })}
    </g>
  );
}

/* Big floating bubbles that pop when touched and come back a few seconds later. */
const poppableBubbles: [string, number, number, number][] = [
  ["bubble-1", 505, 236, 30],
  ["bubble-2", 700, 262, 24],
  ["bubble-3", 604, 318, 20],
];

function PoppableBubbles({ spots, onSpot }: { spots: SpotCounts; onSpot: (id: string) => void }) {
  return (
    <>
      {poppableBubbles.map(([id, cx, cy, r], i) => {
        const count = spots[id] ?? 0;
        return (
          <Hotspot
            key={id}
            id={id}
            label="Burbuja: tócala para reventarla"
            onSpot={onSpot}
            ring={{ cx, cy, rx: r + 14, ry: r + 14 }}
          >
            <g className="bubble-bob" style={delay(i * 0.8)}>
              <g key={count} className={count ? "bubble-popped" : undefined}>
                <circle
                  cx={cx}
                  cy={cy}
                  r={r}
                  fill="#ffffff"
                  fillOpacity=".22"
                  stroke="#ffffff"
                  strokeWidth="3"
                />
                <ellipse
                  cx={cx - r * 0.35}
                  cy={cy - r * 0.38}
                  rx={r * 0.28}
                  ry={r * 0.16}
                  fill="#ffffff"
                  opacity=".85"
                  transform={`rotate(-30 ${cx - r * 0.35} ${cy - r * 0.38})`}
                />
                <circle
                  cx={cx + r * 0.38}
                  cy={cy + r * 0.3}
                  r={r * 0.08}
                  fill="#ffffff"
                  opacity=".7"
                />
              </g>
            </g>
            {count > 0 && (
              <g
                key={`pop-${count}`}
                className="fx-pop"
                stroke="#ffffff"
                strokeWidth="3"
                strokeLinecap="round"
              >
                {[0, 60, 120, 180, 240, 300].map((angle) => {
                  const rad = (angle * Math.PI) / 180;
                  return (
                    <line
                      key={angle}
                      x1={cx + Math.cos(rad) * (r + 4)}
                      y1={cy + Math.sin(rad) * (r + 4)}
                      x2={cx + Math.cos(rad) * (r + 18)}
                      y2={cy + Math.sin(rad) * (r + 18)}
                    />
                  );
                })}
              </g>
            )}
          </Hotspot>
        );
      })}
    </>
  );
}

export function WorldScenery({
  theme,
  spots = {},
  onSpot = () => {},
}: {
  theme: WorldTheme;
  spots?: SpotCounts;
  onSpot?: (id: string) => void;
}) {
  const fx = (id: string) => spots[id] ?? 0;

  if (theme === "coral")
    return (
      <svg
        className="world-scenery"
        viewBox="0 0 1200 560"
        preserveAspectRatio="xMidYMax slice"
        aria-label="Arrecife de coral con elementos para tocar"
        role="group"
      >
        <defs>
          <linearGradient id="coral-ray" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#fff" stopOpacity=".55" />
            <stop offset="1" stopColor="#fff" stopOpacity="0" />
          </linearGradient>
          <linearGradient id="coral-sand" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#fbe5b0" />
            <stop offset="1" stopColor="#e9c27e" />
          </linearGradient>
        </defs>
        <circle cx="980" cy="-30" r="140" fill="#fffbe0" opacity=".45" />
        <g fill="url(#coral-ray)">
          {[
            [700, 0],
            [820, 0.8],
            [940, 1.6],
            [1060, 0.4],
            [560, 1.2],
            [380, 2],
          ].map(([x, wait]) => (
            <path
              key={x}
              className="shimmer"
              style={delay(wait)}
              d={`M${x} -10l70 0-160 520h-40Z`}
            />
          ))}
        </g>
        <path d="M-20 470c200-40 400-50 620-30s420 10 620-20v160H-20Z" fill="url(#coral-sand)" />
        <path
          d="M-20 486c220-30 420-36 640-18s400 8 600-16"
          stroke="#fff6d8"
          strokeWidth="5"
          fill="none"
        />
        {/* Edge corals: also touchable */}
        <Hotspot
          id="coral-fan-2"
          label="Coral abanico: tócalo para ver burbujas y un dato"
          onSpot={onSpot}
          ring={{ cx: 90, cy: 410, rx: 74, ry: 82 }}
        >
          <FanCoral x={90} y={478} size={120} color="#b987e6" />
        </Hotspot>
        <Hotspot
          id="coral-brain-2"
          label="Coral cerebro: tócalo para ver burbujas y un dato"
          onSpot={onSpot}
          ring={{ cx: 220, cy: 462, rx: 58, ry: 40 }}
        >
          <BrainCoral x={220} y={488} r={50} color="#7fd99a" />
        </Hotspot>
        <Hotspot
          id="coral-tube"
          label="Coral de tubo: tócalo para ver burbujas y un dato"
          onSpot={onSpot}
          ring={{ cx: 320, cy: 456, rx: 36, ry: 44 }}
        >
          <TubeCoral x={320} y={490} color="#ffcf4a" />
        </Hotspot>
        <Hotspot
          id="coral-branch-2"
          label="Coral ramificado: tócalo para ver burbujas y un dato"
          onSpot={onSpot}
          ring={{ cx: 900, cy: 420, rx: 44, ry: 80 }}
        >
          <BranchCoral x={900} y={484} scale={1.4} color="#ff8fb1" />
        </Hotspot>
        <Hotspot
          id="coral-tube-2"
          label="Coral de tubo: tócalo para ver burbujas y un dato"
          onSpot={onSpot}
          ring={{ cx: 1000, cy: 454, rx: 36, ry: 44 }}
        >
          <TubeCoral x={1000} y={488} color="#c79bf0" />
        </Hotspot>
        <Hotspot
          id="coral-fan-3"
          label="Coral abanico: tócalo para ver burbujas y un dato"
          onSpot={onSpot}
          ring={{ cx: 1110, cy: 414, rx: 70, ry: 76 }}
        >
          <FanCoral x={1110} y={478} size={110} color="#ff8a7a" />
        </Hotspot>
        {/* Interactive centre */}
        <Hotspot
          id="coral-fan"
          label="Coral abanico: tócalo para ver burbujas y un dato"
          onSpot={onSpot}
          ring={{ cx: 440, cy: 420, rx: 70, ry: 78 }}
        >
          <FanCoral x={440} y={486} size={110} color="#a879e0" />
        </Hotspot>
        <Hotspot
          id="coral-branch"
          label="Coral ramificado: tócalo para ver burbujas y un dato"
          onSpot={onSpot}
          ring={{ cx: 530, cy: 420, rx: 46, ry: 82 }}
        >
          <BranchCoral x={530} y={490} scale={1.45} color="#ff6f7d" />
        </Hotspot>
        <Hotspot
          id="anemone"
          label="Anémona: tócala para que el pez payaso se refugie"
          onSpot={onSpot}
          ring={{ cx: 640, cy: 444, rx: 66, ry: 56 }}
        >
          <Anemone x={640} y={490} scale={1.35} />
        </Hotspot>
        <Hotspot
          id="coral-brain"
          label="Coral cerebro: tócalo para ver burbujas y un dato"
          onSpot={onSpot}
          ring={{ cx: 760, cy: 458, rx: 64, ry: 44 }}
        >
          <BrainCoral x={760} y={492} r={56} color="#ff9e57" />
        </Hotspot>
        {(
          [
            ["coral-fan", 440, 380],
            ["coral-fan-2", 90, 370],
            ["coral-fan-3", 1110, 374],
            ["coral-brain-2", 220, 440],
            ["coral-tube", 320, 420],
            ["coral-branch-2", 900, 360],
            ["coral-tube-2", 1000, 420],
          ] as [string, number, number][]
        ).map(([spot, x, y]) =>
          fx(spot) > 0 ? <BubbleBurst key={`${spot}-${fx(spot)}`} x={x} y={y} /> : null,
        )}
        {fx("coral-branch") > 0 && <BubbleBurst key={`b${fx("coral-branch")}`} x={530} y={370} />}
        {fx("coral-brain") > 0 && <BubbleBurst key={`r${fx("coral-brain")}`} x={760} y={430} />}
        <Bubbles
          items={[
            [180, 330, 9, 0],
            [200, 270, 5, 1.4],
            [1060, 340, 8, 1],
            [1080, 280, 5, 2.4],
          ]}
        />
        <PoppableBubbles spots={spots} onSpot={onSpot} />
      </svg>
    );

  if (theme === "open")
    return (
      <svg
        className="world-scenery"
        viewBox="0 0 1200 560"
        preserveAspectRatio="xMidYMid slice"
        aria-hidden="true"
      >
        <defs>
          <radialGradient id="open-glow" cx="50%" cy="0%" r="70%">
            <stop offset="0" stopColor="#7fd8ff" stopOpacity=".45" />
            <stop offset="1" stopColor="#7fd8ff" stopOpacity="0" />
          </radialGradient>
        </defs>
        <rect width="1200" height="560" fill="url(#open-glow)" />
        <g fill="none" stroke="#8fdcff" strokeLinecap="round">
          {[
            [90, 0.5, 4, ""],
            [190, 0.3, 3, "flow-slow"],
            [300, 0.4, 5, ""],
            [410, 0.25, 3, "flow-slow"],
            [490, 0.3, 4, ""],
          ].map(([y, opacity, width, extra]) => (
            <path
              key={y as number}
              className={`flow ${extra}`}
              d={`M-60 ${y}c160-50 260 50 420 0s260-50 420 0 260 50 480 0`}
              strokeOpacity={opacity as number}
              strokeWidth={width as number}
            />
          ))}
        </g>
        <g fill="#eafcff">
          {Array.from({ length: 34 }, (_, i) => (
            <circle
              key={i}
              className="twinkle"
              style={delay((i % 7) * 0.6)}
              cx={(i * 137) % 1200}
              cy={30 + ((i * 89) % 500)}
              r={1.4 + (i % 4) * 0.7}
            />
          ))}
        </g>
        <PoppableBubbles spots={spots} onSpot={onSpot} />
      </svg>
    );

  if (theme === "grass") {
    const meadow = (from: number, blades: number, seed: number) =>
      Array.from({ length: blades }, (_, i) => {
        const x = from + i * 19 + (i % 3) * 3;
        const n = i + seed;
        return (
          <Blade
            key={x}
            x={x}
            base={500 + (n % 3) * 6}
            height={130 + ((n * 53) % 140)}
            bend={(n % 2 ? 1 : -1) * (22 + (n % 5) * 7)}
            width={n % 3 === 0 ? 13 : 10}
            color={["#2f9a63", "#46b97a", "#62cc8d", "#3aa872"][n % 4]}
            wait={(n % 8) * 0.35}
          />
        );
      });
    const patch = (id: string, cx: number, from: number, seed: number) => (
      <Hotspot
        id={id}
        label="Pradera marina: tócala para ver burbujas de oxígeno y llamar a la tortuga"
        onSpot={onSpot}
        ring={{ cx, cy: 400, rx: 112, ry: 112 }}
      >
        <g key={fx(id)} className={fx(id) ? "agitated" : undefined}>
          {meadow(from, 12, seed)}
        </g>
      </Hotspot>
    );
    return (
      <svg
        className="world-scenery"
        viewBox="0 0 1200 560"
        preserveAspectRatio="xMidYMax slice"
        aria-label="Pradera marina con zonas para tocar"
        role="group"
      >
        <defs>
          <linearGradient id="grass-sand" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#f6d9a2" />
            <stop offset="1" stopColor="#e2b373" />
          </linearGradient>
        </defs>
        <g fill="#fffbe6" opacity=".18">
          <ellipse className="shimmer" cx="260" cy="120" rx="160" ry="34" />
          <ellipse className="shimmer" style={delay(1.5)} cx="860" cy="80" rx="200" ry="40" />
        </g>
        <path d="M-20 480c220-34 420-40 640-22s400 6 600-18v140H-20Z" fill="url(#grass-sand)" />
        <g fill="none" stroke="#f9e8c4" strokeWidth="4" strokeLinecap="round" opacity=".8">
          <path d="M80 520c40-8 80-8 120 0M420 530c40-8 80-8 120 0M860 520c40-8 80-8 120 0" />
        </g>
        {patch("meadow-far-left", 90, -10, 0)}
        {patch("meadow-mid-left", 290, 220, 4)}
        {patch("meadow-left", 485, 380, 2)}
        {patch("meadow-right", 718, 612, 7)}
        {patch("meadow-mid-right", 920, 830, 5)}
        {patch("meadow-far-right", 1110, 1030, 9)}
        {(
          [
            ["meadow-far-left", 90],
            ["meadow-mid-left", 290],
            ["meadow-left", 485],
            ["meadow-right", 718],
            ["meadow-mid-right", 920],
            ["meadow-far-right", 1110],
          ] as [string, number][]
        ).map(([spot, x]) =>
          fx(spot) > 0 ? (
            <BubbleBurst
              key={`${spot}-${fx(spot)}`}
              x={x}
              y={330}
              count={12}
              spread={80}
              height={300}
            />
          ) : null,
        )}
        <Shell x={320} y={528} scale={0.9} />
        <Starfish x={980} y={530} scale={0.9} />
        <PoppableBubbles spots={spots} onSpot={onSpot} />
      </svg>
    );
  }

  const caveItems = (id: string, cx: number) => {
    const count = fx(id);
    if (!count) return null;
    const style: FxStyle = { "--dx": "0px", "--dy": "26px" };
    const stars = count % 2 === 1;
    return (
      <g key={`${id}-${count}`} className="fx fx-emerge" style={style}>
        {stars ? (
          <>
            <Starfish x={cx - 52} y={536} scale={0.95} />
            <Starfish x={cx + 54} y={534} scale={0.8} color="#ff8fb1" />
          </>
        ) : (
          <>
            <Shell x={cx - 50} y={540} scale={0.95} />
            <Shell x={cx + 50} y={540} scale={0.85} color="#ffd9b0" />
            <Shell x={cx + 2} y={548} scale={0.6} color="#e8d7ff" />
          </>
        )}
      </g>
    );
  };
  return (
    <svg
      className="world-scenery"
      viewBox="0 0 1200 560"
      preserveAspectRatio="xMidYMax slice"
      aria-label="Rocas y cuevas con elementos para tocar"
      role="group"
    >
      <defs>
        <radialGradient id="rock-glow" cx="50%" cy="35%" r="60%">
          <stop offset="0" stopColor="#c4adf2" stopOpacity=".42" />
          <stop offset="1" stopColor="#c4adf2" stopOpacity="0" />
        </radialGradient>
        <linearGradient id="rock-stone" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#6d6aa8" />
          <stop offset="1" stopColor="#3e3d72" />
        </linearGradient>
      </defs>
      <rect width="1200" height="560" fill="url(#rock-glow)" />
      <path d="M-40 560V300c60-60 150-80 230-50 50-50 130-50 190 10v300Z" fill="url(#rock-stone)" />
      <path d="M840 560c10-130 80-210 190-210 90 0 160 60 230 110v100Z" fill="url(#rock-stone)" />
      <path
        d="M20 310c50-44 120-58 180-44M880 380c50-36 110-46 160-36"
        stroke="#c8b6f5"
        strokeWidth="8"
        strokeLinecap="round"
        fill="none"
        opacity=".45"
      />
      <path d="M400 560c6-120 90-200 210-200s204 80 214 200Z" fill="#5a5896" />
      <path
        d="M470 400c40-28 100-38 150-28"
        stroke="#c8b6f5"
        strokeWidth="7"
        strokeLinecap="round"
        fill="none"
        opacity=".5"
      />
      <path d="M-20 520c240-20 480-24 720-14s360 4 520-6v80H-20Z" fill="#b9a6d6" />
      <Hotspot
        id="cave-left"
        label="Cueva: tócala para ver qué sale"
        onSpot={onSpot}
        ring={{ cx: 520, cy: 480, rx: 66, ry: 56 }}
      >
        <path d="M466 522c4-44 24-70 54-70s50 26 54 70Z" fill="#221f48" />
        <path
          d="M478 522c4-30 18-48 42-48"
          stroke="#3b3770"
          strokeWidth="6"
          fill="none"
          strokeLinecap="round"
        />
      </Hotspot>
      <Hotspot
        id="cave-right"
        label="Cueva: tócala para ver qué sale"
        onSpot={onSpot}
        ring={{ cx: 704, cy: 486, rx: 60, ry: 50 }}
      >
        <path d="M656 522c4-38 22-62 48-62s44 24 48 62Z" fill="#221f48" />
        <path
          d="M668 522c4-26 16-42 36-42"
          stroke="#3b3770"
          strokeWidth="6"
          fill="none"
          strokeLinecap="round"
        />
      </Hotspot>
      {caveItems("cave-left", 520)}
      {caveItems("cave-right", 704)}
      <Shell x={250} y={530} scale={1.05} />
      <Starfish x={340} y={534} scale={0.9} />
      <Shell x={960} y={536} scale={0.8} color="#ffd9b0" />
      <Starfish x={1120} y={530} scale={0.8} color="#ff8fb1" />
      <g fill="#e6dcff">
        {Array.from({ length: 18 }, (_, i) => (
          <circle
            key={i}
            className="twinkle"
            style={delay((i % 6) * 0.7)}
            cx={(i * 173) % 1200}
            cy={40 + ((i * 97) % 380)}
            r={1.5 + (i % 3) * 0.8}
          />
        ))}
      </g>
      <PoppableBubbles spots={spots} onSpot={onSpot} />
    </svg>
  );
}
