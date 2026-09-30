import type { CSSProperties } from "react";
import type { Stat } from "./config";
import styles from "./welcome.module.css";

export function StatCard({ stat }: { stat: Stat }) {
  // Both positions ship as custom properties so the stylesheet picks which one
  // applies; an inline `left` would win over the narrow-viewport rule.
  const style = {
    "--x": stat.x,
    "--x-mobile": stat.xMobile,
    "--card-bg": stat.bg,
    "--card-fg": stat.fg,
  } as CSSProperties;

  return (
    <article
      className={styles.card}
      data-card=""
      data-side={stat.side}
      style={style}
    >
      <p className={styles.cardValue}>
        {/* The counter is written to directly by GSAP; the accessible value
            lives on the parent so assistive tech never sees a partial number. */}
        {/* Rendered at its final value so the number is correct without JS;
            the animated branch resets it to 0 before first paint. */}
        <span data-count="" data-value={stat.value} aria-hidden="true">
          {stat.value}
        </span>
        <span aria-hidden="true">{stat.unit}</span>
        <span className="sr-only">
          {stat.value}
          {stat.unit}
        </span>
      </p>
      <p className={styles.cardLabel}>{stat.label}</p>
    </article>
  );
}
