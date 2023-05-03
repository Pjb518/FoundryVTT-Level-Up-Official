type ActionConsumer = {

};

type ActionRoll = {

};

type ActionPrompt = {

};

interface ActionRange {
  range: string | number;
  unit?: string
}

interface ScalingConfig {
  formula: string;
  mode: string;
  step?: number;
}

// +++++++++++++++++++++++++++++++++++++++++++++++++++
//      Action Type
// +++++++++++++++++++++++++++++++++++++++++++++++++++
interface Action {
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
}
