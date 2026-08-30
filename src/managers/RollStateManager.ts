import type { ActionActivationOptions } from '#documents/item/data.ts';
import getAttackAbility from '#utils/getAttackAbility.ts';
import getRollFormula from '#utils/getRollFormula.js';
import type { A5EActionData } from '../dataModels/item/actions/ActionDataModel.ts';
import type { AttackRollData } from '../dataModels/item/actions/ActionRollsDataModel.ts';
import type { ItemA5e } from '../documents/item/item.ts';

class RollStateManager {
	#actor: Actor.OfType<'base'>;

	#item: ItemA5e;

	#actionId: string;

	#action: A5EActionData;

	#state: RollStateManager.state;

	#options: ActionActivationOptions;

	constructor(item: ItemA5e, actionId: string, options: ActionActivationOptions) {
		this.#item = item;
		this.#actor = item.actor;
		this.#actionId = actionId;
		this.#options = options;

		const action = item.actions.get(actionId)!;
		this.#action = action;

		this.#state = this._prepareState();
	}

	_prepareState() {
		const consumers = this.#action.getConsumersByType();
		const prompts = this.#action.getPromptsByType();
		const rolls = this.#action.getRollsByType();
		const effects = [...this.#action._effects].map(([, effect]) => effect);

		const { BonusesManager } = this.#actor;
		const damageBonuses = BonusesManager._prepareGlobalDamageBonuses(this.#item, rolls);
		const healingBonuses = BonusesManager._prepareGlobalHealingBonuses(this.#item, rolls);

		// TODO:
		const attackRoll = rolls.attack?.length ? rolls.attack.at(0) : null;
		const attackRollConfig = this.#prepareAttackRollConfig(attackRoll);

		const config = {
			attackRoll: attackRollConfig,
			defaults: {
				consumers: this.#action.getDefaultIds('consumers'),
				prompts: this.#action.getDefaultIds('prompts'),
				rolls: this.#action.getDefaultIds('rolls'),
				attackBonuses: BonusesManager.getDefaultSelections('attacks', {
					item: this.#item,
					attackType: attackRoll?.attackType,
				}),
				damageBonuses: BonusesManager.getDefaultSelectionsFromBonuses({ damageBonuses }),
				healingBonuses: BonusesManager.getDefaultSelectionsFromBonuses({ healingBonuses }),
			},
			invalids: {
				rolls: this.#action.invalidRolls,
				prompts: this.#action.invalidPrompts,
			},
		};

		return {
			config,

			// Props
			consumers,
			effects,
			prompts,
			rolls,

			// Other
			attackRoll,
			damageBonuses,
			healingBonuses,
		};
	}

	/**
	 *
	 * @param attackRoll
	 * @returns
	 */
	#prepareAttackRollConfig(attackRoll: AttackRollData | null | undefined) {
		if (!attackRoll) return null;

		const { attackType } = attackRoll;
		const overrideManager = this.#actor.RollOverrideManager;

		const attackAbility = getAttackAbility(this.#actor, this.#item, attackRoll);
		const expertiseDie = overrideManager.getExpertiseDice(
			`attackTypes.${attackType}`,
			this.#options.expertiseDie ?? 0,
		);
		const expertiseDieSource = overrideManager.getExpertiseDiceSource(
			`attackTypes.${attackType}`,
			this.#options.expertiseDie ?? 0,
		);
		const rollMode = overrideManager.getRollOverride(
			`attackTypes.${attackType}`,
			this.#options.rollMode ?? CONFIG.A5E.ROLL_MODE.NORMAL,
		);

		const rollModeSource = overrideManager.getRollOverridesSource(
			`attackTypes.${attackType}`,
			this.#options.rollMode ?? CONFIG.A5E.ROLL_MODE.NORMAL,
		);

		const selectedAttackBonuses = this.#actor.BonusesManager.getDefaultSelections('attacks', {
			item: this.#item,
			attackType,
		});

		const formula = getRollFormula(this.#actor, {
			ability: attackAbility,
			attackBonus: attackRoll.bonus,
			attackType,
			expertiseDie,
			proficient: attackRoll.proficient ?? true,
			rollMode,
			situationalMods: this.#options.situationalMods || '',
			selectedAttackBonuses,
			type: 'attack',
		});

		return {
			ability: attackAbility,
			bonuses: this.#actor.BonusesManager.prepareAttackBonuses(this.#item, attackRoll.attackType),
			expertiseDie,
			expertiseDieSource,
			formula,
			rollMode,
			rollModeSource,
			selectedAttackBonuses,
		};
	}

	// ===========================================
	// Getters
	// ===========================================
	get state() {
		return this.#state;
	}
}

declare namespace RollStateManager {
	type state = ReturnType<RollStateManager['_prepareState']>;
}

export { RollStateManager };
