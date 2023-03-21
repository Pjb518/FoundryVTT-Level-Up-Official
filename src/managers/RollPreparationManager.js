// eslint-disable-next-line import/no-unresolved
import { localize } from '@typhonjs-fvtt/runtime/svelte/helper';

import constructCritDamageRoll from '../dice/damage/constructCritDamageRoll';
import constructD20RollFormula from '../dice/constructD20RollFormula';
import constructRollFormula from '../dice/constructRollFormula';

export default class RollPreparationManager {
  #actor;

  #rolls;

  constructor(actor, rolls) {
    this.#actor = actor;
    this.#rolls = rolls;
  }

  async prepareRolls() {
    const { attack, other } = this.#rolls.reduce((acc, roll) => {
      if (roll && roll?.type === 'attack') acc.attack = roll;
      else acc.other.push(roll);

      return acc;
    }, { attack: null, other: [] });

    const attackRoll = await this.#prepareAttackRoll(attack ?? {});

    const otherRolls = await Promise.all(
      other.map(async (roll) => this.#prepareItemRoll(roll, attackRoll?.isCrit))
    );

    return [attackRoll, ...otherRolls].filter(Boolean);
  }

  #prepareItemRoll(roll, isCrit) {
    switch (roll?.type) {
      case 'abilityCheck':
        return this.#prepareAbilityCheckRoll(roll);
      case 'damage':
        return this.#prepareDamageRoll(roll, isCrit);
      case 'generic':
        return this.#prepareGenericRoll(roll);
      case 'healing':
        return this.#prepareHealingRoll(roll);
      case 'savingThrow':
        return this.#prepareSavingThrowRoll(roll);
      case 'skillCheck':
        return this.#prepareSkillCheckRoll(roll);
      case 'toolCheck':
        return this.#prepareToolCheckRoll(roll);
      default: return null;
    }
  }

  async #prepareAbilityCheckRoll(_roll) {
    const ability = localize(
      CONFIG.A5E.abilities[_roll?.ability ?? '']
    );

    const { rollFormula } = localize('A5E.AbilityCheckSpecific', { ability });

    if (!rollFormula) return null;

    const roll = await new Roll(rollFormula).evaluate({ async: true });
    const label = `${_roll.label ?? ''} [${localize('A5E.AbilityCheckSpecific', { ability })}]`;

    return {
      label,
      roll,
      type: 'abilityCheck'
    };
  }

  async #prepareAttackRoll(_roll) {
    const { rollFormula } = constructRollFormula({ actor: this.#actor, formula: _roll.formula });

    if (!rollFormula) return null;

    const critThreshold = _roll.critThreshold ?? 20;
    const roll = await new Roll(rollFormula).evaluate({ async: true });
    const label = localize(CONFIG.A5E.attackTypes[_roll?.attackType ?? 'meleeWeaponAttack']);

    const isCrit = roll.dice[0].total >= critThreshold;

    return {
      critThreshold,
      isCrit,
      label,
      roll,
      type: 'attack'
    };
  }

  async #prepareDamageRoll(_roll, isCrit) {
    const { canCrit, critBonus, damageType } = _roll;
    const { rollFormula } = constructRollFormula({ actor: this.#actor, formula: _roll.formula });

    if (!rollFormula) return null;

    let roll = await new Roll(rollFormula).evaluate({ async: true });

    if ((canCrit ?? true) && isCrit) {
      roll = await constructCritDamageRoll(roll, critBonus);
    }

    const label = `${_roll.label ?? ''} ${damageType
      ? `[${localize('A5E.DamageSpecific', { damageType: localize(CONFIG.A5E.damageTypes[damageType]) })}]`
      : `[${localize('A5E.Damage')}]`} `;

    return {
      canCrit,
      damageType,
      label,
      roll,
      type: 'damage'
    };
  }

  async #prepareGenericRoll(_roll) {
    const { rollFormula } = constructRollFormula({ actor: this.#actor, formula: _roll.formula });

    if (!rollFormula) return null;

    const roll = await new Roll(rollFormula).evaluate({ async: true });
    const label = roll.label ?? localize('A5E.GenericRoll');

    return {
      label,
      roll,
      type: 'generic'
    };
  }

  async #prepareHealingRoll(_roll) {
    const { rollFormula } = constructRollFormula({ actor: this.#actor, formula: _roll.formula });

    if (!rollFormula) return null;

    const roll = await new Roll(rollFormula).evaluate({ async: true });
    const healingType = CONFIG.A5E.healingTypes[roll.healingType ?? 'healing'];
    const label = `${_roll.label ?? ''} [${localize(healingType)}]`;

    return {
      label,
      healingType: roll?.healingType,
      roll,
      type: 'healing'
    };
  }

  async #prepareSavingThrowRoll(_roll) {
    const { rollFormula } = this.#actor.getDefaultSavingThrowData(_roll.ability);

    if (!rollFormula) return null;

    const ability = localize(CONFIG.A5E.abilities[_roll?.ability ?? '']);
    const roll = await new Roll(rollFormula).evaluate({ async: true });
    const label = `${_roll.label ?? ''} [${localize('A5E.SavingThrowSpecific', { ability })}]`;

    return {
      label,
      roll,
      type: 'savingThrow'
    };
  }

  async #prepareSkillCheckRoll(_roll) {
    const skill = localize(CONFIG.A5E.skills[_roll?.skill]);

    const { abilityKey: ability, rollFormula } = this.#actor.getDefaultSkillCheckData(
      _roll.skill,
      _roll.ability
    );

    if (!rollFormula) return null;

    const roll = await new Roll(rollFormula).evaluate({ async: true });

    const label = `${_roll.label ?? ''} [${ability
      ? localize('A5E.SkillCheckAbility', { skill, ability: localize(CONFIG.A5E.abilities[ability]) })
      : localize('A5E.SkillCheck', { skill })}]`;

    return {
      label,
      roll,
      type: 'skillCheck'
    };
  }

  async #prepareToolCheckRoll(_roll) {
    const abilityKey = _roll.ability === 'none' ? null : _roll.ability;
    const isProficient = this.#actor.system.proficiencies?.tools?.includes(_roll.tool);
    const modifiers = [];

    const tools = Object.values(CONFIG.A5E.tools).reduce(
      (acc, curr) => ({ ...acc, ...curr }),
      {}
    );

    const label = `${_roll.label ?? ''} [${localize('A5E.ToolCheckSpecific', {
      tool: localize(tools[_roll?.tool] ?? '')
    })}]`;

    // Check if ability configured
    if (abilityKey) {
      modifiers.push({
        label: localize('A5E.AbilityCheckMod', {
          ability: localize(CONFIG.A5E.abilities[abilityKey])
        }),
        value: this.#actor.system.abilities[abilityKey]?.check.mod
      });
    }

    // Check tool prof
    if (isProficient) {
      modifiers.push({
        label: localize('A5E.Proficiency'),
        value: this.#actor.system.attributes.prof
      });
    }

    // Add Global Ability bonus
    modifiers.push({
      label: localize('A5E.AbilityCheckBonusGlobal'),
      value: this.#actor.system.bonuses.abilities.check
    });

    const { rollFormula } = constructD20RollFormula({ actor: this.#actor, modifiers });

    if (!rollFormula) return null;

    const roll = await new Roll(rollFormula).evaluate({ async: true });

    return {
      label,
      roll,
      type: 'toolCheck'
    };
  }
}
