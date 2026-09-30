export interface Stat {
  id: string;
  /** Final value of the counter. */
  value: number;
  unit: string;
  label: string;
  /** Which side of the track the card sits on. */
  side: "top" | "bottom";
  /** Left edge of the card as a fraction of the stage width. */
  x: number;
  /**
   * Narrow-viewport left edge. Cards on the same side of the track must stay at
   * least one card-width apart or they overlap and clip each other's labels,
   * which the desktop spacing does not survive being scaled down to.
   */
  xMobile: number;
  /** Card surface colour. */
  bg: string;
  /** Card text colour. */
  fg: string;
}

/**
 * Cards alternate sides and overlap horizontally, so the eye zig-zags along the
 * track instead of reading four evenly spaced boxes.
 */
export const STATS: Stat[] = [
  {
    id: "pickup",
    value: 58,
    unit: "%",
    label: "Increase in pick-up point use",
    side: "top",
    x: 0.4,
    xMobile: 0.03,
    bg: "#DCF23C",
    fg: "#101010",
  },
  {
    id: "calls",
    value: 23,
    unit: "%",
    label: "Drop in inbound support calls",
    side: "bottom",
    x: 0.5,
    xMobile: 0.22,
    bg: "#5BBFF7",
    fg: "#101010",
  },
  {
    id: "transit",
    value: 27,
    unit: "%",
    label: "Faster average time in transit",
    side: "top",
    x: 0.615,
    xMobile: 0.42,
    bg: "#26262A",
    fg: "#F4F4F4",
  },
  {
    id: "cost",
    value: 40,
    unit: "%",
    label: "Lower cost per parcel delivered",
    side: "bottom",
    x: 0.715,
    xMobile: 0.61,
    bg: "#F47A20",
    fg: "#101010",
  },
];

export const MOTION = {
  /**
   * Where the rear tyres meet the road, as a fraction of the car's length
   * measured from its tail. Everything else is derived from this line: the
   * green is paint the car lays down, so the reveal edge *is* the tyre contact
   * patch. Measured off the reference frames at ~0.16–0.18.
   */
  paintLine: 0.17,
  /** Starting position of the paint line, as a fraction of stage width. */
  startX: 0.03,
  /** How far past the right edge the car keeps going, in car lengths. */
  runOut: 1.15,
  /** Distance a card takes to resolve, as a fraction of stage width. */
  cardTravel: 0.13,
  /**
   * Progress at which the headline finishes and the car starts its run-out.
   * Pinning this to the timeline rather than letting it fall out of the
   * geometry keeps the choreography identical at every breakpoint — otherwise
   * a proportionally larger car on mobile finishes the reveal far too early
   * and leaves a dead stretch of scroll behind it.
   */
  revealEnd: 0.82,
  /** Where the finish line is painted, as a fraction of stage width. */
  finishX: 0.93,
  /** Pixels of travel per frame that count as "flat out", for motion blur. */
  blurReference: 46,
  /** Peak horizontal blur, in SVG user units. */
  blurMax: 5.5,
} as const;
