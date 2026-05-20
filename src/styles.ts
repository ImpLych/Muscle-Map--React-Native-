// MuscleMap React Native - Body View Styles

export interface BodyViewStyle {
  defaultFillColor: string;
  strokeColor: string;
  strokeWidth: number;
  selectionColor: string;
  selectionStrokeColor: string;
  selectionStrokeWidth: number;
  headColor: string;
  hairColor: string;
  shadowColor?: string;
  shadowRadius?: number;
}

export const defaultBodyStyle: BodyViewStyle = {
  defaultFillColor: '#C7C7C7', // Color(white: 0.78)
  strokeColor: 'transparent',
  strokeWidth: 0,
  selectionColor: '#34C759', // green
  selectionStrokeColor: '#34C759',
  selectionStrokeWidth: 2,
  headColor: '#BFBFBF', // Color(white: 0.75)
  hairColor: '#404040', // Color(white: 0.25)
};

export const minimalBodyStyle: BodyViewStyle = {
  defaultFillColor: '#E0E0E0', // mmLighterFill Color(white: 0.88)
  strokeColor: '#B3B3B3',      // mmMediumFill Color(white: 0.7)
  strokeWidth: 0.5,
  selectionColor: '#34C759',
  selectionStrokeColor: '#34C759',
  selectionStrokeWidth: 1.5,
  headColor: '#BFBFBF',
  hairColor: '#404040',
};

export const neonBodyStyle: BodyViewStyle = {
  defaultFillColor: '#262626', // Color(white: 0.15)
  strokeColor: '#4D4D4D',      // Color(white: 0.3)
  strokeWidth: 0.5,
  selectionColor: '#32ADE6',   // cyan
  selectionStrokeColor: '#32ADE6',
  selectionStrokeWidth: 2,
  headColor: '#333333',        // Color(white: 0.2)
  hairColor: '#1A1A1A',        // Color(white: 0.1)
  shadowColor: 'rgba(50, 173, 230, 0.6)',
  shadowRadius: 8,
};

export const medicalBodyStyle: BodyViewStyle = {
  defaultFillColor: '#E6EBF2', // rgb(0.9, 0.92, 0.95)
  strokeColor: '#B3BFC9',      // rgb(0.7, 0.75, 0.8)
  strokeWidth: 0.5,
  selectionColor: '#007AFF',   // blue
  selectionStrokeColor: '#007AFF',
  selectionStrokeWidth: 2,
  headColor: '#D9DDE6',        // rgb(0.85, 0.87, 0.9)
  hairColor: '#4D5159',        // rgb(0.3, 0.32, 0.35)
};

export type BodyStylePreset = 'default' | 'minimal' | 'neon' | 'medical';

export function getPresetStyle(preset: BodyStylePreset): BodyViewStyle {
  switch (preset) {
    case 'minimal': return minimalBodyStyle;
    case 'neon': return neonBodyStyle;
    case 'medical': return medicalBodyStyle;
    default: return defaultBodyStyle;
  }
}
