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
  radius: number | string
}

interface ConeArea extends BaseTemplateArea {
  length: number | string
}

interface CubeArea extends BaseTemplateArea {
  width: number | string
}

interface CylinderArea extends BaseTemplateArea {
  radius: number | string
  height?: number | string
}

interface EmanationArea extends BaseTemplateArea {
  radius: number | string
}

interface LineArea extends BaseTemplateArea {
  length: number | string
  width?: number | string
}

interface SphereArea extends BaseTemplateArea {
  radius: number | string
}

interface SquareArea extends BaseTemplateArea {
  width: number
}

interface WallArea extends BaseTemplateArea {
  height?: number | string
  length: number | string,
  width?: number | string
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
