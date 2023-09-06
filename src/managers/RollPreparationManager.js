import { localize } from '#runtime/svelte/helper';

import constructCritDamageRoll from '../dice/damage/constructCritDamageRoll';
import constructD20RollFormula from '../dice/constructD20RollFormula';
import constructRollFormula from '../dice/constructRollFormula';

export default class RollPreparationManager {
  #actor;

  #consumers;

  #damageBonuses;

  #healingBonuses;

  #item;

  #rolls;

  constructor({
    actor, item, consumers, damageBonuses, healingBonuses, rolls
  }) {
    this.#actor = actor;
    this.#consumers = consumers;
    this.#damageBonuses = damageBonuses;
    this.#healingBonuses = healingBonuses;
    this.#item = item;
    this.#rolls = rolls;
  }

  async prepareRolls() {
    const {
      attack, damage, healing, other
    } = this.#rolls.reduce((acc, roll) => {
      if (roll && roll?.type === 'attack') acc.attack = roll;
      else if (roll && roll?.type === 'damage') acc.damage.push(roll);
      else if (roll && roll?.type === 'healing') acc.healing.push(roll);
      else acc.other.push(roll);

      return acc;
    }, {
      attack: null, damage: [], healing: [], other: []
    });

    const attackRoll = await this.#prepareAttackRoll(attack ?? {});

    const damageRolls = await Promise.all(
      damage.map(async (roll, i) => this.#prepareDamageRoll(roll, attackRoll, i))
    );

    const healingRolls = await Promise.all(
      healing.map(async (roll) => this.#prepareHealingRoll(roll))
    );

    if (damageRolls.length) {
      const bonusDamageRolls = await this.#prepareBonusDamageRolls(attackRoll);
      damageRolls.push(...bonusDamageRolls);
    }

    if (healingRolls.some(({ healingType }) => healingType === 'healing' || !healingType)) {
      const bonusHealingRolls = await this.#prepareBonusHealingRolls();
      healingRolls.push(...bonusHealingRolls);
    }

    if (healingRolls.some(({ healingType }) => healingType === 'temporaryHealing')) {
      const bonusTempHealingRolls = await this.#prepareBonusTemporaryHealingRolls();
      healingRolls.push(...bonusTempHealingRolls);
    }

    const otherRolls = await Promise.all(
      other.map(async (roll) => this.#prepareItemRoll(roll))
    );

    return [attackRoll, ...damageRolls, ...healingRolls, ...otherRolls].filter(Boolean);
  }

  #prepareItemRoll(roll) {
    switch (roll?.type) {
      case 'abilityCheck':
        return this.#prepareAbilityCheckRoll(roll);
      case 'generic':
        return this.#prepareGenericRoll(roll);
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
    const defaultData = this.#actor.getDefaultAbilityCheckData(
      _roll.ability,
      { situationalMods: _roll.bonus }
    );

    const rollFormula = _roll.rollFormula ?? defaultData.rollFormula;

    if (!rollFormula) return null;

    const ability = localize(CONFIG.A5E.abilities[_roll?.ability ?? '']);
    const roll = await new Roll(rollFormula).evaluate({ async: true });
    const label = localize('A5E.AbilityCheckSpecific', { ability });

    return {
      expertiseDice: _roll.expertiseDie ?? defaultData.expertiseDie,
      label,
      userLabel: _roll.label,
      roll,
      rollMode: _roll.rollMode ?? defaultData._rollMode,
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
      attackType: _roll.attackType,
      critThreshold,
      expertiseDice: _roll.expertiseDie,
      isCrit,
      label,
      roll,
      rollMode: _roll.rollMode,
      type: 'attack'
    };
  }

  async #prepareBonusDamageRolls() {
    const bonusDamage = Object.values(this.#damageBonuses).filter(
      ({ damageType }) => damageType && damageType !== 'null'
    );

    return Promise.all(
      bonusDamage.map(({ label, formula, damageType }) => this.#prepareDamageRoll({
        label,
        formula,
        canCrit: true,
        critBonus: 0,
        damageType
      }))
    );
  }

  async #prepareBonusHealingRolls() {
    const bonusHealing = Object.values(this.#healingBonuses).filter(
      ({ healingType }) => healingType === 'healing' || !healingType
    );

    return Promise.all(
      bonusHealing.map(({ label, formula, healingType }) => this.#prepareHealingRoll({
        label: label || 'Bonus Healing',
        formula,
        healingType: healingType || 'healing'
      }))
    );
  }

  async #prepareBonusTemporaryHealingRolls() {
    const bonusHealing = Object.values(this.#healingBonuses).filter(
      ({ healingType }) => healingType === 'temporaryHealing'
    );

    return Promise.all(
      bonusHealing.map(({ label, formula, healingType }) => this.#prepareHealingRoll({
        label: label || 'Bonus Temporary Healing',
        formula,
        healingType
      }))
    );
  }

  async #prepareDamageRoll(_roll, attackRoll, index) {
    let formula;

    const { isCrit } = attackRoll ?? {};
    const { canCrit, critBonus, damageType } = _roll;

    if (index === 0) {
      const genericBonusDamage = this.#prepareGenericBonusDamage();
      formula = [this.#applyDamageOrHealingScaling(_roll), ...genericBonusDamage].join(' + ');
    } else {
      formula = this.#applyDamageOrHealingScaling(_roll);
    }

    const { rollFormula } = constructRollFormula({
      actor: this.#actor,
      formula
    });

    if (!rollFormula) return null;

    let roll = await new Roll(rollFormula).evaluate({ async: true });

    if ((canCrit ?? true) && isCrit) {
      roll = await constructCritDamageRoll(roll, critBonus);
    }

    const label = damageType
      ? localize('A5E.DamageSpecific', { damageType: localize(CONFIG.A5E.damageTypes[damageType]) })
      : localize('A5E.Damage');

    return {
      canCrit,
      damageType,
      label,
      userLabel: _roll.label,
      roll,
      type: 'damage'
    };
  }

  /**
   * Prepares the damage bonuses without any damage type. These are folded into the first
   * damage roll for the action.
   */
  #prepareGenericBonusDamage() {
    const genericBonusDamage = Object.values(this.#damageBonuses).filter(
      ({ damageType }) => !damageType || damageType === 'null'
    );

    return genericBonusDamage.map(({ formula }) => formula);
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
    const { rollFormula } = constructRollFormula({
      actor: this.#actor,
      formula: this.#applyDamageOrHealingScaling(_roll)
    });

    if (!rollFormula) return null;

    const roll = await new Roll(rollFormula).evaluate({ async: true });
    const healingType = CONFIG.A5E.healingTypes[_roll.healingType ?? 'healing'];
    const label = localize(healingType);

    return {
      label,
      userLabel: _roll.label,
      healingType: _roll.healingType,
      roll,
      type: 'healing'
    };
  }

  async #prepareSavingThrowRoll(_roll) {
    const defaultData = this.#actor.getDefaultSavingThrowData(
      _roll.ability,
      { situationalMods: _roll.bonus }
    );

    const rollFormula = _roll.rollFormula ?? defaultData.rollFormula;

    if (!rollFormula) return null;

    const ability = localize(CONFIG.A5E.abilities[_roll?.ability ?? '']);
    const roll = await new Roll(rollFormula).evaluate({ async: true });
    let label;

    if (_roll.saveType === 'concentration') label = localize('A5E.ConcentrationCheck');
    else if (_roll.saveType === 'death') label = localize('A5E.DeathSavingThrow');
    else label = localize('A5E.SavingThrowSpecific', { ability });

    return {
      expertiseDice: _roll.expertiseDie ?? defaultData.expertiseDie,
      label,
      userLabel: _roll.label,
      roll,
      rollMode: _roll.rollMode ?? defaultData._rollMode,
      saveType: _roll.saveType,
      type: 'savingThrow'
    };
  }

  async #prepareSkillCheckRoll(_roll) {
    const skill = localize(CONFIG.A5E.skills[_roll?.skill]);

    const defaultData = this.#actor.getDefaultSkillCheckData(
      _roll.skill,
      _roll.ability,
      { situationalMods: _roll.bonus }
    );

    const ability = _roll.ability ?? defaultData.ability;
    const rollFormula = _roll.rollFormula ?? defaultData.rollFormula;

    if (!rollFormula) return null;

    const roll = await new Roll(rollFormula).evaluate({ async: true });

    const label = ability && ability !== 'none'
      ? localize('A5E.SkillCheckAbility', { skill, ability: CONFIG.A5E.abilityAbbreviations[ability] })
      : localize('A5E.SkillCheck', { skill });

    return {
      expertiseDice: _roll.expertiseDie ?? defaultData.expertiseDie,
      label,
      userLabel: _roll.label,
      roll,
      rollMode: _roll.rollMode ?? defaultData._rollMode,
      type: 'skillCheck'
    };
  }

  async #prepareToolCheckRoll(_roll) {
    const abilityKey = _roll.ability === 'none' ? null : _roll.ability;
    const isProficient = this.#actor.system.proficiencies?.tools?.includes(_roll.tool);
    const modifiers = [];

    // Flatten the tools array
    const tools = Object.values(CONFIG.A5E.tools).reduce(
      (acc, curr) => ({ ...acc, ...curr }),
      {}
    );

    const label = localize('A5E.ToolCheckSpecific', { tool: localize(tools[_roll?.tool] ?? '') });

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

    // Add Custom Bonus to Roll
    modifiers.push({
      value: _roll.bonus
    });

    const { rollFormula } = constructD20RollFormula({ actor: this.#actor, modifiers });

    if (!rollFormula) return null;

    const roll = await new Roll(rollFormula).evaluate({ async: true });

    return {
      label,
      userLabel: _roll.label,
      roll,
      type: 'toolCheck'
    };
  }

  #applyDamageOrHealingScaling(roll) {
    const scalingMode = roll.scaling?.mode;

    if (!scalingMode) return roll?.formula ?? 0;

    if (scalingMode === 'cantrip') return this.#applyCantripScaling(roll);
    if (scalingMode === 'spellLevel') return this.#applySpellLevelScaling(roll);
    if (scalingMode === 'spellPoints') return this.#applySpellPointScaling(roll);
    if (scalingMode === 'actionUses') return this.#applyActionUsesScaling(roll);
    if (scalingMode === 'itemUses') return this.#applyItemUsesScaling(roll);

    return roll.formula ?? 0;
  }

  #applyCantripScaling(roll) {
    const actorData = this.#actor.system;
    const casterLevel = actorData.details.level ?? actorData.attributes.casterLevel;
    const baseRoll = roll.formula;

    if (casterLevel < 5) return baseRoll;

    const scalingFormula = new Roll(roll.scaling?.formula ?? 0);
    let multiplier = 0;

    if (casterLevel >= 17) multiplier = 3;
    else if (casterLevel >= 11) multiplier = 2;
    else if (casterLevel >= 5) multiplier = 1;

    return [baseRoll, scalingFormula.alter(multiplier, 0, { multiplyNumeric: true }).formula].join('+');
  }

  #applySpellLevelScaling(roll) {
    const baseSpellLevel = this.#item.system.level;
    const castingLevel = this.#consumers.spell?.level ?? baseSpellLevel;
    const delta = castingLevel - baseSpellLevel;

    return this.#applyResourceBasedScaling(roll, delta);
  }

  #applySpellPointScaling(roll) {
    const spellConsumer = this.#consumers.spell;
    if (foundry.utils.isEmpty(spellConsumer)) return roll.formula;

    const { basePoints } = spellConsumer;
    if (basePoints >= spellConsumer.points) return roll.formula;

    const delta = Math.max(0, spellConsumer.points - basePoints);
    return this.#applyResourceBasedScaling(roll, delta);
  }

  #applyActionUsesScaling(roll) {
    const actionConsumer = this.#consumers.actionUses;
    if (foundry.utils.isEmpty(actionConsumer)) return roll.formula;

    const baseQuantity = actionConsumer.baseUses;
    if (baseQuantity >= actionConsumer.quantity) return roll.formula;

    const delta = actionConsumer.quantity - baseQuantity;
    return this.#applyResourceBasedScaling(roll, delta);
  }

  #applyItemUsesScaling(roll) {
    const itemConsumer = this.#consumers.itemUses;
    if (foundry.utils.isEmpty(itemConsumer)) return roll.formula;

    const baseQuantity = itemConsumer.baseUses;
    if (baseQuantity >= itemConsumer.quantity) return roll.formula;

    const delta = itemConsumer.quantity - baseQuantity;
    return this.#applyResourceBasedScaling(roll, delta);
  }

  #applyResourceBasedScaling(roll, delta) {
    const baseRoll = roll.formula;

    if (!delta) return baseRoll;

    const scalingFormula = new Roll(roll.scaling?.formula ?? 0);
    const step = roll.scaling?.step || 1;
    const multiplier = Math.floor(delta / step);

    if (multiplier === 0) return baseRoll;

    return [baseRoll, scalingFormula.alter(multiplier, 0, { multiplyNumeric: true }).formula].join('+');
  }
}
