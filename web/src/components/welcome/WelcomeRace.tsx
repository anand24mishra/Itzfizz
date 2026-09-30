"use client";

import { useRef } from "react";
import { gsap, ScrollTrigger, useGSAP } from "@/lib/gsap";
import { MOTION, STATS } from "./config";
import { RaceCar } from "./RaceCar";
import { StatCard } from "./StatCard";
import styles from "./welcome.module.css";

interface CardChannel {
  el: HTMLElement;
  setOpacity: (value: number) => void;
  setY: (value: number) => void;
  setScale: (value: number) => void;
  counter: HTMLElement;
  value: number;
  /** Cards enter from the outside edge of their own side of the track. */
  direction: 1 | -1;
  /** Measured on refresh, so CSS owns card placement at every breakpoint. */
  left: number;
  shown: number;
}

export function WelcomeRace() {
  const section = useRef<HTMLElement>(null);
  const stage = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const stageEl = stage.current;
      const sectionEl = section.current;
      if (!stageEl || !sectionEl) return;

      const mm = gsap.matchMedia();

      mm.add("(prefers-reduced-motion: no-preference)", () => {
        const reveal = stageEl.querySelector<HTMLElement>("[data-reveal]");
        const car = stageEl.querySelector<HTMLElement>("[data-car]");
        const blur = stageEl.querySelector<SVGElement>("[data-blur]");
        const cue = stageEl.querySelector<HTMLElement>("[data-cue]");
        if (!reveal || !car || !blur) return;

        const channels: CardChannel[] = gsap.utils
          .toArray<HTMLElement>("[data-card]", stageEl)
          .map((el) => {
            const counter = el.querySelector<HTMLElement>("[data-count]")!;
            return {
              el,
              setOpacity: gsap.quickSetter(el, "opacity") as (v: number) => void,
              setY: gsap.quickSetter(el, "y", "px") as (v: number) => void,
              setScale: gsap.quickSetter(el, "scale") as (v: number) => void,
              counter,
              value: Number(counter.dataset.value ?? 0),
              direction: el.dataset.side === "top" ? -1 : 1,
              left: 0,
              shown: -1,
            };
          });

        const setCarX = gsap.quickSetter(car, "x", "px") as (v: number) => void;
        const setCueOpacity = gsap.quickSetter(cue ?? car, "opacity") as (
          v: number,
        ) => void;
        const ease = gsap.parseEase("power3.out");
        const clamp01 = gsap.utils.clamp(0, 1);

        // Geometry is re-measured on refresh rather than read per frame, so the
        // render loop never touches layout.
        let stageWidth = 0;
        let carLength = 0;
        let paintFrom = 0;
        let paintTo = 0;

        const measure = () => {
          stageWidth = stageEl.clientWidth;
          carLength = car.offsetWidth;
          paintFrom = MOTION.startX * stageWidth;
          paintTo = stageWidth + MOTION.runOut * carLength;
          for (const c of channels) c.left = c.el.offsetLeft;
        };

        let lastPaintX = 0;
        let blurAmount = 0;
        let blurTarget = 0;

        // ScrollTrigger stops calling onUpdate the moment the scrub tween ends,
        // which would strand the blur at whatever it last read. Decaying on the
        // shared ticker guarantees it always returns to zero; the early exit
        // makes it free once it has.
        const decayBlur = () => {
          if (blurAmount < 0.001 && blurTarget < 0.001) return;
          blurTarget *= 0.82;
          blurAmount += (blurTarget - blurAmount) * 0.16;
          if (blurAmount < 0.001) blurAmount = 0;
          blur.setAttribute(
            "stdDeviation",
            `${(blurAmount * MOTION.blurMax).toFixed(2)} 0`,
          );
        };
        gsap.ticker.add(decayBlur);

        const render = (progress: number) => {
          // Two phases on one scrub: the headline is laid down over the first
          // `revealEnd` of the scroll, then the car clears the frame over what
          // is left. Splitting it here rather than letting it fall out of the
          // geometry keeps the beat identical at every viewport.
          const paintX =
            progress <= MOTION.revealEnd
              ? paintFrom +
                (stageWidth - paintFrom) * (progress / MOTION.revealEnd)
              : stageWidth +
                (paintTo - stageWidth) *
                  ((progress - MOTION.revealEnd) / (1 - MOTION.revealEnd));

          // The car is positioned by its tyre contact patch, which is also the
          // paint edge — one value, so the two can never disagree.
          setCarX(paintX - MOTION.paintLine * carLength);

          const cut = Math.max(0, (1 - paintX / stageWidth) * 100);
          reveal.style.clipPath = `inset(0 ${cut.toFixed(3)}% 0 0)`;

          const noseX = paintX + (1 - MOTION.paintLine) * carLength;
          const travel = MOTION.cardTravel * stageWidth;

          for (const c of channels) {
            const t = clamp01((noseX - c.left) / travel);
            const e = ease(t);
            c.setOpacity(e);
            c.setY((1 - e) * 26 * c.direction);
            c.setScale(0.94 + 0.06 * e);
            c.el.style.filter = `saturate(${e.toFixed(3)})`;

            const next = Math.round(e * c.value);
            if (next !== c.shown) {
              c.shown = next;
              c.counter.textContent = String(next);
            }
          }

          if (cue) setCueOpacity(1 - clamp01(progress / 0.05));

          // Frame-to-frame travel drives a horizontal-only smear, so speed is
          // something you feel rather than something that plays on a timer.
          const delta = Math.abs(paintX - lastPaintX);
          lastPaintX = paintX;
          blurTarget = Math.max(
            blurTarget,
            clamp01(delta / MOTION.blurReference),
          );
        };

        measure();
        render(0);

        ScrollTrigger.create({
          trigger: sectionEl,
          start: "top top",
          end: "bottom bottom",
          pin: stageEl,
          pinSpacing: false,
          scrub: 1,
          invalidateOnRefresh: true,
          onRefresh: (self) => {
            measure();
            lastPaintX = paintFrom;
            render(self.progress);
          },
          onUpdate: (self) => render(self.progress),
        });

        if (typeof document !== "undefined" && document.fonts) {
          document.fonts.ready.then(() => ScrollTrigger.refresh());
        }

        return () => gsap.ticker.remove(decayBlur);
      });

      return () => mm.revert();
    },
    { scope: section },
  );

  return (
    <section
      ref={section}
      className={styles.section}
      aria-labelledby="welcome-heading"
    >
      <div ref={stage} className={styles.stage}>
        <div className={styles.band}>
          <div className={styles.laneAhead} aria-hidden="true" />

          <div className={styles.reveal} data-reveal="">
            <div className={styles.tyreTrack} data-lane="near" aria-hidden="true" />
            <div className={styles.tyreTrack} data-lane="far" aria-hidden="true" />
            <h1 id="welcome-heading" className={styles.headline}>
              <span>Welcome</span> <span>Itzfizz</span>
            </h1>
          </div>

          <div
            className={styles.finish}
            style={{ left: `${MOTION.finishX * 100}%` }}
            aria-hidden="true"
          />
        </div>

        {STATS.map((stat) => (
          <StatCard key={stat.id} stat={stat} />
        ))}

        <div className={styles.car} data-car="">
          <RaceCar />
        </div>

        <p className={styles.cue} data-cue="" aria-hidden="true">
          Scroll to drive
        </p>
      </div>
    </section>
  );
}
