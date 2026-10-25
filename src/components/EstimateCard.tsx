"use client";

import { useEffect, useRef, useState } from "react";
import { sampleEstimate } from "@/lib/site";

const nzd = new Intl.NumberFormat("en-NZ", { style: "currency", currency: "NZD", maximumFractionDigits: 0 });

// Timeline (ms)
const START = 500;
const STAGGER = 170;
const ROW_DURATION = 900;
const TOTAL_DELAY = 150;
const TOTAL_DURATION = 1100;

const easeOut = (x: number) => 1 - Math.pow(1 - Math.min(Math.max(x, 0), 1), 3);

export default function EstimateCard() {
  const { title, subtitle, items } = sampleEstimate;
  const total = items.reduce((sum, i) => sum + i.amount, 0);
  const max = Math.max(...items.map((i) => i.amount));
  const totalStart = START + items.length * STAGGER + TOTAL_DELAY;
  const end = totalStart + TOTAL_DURATION;

  // null = not started (server render / no JS): show final values.
  const [elapsed, setElapsed] = useState<number | null>(null);
  const ref = useRef<HTMLElement>(null);

  // Count up once the card scrolls into view (immediately on desktop, below the fold on phones).
  useEffect(() => {
    let frame = 0;
    const start = () => {
      frame = requestAnimationFrame(function first(t0) {
        if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
          setElapsed(Infinity);
          return;
        }
        const tick = (t: number) => {
          const e = t - t0;
          setElapsed(e);
          if (e < end) frame = requestAnimationFrame(tick);
        };
        frame = requestAnimationFrame(tick);
      });
    };
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          observer.disconnect();
          start();
        }
      },
      { threshold: 0.35 },
    );
    if (ref.current) observer.observe(ref.current);
    return () => {
      observer.disconnect();
      cancelAnimationFrame(frame);
    };
  }, [end]);

  const progress = (start: number, duration: number) =>
    elapsed === null ? 1 : easeOut((elapsed - start) / duration);

  const state = elapsed === null ? "is-idle" : elapsed >= end ? "is-done" : "is-running";
  const totalP = progress(totalStart, TOTAL_DURATION);

  return (
    <figure ref={ref} className={`estimate ${state}`} aria-label={`Illustrative sample estimate: ${title}`}>
      <div className="estimate__head">
        <span className="estimate__eyebrow">Sample estimate</span>
        <span className="estimate__tag">Illustrative</span>
      </div>
      <p className="estimate__title">{title}</p>
      <p className="estimate__subtitle">{subtitle}</p>
      <ul className="estimate__rows">
        {items.map((item, i) => {
          const p = progress(START + i * STAGGER, ROW_DURATION);
          return (
            <li
              key={item.label}
              className="estimate__row"
              style={{ "--row-delay": `${START + i * STAGGER}ms` } as React.CSSProperties}
            >
              <span className="estimate__label">{item.label}</span>
              <span className="estimate__amount">{nzd.format(Math.round((item.amount * p) / 100) * 100)}</span>
              <span className="estimate__bar" aria-hidden="true">
                <span style={{ width: `${(item.amount / max) * 100 * p}%` }} />
              </span>
            </li>
          );
        })}
      </ul>
      <div className="estimate__total" style={{ "--row-delay": `${totalStart}ms` } as React.CSSProperties}>
        <span>Estimated total</span>
        <strong>
          {nzd.format(Math.round((total * totalP) / 100) * 100)}
          <small> + GST</small>
        </strong>
      </div>
      <figcaption className="estimate__note">Example only — every ProQS estimate is itemised to your plans.</figcaption>
    </figure>
  );
}
