export default function registerContextsConfig() {
	const abilityBonusContexts = {
		base: 'A5E.contexts.base',
		check: 'A5E.contexts.check',
		save: 'A5E.contexts.save',
	};

	const damageBonusContexts = {
		meleeWeaponAttack: 'A5E.damageBonuses.contexts.meleeWeaponAttacks',
		meleeSpellAttack: 'A5E.damageBonuses.contexts.meleeSpellAttacks',
		rangedWeaponAttack: 'A5E.damageBonuses.contexts.rangedWeaponAttacks',
		rangedSpellAttack: 'A5E.damageBonuses.contexts.rangedSpellAttacks',
	};

	const damageBonusSummariesByContext = {
		all: 'A5E.damageBonuses.summaries.contexts.all',
		meleeWeaponAttack: 'A5E.damageBonuses.summaries.contexts.meleeWeaponAttacks',
		meleeSpellAttack: 'A5E.damageBonuses.summaries.contexts.meleeSpellAttacks',
		rangedWeaponAttack: 'A5E.damageBonuses.summaries.contexts.rangedWeaponAttacks',
		rangedSpellAttack: 'A5E.damageBonuses.summaries.contexts.rangedSpellAttacks',
		spellAttacks: 'A5E.damageBonuses.summaries.contexts.spellAttacks',
		weaponAttacks: 'A5E.damageBonuses.summaries.contexts.weaponAttacks',
	};

	const healingBonusContexts = {
		healing: 'A5E.healing.bonuses.contexts.healing',
		temporaryHealing: 'A5E.healing.bonuses.contexts.temporaryHealing',
	};

	const healingBonusSummariesByContext = {
		healing: 'A5E.healing.bonuses.summaries.contexts.healing',
		temporaryHealing: 'A5E.healing.bonuses.summaries.contexts.temporaryHealing',
	};

  const hitDiceBonusContexts = {
    healing: 'A5E.hitDice.healing',
    exertion: 'A5E.hitDice.exertion',
    other: 'A5E.hitDice.other',
  };

  const hitDiceBonusTypes = {
    add: 'A5E.hitDice.bonusTypes.add',
    override: 'A5E.hitDice.bonusTypes.override',
    modifier: 'A5E.hitDice.bonusTypes.modifier',
  };

	const skillBonusContexts = {
		check: 'A5E.contexts.check',
		passive: 'A5E.contexts.passive',
	};

	return {
		abilityBonusContexts,
		damageBonusContexts,
		damageBonusSummariesByContext,
		healingBonusContexts,
		healingBonusSummariesByContext,
    hitDiceBonusContexts,
    hitDiceBonusTypes,
		skillBonusContexts,
	};
}
