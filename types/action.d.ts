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

interface ActivationProperties {
  cost?: number;
  type: string;
  reactionTrigger?: string;
}

interface DurationProperties {
  unit: string;
  value?: number;
}

interface RechargeProperties {
  formula: string;
  threshold: number;
}

interface ScalingProperties {
  formula: string;
  mode: string;
  step?: number;
}

interface TargetProperties {
  quantity?: number;
  scaling: ScalingProperties;
  type: string;
}

interface UsesProperties {
  value: number;
  max: string;
  per: string;
  recharge?: RechargeProperties
}

// +++++++++++++++++++++++++++++++++++++++++++++++++++
//      Action Type
// +++++++++++++++++++++++++++++++++++++++++++++++++++
interface Action {
  name: string;
  description?: string;
  activation: ActivationProperties;
  area: CircleArea | ConeArea | CubeArea | CylinderArea | LineArea | SphereArea | undefined;
  duration: DurationProperties

  consumers: {};

  prompts: {};

  ranges: { [id: string]: ActionRange };
  rolls: { [id: string]: Rolls };

  target: TargetProperties;
  uses: UsesProperties;
}
