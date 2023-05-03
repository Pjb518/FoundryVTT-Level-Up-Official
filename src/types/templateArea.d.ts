type AreaShape = 'circle' | 'cone' | 'cube' | 'cylinder' | 'line' | 'sphere' | 'square';

type BaseTemplateArea = {
  quantity: number;
  shape: AreaShape;

  scaling?: {
    formula: { [prop: string]: string };
    mode: string;
    step?: number;
  }

  placeTemplate?: boolean;
};

export type CircleArea = {
  radius: number
} & BaseTemplateArea;

export type ConeArea = {
  length: number
} & BaseTemplateArea;

export type CubeArea = {
  width: number
} & BaseTemplateArea;

export type CylinderArea = {
  radius: number
  height: number
} & BaseTemplateArea;

export type LineArea = {
  length: number
  width: number
} & BaseTemplateArea;

export type SphereArea = {
  radius: number
} & BaseTemplateArea;

export type SquareArea = {
  width: number
} & BaseTemplateArea;
