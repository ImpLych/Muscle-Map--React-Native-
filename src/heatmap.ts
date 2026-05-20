// MuscleMap React Native - Heatmap & Color Utilities

import { Muscle, MuscleIntensity, MuscleHighlight } from './types';

export type ColorInterpolation =
  | 'linear'
  | 'easeIn'
  | 'easeOut'
  | 'easeInOut'
  | { type: 'step'; count: number };

function applyInterpolation(t: number, interpolation: ColorInterpolation): number {
  const clamped = Math.min(Math.max(t, 0), 1);
  if (interpolation === 'linear') return clamped;
  if (interpolation === 'easeIn') return clamped * clamped;
  if (interpolation === 'easeOut') return clamped * (2 - clamped);
  if (interpolation === 'easeInOut') {
    return clamped < 0.5
      ? 2 * clamped * clamped
      : -1 + (4 - 2 * clamped) * clamped;
  }
  if (typeof interpolation === 'object' && interpolation.type === 'step') {
    const steps = interpolation.count;
    return Math.floor(clamped * steps) / steps;
  }
  return clamped;
}

// Parse hex color to [r, g, b] (0–255)
function hexToRgb(hex: string): [number, number, number] {
  const normalized = hex.replace('#', '');
  if (normalized.length === 3) {
    const r = parseInt(normalized[0] + normalized[0], 16);
    const g = parseInt(normalized[1] + normalized[1], 16);
    const b = parseInt(normalized[2] + normalized[2], 16);
    return [r, g, b];
  }
  const r = parseInt(normalized.slice(0, 2), 16);
  const g = parseInt(normalized.slice(2, 4), 16);
  const b = parseInt(normalized.slice(4, 6), 16);
  return [r, g, b];
}

function rgbToHex(r: number, g: number, b: number): string {
  const toHex = (v: number) =>
    Math.round(Math.min(255, Math.max(0, v)))
      .toString(16)
      .padStart(2, '0');
  return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
}

function interpolateColors(colorA: string, colorB: string, fraction: number): string {
  const [r1, g1, b1] = hexToRgb(colorA);
  const [r2, g2, b2] = hexToRgb(colorB);
  return rgbToHex(
    r1 + (r2 - r1) * fraction,
    g1 + (g2 - g1) * fraction,
    b1 + (b2 - b1) * fraction,
  );
}

export interface HeatmapColorScale {
  colors: string[];
  interpolation: ColorInterpolation;
}

export function colorForIntensity(
  scale: HeatmapColorScale,
  intensity: number,
): string {
  const { colors, interpolation } = scale;
  if (colors.length === 0) return '#C7C7C7';
  if (colors.length === 1) return colors[0];

  const curved = applyInterpolation(Math.min(Math.max(intensity, 0), 1), interpolation);
  const scaledIndex = curved * (colors.length - 1);
  const lowerIndex = Math.floor(scaledIndex);
  const upperIndex = Math.min(lowerIndex + 1, colors.length - 1);
  const fraction = scaledIndex - lowerIndex;

  if (fraction < 0.01) return colors[lowerIndex];
  return interpolateColors(colors[lowerIndex], colors[upperIndex], fraction);
}

// Preset color scales
export const workoutScale: HeatmapColorScale = {
  colors: ['#C7C7C7', '#FFFF00', '#FF9500', '#FF3B30'],
  interpolation: 'linear',
};

export const thermalScale: HeatmapColorScale = {
  colors: ['#007AFF', '#34C759', '#FFFF00', '#FF3B30'],
  interpolation: 'linear',
};

export const medicalScale: HeatmapColorScale = {
  colors: ['#34C759', '#FFFF00', '#FF3B30'],
  interpolation: 'linear',
};

export const monochromeScale: HeatmapColorScale = {
  colors: ['#D9D9D9', '#262626'],
  interpolation: 'linear',
};

export const workoutSteppedScale: HeatmapColorScale = {
  colors: ['#C7C7C7', '#FFFF00', '#FF9500', '#FF3B30'],
  interpolation: { type: 'step', count: 5 },
};

export const thermalSmoothScale: HeatmapColorScale = {
  colors: ['#007AFF', '#34C759', '#FFFF00', '#FF3B30'],
  interpolation: 'easeInOut',
};

export type HeatmapScalePreset =
  | 'workout'
  | 'thermal'
  | 'medical'
  | 'monochrome'
  | 'workoutStepped'
  | 'thermalSmooth';

export function getPresetScale(preset: HeatmapScalePreset): HeatmapColorScale {
  switch (preset) {
    case 'thermal': return thermalScale;
    case 'medical': return medicalScale;
    case 'monochrome': return monochromeScale;
    case 'workoutStepped': return workoutSteppedScale;
    case 'thermalSmooth': return thermalSmoothScale;
    default: return workoutScale;
  }
}

export interface HeatmapConfig {
  colorScale?: HeatmapColorScale;
  interpolation?: ColorInterpolation;
  threshold?: number;
  gradientFill?: boolean;
  gradientDirection?: 'topToBottom' | 'bottomToTop' | 'leftToRight' | 'rightToLeft';
  gradientLowFactor?: number;
}

// Convert MuscleIntensity[] to MuscleHighlight[]
export function intensitiesToHighlights(
  data: MuscleIntensity[],
  config: HeatmapConfig = {},
): MuscleHighlight[] {
  const scale = config.colorScale ?? workoutScale;
  const effectiveScale: HeatmapColorScale = {
    colors: scale.colors,
    interpolation: config.interpolation ?? scale.interpolation,
  };
  const threshold = config.threshold;

  return data
    .filter((entry) => threshold === undefined || entry.intensity >= threshold)
    .map((entry) => {
      if (entry.color) {
        return { muscle: entry.muscle, fill: { type: 'color' as const, color: entry.color }, opacity: 1 };
      }
      if (config.gradientFill) {
        const highColor = colorForIntensity(effectiveScale, entry.intensity);
        const lowColor = colorForIntensity(effectiveScale, entry.intensity * (config.gradientLowFactor ?? 0.3));
        return {
          muscle: entry.muscle,
          fill: {
            type: 'linearGradient' as const,
            colors: [lowColor, highColor],
            direction: config.gradientDirection ?? 'topToBottom',
          },
          opacity: 1,
        };
      }
      const color = colorForIntensity(effectiveScale, entry.intensity);
      return { muscle: entry.muscle, fill: { type: 'color' as const, color }, opacity: 1 };
    });
}

// Convert intensity map (0-4 scale) to highlights
export function intensityMapToHighlights(
  data: Partial<Record<Muscle, number>>,
  scale: HeatmapColorScale = workoutScale,
): MuscleHighlight[] {
  return Object.entries(data).map(([muscle, level]) => {
    const clamped = Math.min(Math.max(level as number, 0), 4);
    const normalized = clamped / 4;
    const color = colorForIntensity(scale, normalized);
    return {
      muscle: muscle as Muscle,
      fill: { type: 'color' as const, color },
      opacity: 1,
    };
  });
}
