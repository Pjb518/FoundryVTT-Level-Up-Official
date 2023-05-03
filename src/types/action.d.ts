export type Action = {
  name: string;
  description?: string;

  activation: {
    cost?: number;
    type: string;
    reactionTrigger?: string;
  };

  area: ActionArea | undefined;

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

// ---------------------------------------------------
//      Action Area Helpers
// ---------------------------------------------------
type AreaShape = 'circle' | 'cone' | 'cube' | 'cylinder' | 'line' | 'sphere' | 'square';

type ActionArea = {
  quantity: number;
  shape: AreaShape;
  height?: number;
  length?: number;
  radius?: number;
  width?: number;

  scaling?: {
    formula: { [prop: string]: string };
    mode: string;
    step?: number;
  }

  placeTemplate?: boolean;
}

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
