import { Color } from 'three';

export const COLORS = {
  BACKGROUND: new Color('#F5F2EB'),
  SAND_BASE: new Color('#E8E0D0'),
  SAND_SHADOWS: new Color('#D4C9B8'),
  SAND_HIGHLIGHTS: new Color('#F9F6F0'),
  STONE_DARK: new Color('#4A4A48'),
  STONE_MID: new Color('#6B6B68'),
  STONE_LIGHT: new Color('#8A8A86'),
  MOSS: new Color('#5C6B54'),
  WOOD: new Color('#A68B6A'),
  ACCENT: new Color('#C4A882'),
};

export const CONFIG = {
  GARDEN_SIZE: 20,
  CAMERA: {
    FOV: 45,
    NEAR: 0.1,
    FAR: 100,
    INITIAL_POSITION: { x: 0, y: 12, z: 12 },
    LOOK_AT: { x: 0, y: 0, z: 2 },
  },
  LIGHTING: {
    SUN_INTENSITY: 1.5,
    AMBIENT_INTENSITY: 0.4,
    HEMISPHERE_INTENSITY: 0.6,
  }
};
