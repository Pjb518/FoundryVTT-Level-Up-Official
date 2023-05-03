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

interface ActivationConfig {
  cost?: number;
  type: string;
  reactionTrigger?: string;
}

interface DurationConfig {
  unit: string;
  value?: number;
}

interface RechargeConfig {
  formula: string;
  threshold: number;
}

interface ScalingConfig {
  formula: string;
  mode: string;
  step?: number;
}

interface TargetConfig {
  quantity?: number;
  scaling: ScalingConfig;
  type: string;
}

interface UsesConfig {
  value: number;
  max: string;
  per: string;
  recharge?: RechargeConfig
}

// +++++++++++++++++++++++++++++++++++++++++++++++++++
//      Action Type
// +++++++++++++++++++++++++++++++++++++++++++++++++++
interface Action {
  name: string;
  description?: string;
  activation: ActivationConfig;
  area: CircleArea | ConeArea | CubeArea | CylinderArea | LineArea | SphereArea | undefined;
  duration: DurationConfig

  consumers: {};

  prompts: {};

  ranges: { [id: string]: ActionRange };

  rolls: {};

  target: TargetConfig;
  uses: UsesConfig;
}
