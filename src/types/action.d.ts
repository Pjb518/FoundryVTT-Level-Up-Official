export type action = {
  name: string;
  description?: string;

  activation: {
    cost?: number;
    type: string;
    reactionTrigger?: string;
  };

  area: actionArea | undefined;

  duration: {
    unit: string;
    value?: number;
  };


  consumers: {};

  prompts: {};

  ranges: { [id: string]: actionRange };

  rolls: {};

  target: {
    quantity?: number;
    scaling: scalingConfig;
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
type areaShape = 'circle' | 'cone' | 'cube' | 'cylinder' | 'line' | 'sphere' | 'square';

type actionArea = {
  quantity: number;
  shape: areaShape;
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




type actionConsumer = {

};

type actionRoll = {

};

type actionPrompt = {

};

type actionRange = {
  range: string | number;
  unit?: string
};

type scalingConfig = {
  formula: string;
  mode: string;
  step?: number;
};
