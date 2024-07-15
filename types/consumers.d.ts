type ConsumerTypes = 'actionUses' | 'ammunition' | 'hitDice' | 'itemUses' | 'quantity' | 'resource' | 'spell';

type SpellConsumerModes = 'variable' | 'chargesOnly' | 'inventionsOnly' | 'slotsOnly' | 'pointsOnly';

interface BaseConsumer {
  type: ConsumerTypes;
  label?: string;
  default?: boolean;
}

interface ActionUsesConsumer extends BaseConsumer {
  quantity: number;
}

interface AmmunitionConsumer extends BaseConsumer {
  itemId: string;
  quantity: number;
}

interface HitDiceConsumer extends BaseConsumer {
  quantity: string;
}

interface ItemUsesConsumer extends BaseConsumer {
  quantity: number;
}

interface QuantityConsumer extends BaseConsumer {
  itemId: string;
  quantity: number;
}

interface ResourceConsumer extends BaseConsumer {
  classIdentifier: string;
  resource: string;
  quantity: number;
}

export interface SpellConsumer extends BaseConsumer {
  mode: SpellConsumerModes;
  charges: number;
  points: number;
  spellLevel: number;
}

type Consumers = ActionUsesConsumer | AmmunitionConsumer | HitDiceConsumer | ItemUsesConsumer
  | QuantityConsumer | ResourceConsumer | SpellConsumer;

// ****************************************************
// Manipulated Consumer Data
// ****************************************************
export interface ActionUsesConsumerData {
  baseUses: number;
  quantity: number;
}

export interface ItemUsesConsumerData {
  baseUses: number;
  quantity: number;
}

export interface HitDiceConsumerData {
  selected: { [die: string]: number };
  default: number;
}

export interface SpellConsumerData {
  basePoints: number;
  baseCharges: number;
  baseLevel: number;
  charges: number;
  level: number;
  points: number;
  consume: 'artifactCharge' | 'noConsume' | 'spellPoint' | 'spellSlot';
}

export type ConsumptionData = {
  actionUses: ActionUsesConsumerData;
  hitDice: HitDiceConsumerData;
  itemUses: ItemUsesConsumerData;
  spell: SpellConsumerData;
};
