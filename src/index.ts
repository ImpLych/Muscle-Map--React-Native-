export { BodyView } from './BodyView';
export type { BodyViewProps } from './BodyView';

export type {
  Muscle,
  BodySlug,
  BodyGender,
  BodySide,
  MuscleSide,
  GradientDirection,
  LinearGradientFill,
  RadialGradientFill,
  SolidFill,
  MuscleFill,
  MuscleHighlight,
  MuscleIntensity,
  BodyPartPathData,
  BodyViewBox,
} from './types';

export {
  MUSCLE_SUB_GROUPS,
  MUSCLE_PARENT_GROUP,
  ALWAYS_VISIBLE_SUB_GROUPS,
  MUSCLE_DISPLAY_NAMES,
  isSubGroup,
  isAlwaysVisibleSubGroup,
  getParentGroup,
  slugToMuscle,
} from './types';

export type { BodyViewStyle, BodyStylePreset } from './styles';
export {
  defaultBodyStyle,
  minimalBodyStyle,
  neonBodyStyle,
  medicalBodyStyle,
  getPresetStyle,
} from './styles';

export type {
  ColorInterpolation,
  HeatmapColorScale,
  HeatmapScalePreset,
  HeatmapConfig,
} from './heatmap';

export {
  colorForIntensity,
  workoutScale,
  thermalScale,
  medicalScale,
  monochromeScale,
  workoutSteppedScale,
  thermalSmoothScale,
  getPresetScale,
  intensitiesToHighlights,
  intensityMapToHighlights,
} from './heatmap';

export { getBodyPaths, getViewBox, viewBoxString } from './paths/bodyPathProvider';
