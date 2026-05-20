import React, { useMemo } from 'react';
import { StyleSheet, View, ViewStyle } from 'react-native';
import Svg, { Path, Defs, LinearGradient, Stop, G } from 'react-native-svg';

import {
  Muscle,
  BodySlug,
  BodyGender,
  BodySide,
  MuscleHighlight,
  MuscleIntensity,
  MuscleFill,
  MUSCLE_PARENT_GROUP,
  MUSCLE_SUB_GROUPS,
  ALWAYS_VISIBLE_SUB_GROUPS,
  slugToMuscle,
} from './types';
import { BodyViewStyle, defaultBodyStyle, getPresetStyle, BodyStylePreset } from './styles';
import { HeatmapConfig, intensitiesToHighlights } from './heatmap';
import { getBodyPaths, getViewBox, viewBoxString } from './paths/bodyPathProvider';

export interface BodyViewProps {
  gender?: BodyGender;
  side?: BodySide;
  highlights?: MuscleHighlight[];
  intensities?: MuscleIntensity[];
  heatmapConfig?: HeatmapConfig;
  selected?: Muscle[];
  onMusclePress?: (muscle: Muscle) => void;
  onMuscleLongPress?: (muscle: Muscle) => void;
  bodyStyle?: BodyViewStyle | BodyStylePreset;
  showSubGroups?: boolean;
  style?: ViewStyle;
  width?: number;
  height?: number;
}

interface ResolvedFill {
  color: string;
  gradientId?: string;
  isGradient: boolean;
  gradientColors?: string[];
  x1?: string;
  y1?: string;
  x2?: string;
  y2?: string;
}

function gradientCoords(direction: string): { x1: string; y1: string; x2: string; y2: string } {
  switch (direction) {
    case 'bottomToTop': return { x1: '0', y1: '1', x2: '0', y2: '0' };
    case 'leftToRight': return { x1: '0', y1: '0', x2: '1', y2: '0' };
    case 'rightToLeft': return { x1: '1', y1: '0', x2: '0', y2: '0' };
    default: return { x1: '0', y1: '0', x2: '0', y2: '1' };
  }
}

export const BodyView: React.FC<BodyViewProps> = ({
  gender = 'male',
  side = 'front',
  highlights = [],
  intensities,
  heatmapConfig,
  selected = [],
  onMusclePress,
  onMuscleLongPress,
  bodyStyle,
  showSubGroups = false,
  style,
  width,
  height,
}) => {
  const resolvedStyle: BodyViewStyle = useMemo(() => {
    if (!bodyStyle) return defaultBodyStyle;
    if (typeof bodyStyle === 'string') return getPresetStyle(bodyStyle);
    return bodyStyle;
  }, [bodyStyle]);

  const allHighlights: MuscleHighlight[] = useMemo(() => {
    if (intensities && intensities.length > 0) {
      return intensitiesToHighlights(intensities, heatmapConfig);
    }
    return highlights;
  }, [highlights, intensities, heatmapConfig]);

  const highlightMap = useMemo(() => {
    const map = new Map<Muscle, MuscleHighlight>();
    for (const h of allHighlights) map.set(h.muscle, h);
    return map;
  }, [allHighlights]);

  const paths = useMemo(() => getBodyPaths(gender, side), [gender, side]);
  const viewBox = useMemo(() => getViewBox(gender, side), [gender, side]);
  const vbString = viewBoxString(viewBox);

  const gradientDefs = useMemo(() => {
    const defs: React.ReactNode[] = [];
    let idx = 0;
    for (const [muscle, h] of highlightMap.entries()) {
      if (h.fill.type === 'linearGradient') {
        const coords = gradientCoords(h.fill.direction);
        const id = `lg_${muscle}_${idx++}`;
        defs.push(
          <LinearGradient key={id} id={id} x1={coords.x1} y1={coords.y1} x2={coords.x2} y2={coords.y2}>
            {h.fill.colors.map((c, i) => (
              <Stop key={i} offset={`${i / (h.fill.colors.length - 1)}`} stopColor={c} stopOpacity="1" />
            ))}
          </LinearGradient>
        );
      }
    }
    return defs;
  }, [highlightMap]);

  const gradientIdMap = useMemo(() => {
    const map = new Map<Muscle, string>();
    let idx = 0;
    for (const [muscle, h] of highlightMap.entries()) {
      if (h.fill.type === 'linearGradient') {
        map.set(muscle, `lg_${muscle}_${idx++}`);
      }
    }
    return map;
  }, [highlightMap]);

  function resolveFillForSlug(slug: BodySlug): { fill: string; stroke: string; strokeWidth: number; opacity: number } {
    const muscle = slugToMuscle(slug);

    if (slug === 'hair') {
      return { fill: resolvedStyle.hairColor, stroke: 'none', strokeWidth: 0, opacity: 1 };
    }
    if (slug === 'head') {
      return { fill: resolvedStyle.headColor, stroke: resolvedStyle.strokeColor, strokeWidth: resolvedStyle.strokeWidth, opacity: 1 };
    }

    if (!muscle) {
      return { fill: resolvedStyle.defaultFillColor, stroke: resolvedStyle.strokeColor, strokeWidth: resolvedStyle.strokeWidth, opacity: 1 };
    }

    const isSelected = selected.includes(muscle);
    if (isSelected) {
      return {
        fill: resolvedStyle.selectionColor,
        stroke: resolvedStyle.selectionStrokeColor,
        strokeWidth: resolvedStyle.selectionStrokeWidth,
        opacity: 1,
      };
    }

    let highlight = highlightMap.get(muscle);

    if (!highlight) {
      const parent = MUSCLE_PARENT_GROUP[muscle];
      if (parent) highlight = highlightMap.get(parent);
    }

    if (highlight) {
      if (highlight.fill.type === 'linearGradient') {
        const gradId = gradientIdMap.get(muscle) ?? (MUSCLE_PARENT_GROUP[muscle] ? gradientIdMap.get(MUSCLE_PARENT_GROUP[muscle]!) : undefined);
        return {
          fill: gradId ? `url(#${gradId})` : highlight.fill.colors[0],
          stroke: resolvedStyle.strokeColor,
          strokeWidth: resolvedStyle.strokeWidth,
          opacity: highlight.opacity ?? 1,
        };
      }
      if (highlight.fill.type === 'color') {
        return {
          fill: highlight.fill.color,
          stroke: resolvedStyle.strokeColor,
          strokeWidth: resolvedStyle.strokeWidth,
          opacity: highlight.opacity ?? 1,
        };
      }
      if (highlight.fill.type === 'radialGradient') {
        return {
          fill: highlight.fill.colors[0],
          stroke: resolvedStyle.strokeColor,
          strokeWidth: resolvedStyle.strokeWidth,
          opacity: highlight.opacity ?? 1,
        };
      }
    }

    return {
      fill: resolvedStyle.defaultFillColor,
      stroke: resolvedStyle.strokeColor,
      strokeWidth: resolvedStyle.strokeWidth,
      opacity: 1,
    };
  }

  function shouldShowSlug(slug: BodySlug): boolean {
    if (slug === 'hair' || slug === 'head') return true;
    const muscle = slugToMuscle(slug);
    if (!muscle) return true;
    const parent = MUSCLE_PARENT_GROUP[muscle];
    if (!parent) return true;
    if (ALWAYS_VISIBLE_SUB_GROUPS.includes(muscle)) return true;
    return showSubGroups;
  }

  function handlePress(slug: BodySlug) {
    if (!onMusclePress) return;
    const muscle = slugToMuscle(slug);
    if (!muscle) return;
    const parent = MUSCLE_PARENT_GROUP[muscle];
    if (parent && !showSubGroups) {
      onMusclePress(parent);
    } else {
      onMusclePress(muscle);
    }
  }

  function handleLongPress(slug: BodySlug) {
    if (!onMuscleLongPress) return;
    const muscle = slugToMuscle(slug);
    if (!muscle) return;
    onMuscleLongPress(muscle);
  }

  const svgWidth = width ?? '100%';
  const svgHeight = height ?? '100%';

  return (
    <View style={[styles.container, style]}>
      <Svg
        width={svgWidth}
        height={svgHeight}
        viewBox={vbString}
        preserveAspectRatio="xMidYMid meet"
      >
        {gradientDefs.length > 0 && <Defs>{gradientDefs}</Defs>}
        {paths.map((part) => {
          if (!shouldShowSlug(part.slug)) return null;
          const f = resolveFillForSlug(part.slug);
          const allPathStrings = [...part.common, ...part.left, ...part.right];
          return (
            <G key={part.slug}>
              {allPathStrings.map((d, i) => (
                <Path
                  key={i}
                  d={d}
                  fill={f.fill}
                  stroke={f.stroke}
                  strokeWidth={f.strokeWidth}
                  opacity={f.opacity}
                  onPress={() => handlePress(part.slug)}
                  onLongPress={() => handleLongPress(part.slug)}
                />
              ))}
            </G>
          );
        })}
      </Svg>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default BodyView;
