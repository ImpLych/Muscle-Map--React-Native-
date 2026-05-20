// MuscleMap React Native - Types

export type Muscle =
  | 'abs'
  | 'biceps'
  | 'calves'
  | 'chest'
  | 'deltoids'
  | 'feet'
  | 'forearm'
  | 'gluteal'
  | 'hamstring'
  | 'hands'
  | 'head'
  | 'knees'
  | 'lower-back'
  | 'obliques'
  | 'quadriceps'
  | 'rotator-cuff'
  | 'serratus'
  | 'rhomboids'
  | 'tibialis'
  | 'trapezius'
  | 'triceps'
  | 'upper-back'
  // Sub-groups
  | 'ankles'
  | 'adductors'
  | 'neck'
  | 'hip-flexors'
  | 'upper-chest'
  | 'lower-chest'
  | 'inner-quad'
  | 'outer-quad'
  | 'upper-abs'
  | 'lower-abs'
  | 'front-deltoid'
  | 'rear-deltoid'
  | 'upper-trapezius'
  | 'lower-trapezius';

export type BodySlug = Muscle | 'hair';

export type BodyGender = 'male' | 'female';
export type BodySide = 'front' | 'back';
export type MuscleSide = 'left' | 'right' | 'both';

export type GradientDirection = 'topToBottom' | 'bottomToTop' | 'leftToRight' | 'rightToLeft';

export interface LinearGradientFill {
  type: 'linearGradient';
  colors: string[];
  direction: GradientDirection;
}

export interface RadialGradientFill {
  type: 'radialGradient';
  colors: string[];
}

export interface SolidFill {
  type: 'color';
  color: string;
}

export type MuscleFill = SolidFill | LinearGradientFill | RadialGradientFill;

export interface MuscleHighlight {
  muscle: Muscle;
  fill: MuscleFill;
  opacity?: number;
}

export interface MuscleIntensity {
  muscle: Muscle;
  intensity: number; // 0.0 – 1.0
  side?: MuscleSide;
  color?: string;
}

export interface BodyPartPathData {
  slug: BodySlug;
  common: string[];
  left: string[];
  right: string[];
}

export interface BodyViewBox {
  x: number;
  y: number;
  width: number;
  height: number;
}

// Muscle metadata helpers
export const MUSCLE_SUB_GROUPS: Partial<Record<Muscle, Muscle[]>> = {
  chest: ['upper-chest', 'lower-chest'],
  quadriceps: ['inner-quad', 'outer-quad', 'hip-flexors'],
  abs: ['upper-abs', 'lower-abs'],
  deltoids: ['front-deltoid', 'rear-deltoid'],
  trapezius: ['upper-trapezius', 'lower-trapezius'],
  obliques: ['serratus'],
  feet: ['ankles'],
  hamstring: ['adductors'],
  head: ['neck'],
};

export const MUSCLE_PARENT_GROUP: Partial<Record<Muscle, Muscle>> = {
  'upper-chest': 'chest',
  'lower-chest': 'chest',
  'inner-quad': 'quadriceps',
  'outer-quad': 'quadriceps',
  'hip-flexors': 'quadriceps',
  'upper-abs': 'abs',
  'lower-abs': 'abs',
  'front-deltoid': 'deltoids',
  'rear-deltoid': 'deltoids',
  'upper-trapezius': 'trapezius',
  'lower-trapezius': 'trapezius',
  serratus: 'obliques',
  ankles: 'feet',
  adductors: 'hamstring',
  neck: 'head',
};

// Sub-groups that are always visible (even when hideSubGroups is true)
export const ALWAYS_VISIBLE_SUB_GROUPS: Muscle[] = ['ankles', 'adductors', 'neck'];

export function isSubGroup(muscle: Muscle): boolean {
  return muscle in MUSCLE_PARENT_GROUP;
}

export function isAlwaysVisibleSubGroup(muscle: Muscle): boolean {
  return ALWAYS_VISIBLE_SUB_GROUPS.includes(muscle);
}

export function getParentGroup(muscle: Muscle): Muscle | undefined {
  return MUSCLE_PARENT_GROUP[muscle];
}

export function slugToMuscle(slug: BodySlug): Muscle | null {
  if (slug === 'hair') return null;
  return slug as Muscle;
}

export const MUSCLE_DISPLAY_NAMES: Record<Muscle, string> = {
  abs: 'Abs',
  biceps: 'Biceps',
  calves: 'Calves',
  chest: 'Chest',
  deltoids: 'Deltoids',
  feet: 'Feet',
  forearm: 'Forearm',
  gluteal: 'Glutes',
  hamstring: 'Hamstrings',
  hands: 'Hands',
  head: 'Head',
  knees: 'Knees',
  'lower-back': 'Lower Back',
  obliques: 'Obliques',
  quadriceps: 'Quadriceps',
  'rotator-cuff': 'Rotator Cuff',
  serratus: 'Serratus',
  rhomboids: 'Rhomboids',
  tibialis: 'Tibialis',
  trapezius: 'Trapezius',
  triceps: 'Triceps',
  'upper-back': 'Upper Back',
  ankles: 'Ankles',
  adductors: 'Adductors',
  neck: 'Neck',
  'hip-flexors': 'Hip Flexors',
  'upper-chest': 'Upper Chest',
  'lower-chest': 'Lower Chest',
  'inner-quad': 'Inner Quad',
  'outer-quad': 'Outer Quad',
  'upper-abs': 'Upper Abs',
  'lower-abs': 'Lower Abs',
  'front-deltoid': 'Front Deltoid',
  'rear-deltoid': 'Rear Deltoid',
  'upper-trapezius': 'Upper Trapezius',
  'lower-trapezius': 'Lower Trapezius',
};
