type AreaShape = 'circle' | 'cone' | 'cube' | 'cylinder' | 'line' | 'sphere' | 'square';

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
  height: number
}

interface LineArea extends BaseTemplateArea {
  length: number
  width: number
}

interface SphereArea extends BaseTemplateArea {
  radius: number
}

interface SquareArea extends BaseTemplateArea {
  width: number
}
