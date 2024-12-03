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

export interface ActorRollOptions {
	expertiseDice?: number | undefined;
	rollMode?: number | undefined;
	situationalMods?: string | undefined;
	skipRollDialog?: boolean | undefined;
	visibilityMode?: foundry.CONST.DICE_ROLL_MODES | undefined;
}

export interface AbilityCheckRollOptions extends ActorRollOptions {}

export interface SavingThrowRollOptions extends ActorRollOptions {
	saveType?: 'concentration' | 'death' | undefined;
}

export interface SkillCheckRollOptions extends ActorRollOptions {
	abilityKey?: string | undefined;
	minRoll?: number | undefined;
}
