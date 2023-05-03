// ---------------------------------------------------
//      Action Area Helpers
// ---------------------------------------------------
type AreaShape = 'circle' | 'cone' | 'cube' | 'cylinder' | 'line' | 'sphere' | 'square';

type BaseActionArea = {
  quantity: number;
  shape: AreaShape;

  scaling?: {
    formula: { [prop: string]: string };
    mode: string;
    step?: number;
  }

  placeTemplate?: boolean;
};

type CircleArea = {
  radius: number
} & BaseActionArea;

type ConeArea = {
  length: number
} & BaseActionArea;

type CubeArea = {
  width: number
} & BaseActionArea;

type CylinderArea = {
  radius: number
  height: number
} & BaseActionArea;

type LineArea = {
  length: number
  width: number
} & BaseActionArea;

type SphereArea = {
  radius: number
} & BaseActionArea;

type SquareArea = {
  width: number
} & BaseActionArea;

type ActionConsumer = {

};

type ActionRoll = {

};

type ActionPrompt = {

};

type ActionRange = {
  range: string | number;
  unit?: string
};

type ScalingConfig = {
  formula: string;
  mode: string;
  step?: number;
};

// +++++++++++++++++++++++++++++++++++++++++++++++++++
//      Action Type
// +++++++++++++++++++++++++++++++++++++++++++++++++++
export type Action = {
  name: string;
  description?: string;

  activation: {
    cost?: number;
    type: string;
    reactionTrigger?: string;
  };

  area: CircleArea | ConeArea | CubeArea | CylinderArea | LineArea | SphereArea | undefined;

  duration: {
    unit: string;
    value?: number;
  };

  consumers: {};

  prompts: {};

  ranges: { [id: string]: ActionRange };

  rolls: {};

  target: {
    quantity?: number;
    scaling: ScalingConfig;
    type: string;
  }

  uses: {
    value: number;
    max: string;
    per: string;
    recharge?: {
      formula: string;
      threshold: number;
    }
  };
};
