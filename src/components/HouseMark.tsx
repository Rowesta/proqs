// The ProQS house mark as inline SVG, one path per stroke so each can animate.
// Geometry matches public/brand/proqs-mark.svg.
const PATHS = [
  "M123.8 339l0-101l93.6-93.6l93.6 93.6l0 101l-22.5 0l0-91.3l-71.1-71.1l-70.9 70.9l0 91.5z",
  "M168.8 339l0-78.2l48.4-48.5l48 48l0 78.7l-22.6 0l0-69l-25.4-25.3l-25.7 25.7l0 68.6z",
  "M280.9 145.1l75.1 75.1l0 118.8l-22.5 0l0-108.6l-52.6-52.6z",
  "M345.8 145l55.4 55.4l0 138.6l-22.7 0l0-128.8l-32.7-32.7z",
];

type Props = {
  className?: string;
  /** Draw the outline in, then fill. */
  draw?: boolean;
  /** Outline only (no fill) — used as a decorative watermark. */
  outline?: boolean;
};

export default function HouseMark({ className = "", draw = false, outline = false }: Props) {
  const classes = ["house-mark", draw && "house-mark--draw", outline && "house-mark--outline", className]
    .filter(Boolean)
    .join(" ");
  return (
    <svg className={classes} viewBox="122 143 281 198" aria-hidden="true" focusable="false">
      {PATHS.map((d, i) => (
        <path key={i} d={d} pathLength={1} style={{ "--i": i } as React.CSSProperties} />
      ))}
    </svg>
  );
}
