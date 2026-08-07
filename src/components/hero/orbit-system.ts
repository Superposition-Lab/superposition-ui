/**
 * The geometry of the hero atom.
 *
 * The design file expressed this as forty-odd hand-nested `<span>` elements
 * with inline transforms. Describing it as data instead means a plane can be
 * retuned, added or removed in one place, and the billboarding maths below is
 * written once rather than copied per electron.
 */

export interface Electron {
  /** Diameter in px. */
  size: number;
  /** Radial-gradient stops: highlight, midtone, shadow. */
  colors: [highlight: string, mid: string, shadow: string];
  /** Optional glow, as a full box-shadow value. */
  glow?: string;
  /** Negative delay, in seconds, to offset an electron along its ring. */
  delay?: number;
}

export interface OrbitPlane {
  /** Inset from the system box, in px. Larger inset = tighter orbit. */
  inset: number;
  /** Tilt away from the viewer, in degrees. */
  rotateX: number;
  /** Spin of the plane itself, in degrees. */
  rotateZ: number;
  /** Ring stroke color. */
  ring: string;
  /** Seconds for one full revolution. */
  duration: number;
  /** Whether the electrons travel counter-clockwise. */
  reverse: boolean;
  electrons: Electron[];
}

/** Edge length of the square the whole system occupies, in px. */
export const ORBIT_SIZE = 620;

export const ORBIT_PLANES: OrbitPlane[] = [
  {
    inset: 0,
    rotateX: 68,
    rotateZ: 24,
    ring: 'rgba(130,210,235,0.38)',
    duration: 11,
    reverse: false,
    electrons: [
      {
        size: 16,
        colors: ['#e9fbff', '#7fd4ec', '#0e4c60'],
        glow: '0 0 14px 3px rgba(127,212,236,0.55)',
      },
      {
        size: 11,
        colors: ['#d9f4fc', '#6fc0d8', '#0e4c60'],
        delay: -5.5,
      },
    ],
  },
  {
    inset: 70,
    rotateX: 62,
    rotateZ: -38,
    ring: 'rgba(240,140,190,0.32)',
    duration: 17,
    reverse: true,
    electrons: [
      {
        size: 14,
        colors: ['#ffe9f4', '#f08cbe', '#6e1042'],
        glow: '0 0 14px 3px rgba(240,140,190,0.5)',
      },
    ],
  },
  {
    inset: 145,
    rotateX: 74,
    rotateZ: 82,
    ring: 'rgba(237,187,0,0.28)',
    duration: 23,
    reverse: false,
    electrons: [
      {
        size: 12,
        colors: ['#fff8e0', '#edd06a', '#6e5606'],
        glow: '0 0 12px 2px rgba(237,208,106,0.5)',
      },
    ],
  },
];

/** Background stars. Position is a percentage of the system box. */
export const TWINKLES = [
  { left: 12, top: 24, size: 3, duration: 5, delay: 0 },
  { left: 82, top: 18, size: 2, duration: 7, delay: -2 },
  { left: 90, top: 62, size: 3, duration: 6, delay: -4 },
  { left: 22, top: 80, size: 2, duration: 8, delay: -1 },
  { left: 55, top: 8, size: 2, duration: 6, delay: -3 },
] as const;

/**
 * An electron rides a plane that is tilted away from the viewer. Left alone it
 * would appear as a squashed ellipse and read as flat. Undoing the plane
 * rotation on the dot itself makes it face the viewer at every point of the
 * orbit — a billboard — so it reads as a sphere travelling in depth.
 */
export function billboardTransform(plane: Pick<OrbitPlane, 'rotateX' | 'rotateZ'>): string {
  return `rotateZ(${-plane.rotateZ}deg) rotateX(${-plane.rotateX}deg)`;
}

/** Sphere shading: a highlight up and left of centre, falling to a dark limb. */
export function sphereGradient(colors: Electron['colors']): string {
  const [highlight, mid, shadow] = colors;
  return `radial-gradient(circle at 32% 28%, ${highlight}, ${mid} 45%, ${shadow} 100%)`;
}
