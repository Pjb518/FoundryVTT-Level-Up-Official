export interface ActorDialogs {
  abilities: Record<string, any>;
  bonuses: Record<string, any>;
  genericResources: Record<string, any>;
  skills: Record<string, any>;
  notes: Record<string, any>;
}

export interface ActorRestOptions {
  consumeSupply?: boolean;
  haven?: boolean;
  recoverStrifeAndFatigue?: boolean;
  restType?: 'long' | 'short';
}
