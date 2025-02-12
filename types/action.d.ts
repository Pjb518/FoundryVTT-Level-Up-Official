import type { A5EActionData } from '../src/dataModels/item/actions/ActionDataModel';

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
// export interface Action {
//   name: string;
//   description: string;
//   descriptionOutputs: ('action' | 'item')[];
//   img: string;
//   activation: ActivationProperties;
//   area: CircleArea | ConeArea | CubeArea | CylinderArea | LineArea | SphereArea | undefined;
//   duration: DurationProperties

//   consumers: { [id: string]: Consumers };

//   prompts: {};

//   ranges: { [id: string]: ActionRange };
//   rolls: { [id: string]: Rolls };

//   target: TargetProperties;
//   uses: UsesProperties;
// }

export type Action = InstanceType<typeof A5EActionData>;
