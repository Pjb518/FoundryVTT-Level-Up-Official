import type { InitiativeRollOptions } from '#documents/actor/data.ts';
import ModifierManager from '#managers/ModifierManager.js';
import { RollOverrideManager } from '#managers/RollOverrideManager.ts';
import constructD20RollFormula from '../dice/constructD20RollFormula.js';

export default function getDefaultInitiativeFormula(actor, options = {} as InitiativeRollOptions) {
	const { initiative } = actor.system.attributes;
	const abilityKey = options.abilityKey ?? 'dex';
	const { skillKey } = options;
	const defaultRollMode = options?.rollMode ?? CONFIG.A5E.ROLL_MODE.NORMAL;

	const ability = actor.system.abilities[abilityKey].check;
	const skill = actor.system.skills[skillKey!];

	const others = [] as any[];
	if (ability) others.push({ type: 'ability', src: ability });
	if (skill) others.push({ type: 'skill', src: skill });

	const expertiseDie = RollOverrideManager.resolveExpertiseDie(initiative, { others }).value;

	const rollMode = RollOverrideManager.resolveRollMode(initiative, defaultRollMode, {
		others,
	}).value;

	const modifierManager = new ModifierManager(actor, {
		ability: abilityKey,
		expertiseDie,
		type: 'initiative',
		situationalMods: options.situationalMods,
		skill: skillKey,
	});

	return constructD20RollFormula({
		actor,
		rollMode,
		modifiers: modifierManager.getModifiers(),
	}).rollFormula;
}
