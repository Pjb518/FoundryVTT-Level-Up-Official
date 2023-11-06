type AreaShape = 'circle' | 'cone' | 'cube' | 'cylinder' | 'emanation' | 'line' | 'sphere' | 'square' | 'wall';

interface BaseTemplateArea {
  quantity: number;
  shape: AreaShape;

  scaling?: {
    formula: { [prop: string]: string };
    mode: string;
    step?: number;
  }

  placeTemplate?: boolean;
}

interface CircleArea extends BaseTemplateArea {
  radius: number
}

interface ConeArea extends BaseTemplateArea {
  length: number
}

interface CubeArea extends BaseTemplateArea {
  width: number
}

interface CylinderArea extends BaseTemplateArea {
  radius: number
  height?: number
}

interface EmanationArea extends BaseTemplateArea {
  radius: number
}

interface LineArea extends BaseTemplateArea {
  length: number
  width?: number
}

interface SphereArea extends BaseTemplateArea {
  radius: number
}

interface SquareArea extends BaseTemplateArea {
  width: number
}

interface WallArea extends BaseTemplateArea {
  height?: number
  length: number,
  width?: number
}

type TemplateArea =
  | CircleArea
  | ConeArea
  | CubeArea
  | CylinderArea
  | EmanationArea
  | LineArea
  | SphereArea
  | SquareArea
  | WallArea;
