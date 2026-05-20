import { BodyPartPathData, BodyGender, BodySide, BodyViewBox } from '../types';
import { maleFrontPaths } from './maleFrontPaths';
import { maleBackPaths } from './maleBackPaths';
import { femaleFrontPaths } from './femaleFrontPaths';
import { femaleBackPaths } from './femaleBackPaths';

export function getBodyPaths(gender: BodyGender, side: BodySide): BodyPartPathData[] {
  if (gender === 'male' && side === 'front') return maleFrontPaths;
  if (gender === 'male' && side === 'back') return maleBackPaths;
  if (gender === 'female' && side === 'front') return femaleFrontPaths;
  return femaleBackPaths;
}

export function getViewBox(gender: BodyGender, side: BodySide): BodyViewBox {
  if (gender === 'male' && side === 'front') return { x: 0, y: 95, width: 727, height: 1280 };
  if (gender === 'male' && side === 'back') return { x: 718, y: 95, width: 727, height: 1280 };
  if (gender === 'female' && side === 'front') return { x: 0, y: 0, width: 650, height: 1450 };
  return { x: 823, y: 0, width: 650, height: 1450 };
}

export function viewBoxString(vb: BodyViewBox): string {
  return `${vb.x} ${vb.y} ${vb.width} ${vb.height}`;
}
