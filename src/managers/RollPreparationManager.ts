import type { DamageBonus, HealingBonus } from "types/bonuses";

import type { ActionActivationOptions } from "../documents/item/data";
import type { BaseActorA5e } from "../documents/actor/base";
import type { ItemA5e } from "../documents/item/item";
import type { RollHandlerReturnType } from "../apps/dataPreparationHelpers/itemActivationRolls/prepareRolls";
import type { PromptHandlerReturnType } from "../apps/dataPreparationHelpers/itemActivationPrompts/preparePrompts";
import type { ResourceConsumptionManager } from "./ResourceConsumptionManager";
import type * as RollData from "../dataModels/item/actions/ActionRollsDataModel";

import { localize } from "#utils/localization/localize.ts";

import constructCritDamageRoll from "../dice/damage/constructCritDamageRoll";
import constructD20RollFormula from "../dice/constructD20RollFormula";
import constructRollFormula from "../dice/constructRollFormula";
import simplifyDiceTerms from "../dice/simplifyDiceTerms";

import { computeSaveDC } from "../utils/computeSaveDC.ts";
import getAttackAbility from "../utils/getAttackAbility";
import getRollFormula from "../utils/getRollFormula";

import _prepareConsumers from "../apps/dataPreparationHelpers/itemActivationConsumers/prepareConsumers";
import _preparePrompts from "../apps/dataPreparationHelpers/itemActivationPrompts/preparePrompts";
import _prepareRolls from "../apps/dataPreparationHelpers/itemActivationRolls/prepareRolls";
import _prepareEffects from "../apps/dataPreparationHelpers/itemActivationPrompts/prepareEffectPrompts";

class RollPreparationManager {
  #actor: BaseActorA5e;

  #consumers: ResourceConsumptionManager.ConsumptionData;

  #damageBonuses: DamageBonus[];

  #healingBonuses: HealingBonus[];

  #item: ItemA5e;

  #rolls: RollData.A5eActionRolls | any[];

  constructor({
    actor,
    item,
    consumers,
    damageBonuses,
    healingBonuses,
    rolls,
  }: RollPreparationManager.ConstructorOptions) {
    this.#actor = actor;
    this.#consumers = consumers!;
    this.#damageBonuses = damageBonuses!;
    this.#healingBonuses = healingBonuses!;
    this.#item = item!;
    this.#rolls = rolls;
  }

  /** ****************************************************
   *  Preparation Methods
   **************************************************** */
  async prepareRolls() {
    const { attack, damage, healing, other } = this.#rolls.reduce(
      (acc, roll: any) => {
        if (roll && roll.type === "attack") acc.attack = roll;
        else if (roll && roll.type === "damage") acc.damage.push(roll);
        else if (roll && roll.type === "healing") acc.healing.push(roll);
        else acc.other.push(roll);

        return acc;
      },
      {
        attack: null as RollPreparationManager.AttackRollData | null,
        damage: [] as any[],
        healing: [] as any[],
        other: [] as any[],
      },
    );

    const attackRoll = await this.#prepareAttackRoll(
      attack ?? ({} as RollPreparationManager.AttackRollData),
    );

    const damageRolls = (await Promise.all(
      damage.map(async (roll, i) =>
        this.#prepareDamageRoll(roll, attackRoll, i),
      ),
    )) as (PreparedDamageData | null)[];

    const healingRolls = (
      await Promise.all(
        healing.map(async (roll) => this.#prepareHealingRoll(roll)),
      )
    ).filter(Boolean) as PreparedHealingData[];

    if (damageRolls.length) {
      const bonusDamageRolls = await this.#prepareBonusDamageRolls(attackRoll);
      damageRolls.push(...bonusDamageRolls);
    }

    if (
      healingRolls.some(
        ({ healingType }) => healingType === "healing" || !healingType,
      )
    ) {
      const bonusHealingRolls = (await this.#prepareBonusHealingRolls()).filter(
        Boolean,
      ) as PreparedHealingData[];
      healingRolls.push(...bonusHealingRolls);
    }

    if (
      healingRolls.some(({ healingType }) => healingType === "temporaryHealing")
    ) {
      const bonusTempHealingRolls = (
        await this.#prepareBonusTemporaryHealingRolls()
      ).filter(Boolean) as PreparedHealingData[];
      healingRolls.push(...bonusTempHealingRolls);
    }

    const otherRolls = await Promise.all(
      other.map(async (roll) => this.#prepareItemRoll(roll)),
    );

    // TODO: Type out the return for this
    return [attackRoll, ...damageRolls, ...healingRolls, ...otherRolls].filter(
      Boolean,
    );
  }

  #prepareItemRoll(roll: any) {
    switch (roll?.type) {
      case "abilityCheck":
        return this.#prepareAbilityCheckRoll(roll);
      case "generic":
        return this.#prepareGenericRoll(roll);
      case "savingThrow":
        return this.#prepareSavingThrowRoll(roll);
      case "skillCheck":
        return this.#prepareSkillCheckRoll(roll);
      case "toolCheck":
        return this.#prepareToolCheckRoll(roll);
      default:
        return null;
    }
  }

  async #prepareAbilityCheckRoll(
    _roll: RollData.AbilityCheckRollData & RollPreparationManager.ExtraRollData,
  ) {
    const defaultData = this.#actor.getDefaultAbilityCheckData(_roll.ability, {
      situationalMods: _roll.bonus,
    });

    const rollFormula = _roll.rollFormula ?? defaultData.rollFormula;

    if (!rollFormula) return null;

    const ability = localize(CONFIG.A5E.abilities[_roll?.ability ?? ""]);
    const roll = await new Roll(rollFormula).evaluate();
    const label = localize("A5E.AbilityCheckSpecific", { ability });

    return {
      expertiseDice: _roll.expertiseDie ?? defaultData.expertiseDie,
      label,
      userLabel: _roll.label,
      roll,
      rollMode: _roll.rollMode ?? defaultData.rollMode,
      type: "abilityCheck",
    };
  }

  async #prepareAttackRoll(
    _roll: RollPreparationManager.AttackRollData,
  ): Promise<PreparedAttackRoll | null> {
    const { rollFormula } = constructRollFormula({
      actor: this.#actor,
      formula: _roll.formula,
      item: this.#item,
    });

    if (!rollFormula) return null;

    const critThreshold = _roll.critThreshold ?? 20;
    const roll = await new Roll(rollFormula).evaluate();
    const label = localize(
      CONFIG.A5E.attackTypes[_roll?.attackType ?? "meleeWeaponAttack"],
    );

    const isCrit = ((roll.dice[0].total as number) ?? 0) >= critThreshold;

    return {
      attackType: _roll.attackType,
      critThreshold,
      expertiseDice: _roll.expertiseDie,
      isCrit,
      label,
      roll,
      rollMode: _roll.rollMode,
      type: "attack",
    };
  }

  async #prepareBonusDamageRolls(attackRoll: PreparedAttackRoll | null) {
    const bonusDamage = Object.values(this.#damageBonuses).filter(
      ({ damageType }) => damageType && damageType !== "null",
    );

    return Promise.all(
      bonusDamage.map(({ label, formula, damageType, context }) =>
        this.#prepareDamageRoll(
          {
            label,
            formula,
            canCrit: true,
            critBonus: "",
            damageType,
            context,
          } as RollData.DamageRollData & { context: any },
          attackRoll,
        ),
      ),
    );
  }

  async #prepareBonusHealingRolls() {
    const bonusHealing = Object.values(this.#healingBonuses).filter(
      ({ healingType }) => healingType === "healing" || !healingType,
    );

    return Promise.all(
      bonusHealing.map(({ label, formula, healingType }) =>
        this.#prepareHealingRoll({
          label: label || "Bonus Healing",
          formula,
          healingType: healingType || "healing",
        } as RollData.HealingRollData),
      ),
    );
  }

  async #prepareBonusTemporaryHealingRolls() {
    const bonusHealing = Object.values(this.#healingBonuses).filter(
      ({ healingType }) => healingType === "temporaryHealing",
    );

    return Promise.all(
      bonusHealing.map(({ label, formula, healingType }) =>
        this.#prepareHealingRoll({
          label: label || "Bonus Temporary Healing",
          formula,
          healingType,
        } as RollData.HealingRollData),
      ),
    );
  }

  async #prepareDamageRoll(
    _roll: RollData.DamageRollData & { context?: any },
    attackRoll: PreparedAttackRoll | null,
    index?: number,
  ): Promise<PreparedDamageData | null> {
    const { isCrit } = attackRoll ?? {};
    const { canCrit, critBonus, damageType } = _roll ?? {};
    const critBonuses: string[] = [];
    const modifiers: { value: string; label: string }[] = [];

    const { context } = _roll;
    let genericCritBonusDamage = "";

    if (index === 0) {
      const genericBonusDamage = this.#prepareGenericBonusDamage(); // TODO: Had a isCrit param?

      genericBonusDamage.forEach((bonus) => {
        if (bonus.context?.isCritBonus) critBonuses.push(bonus.formula);
        else modifiers.push({ value: bonus.formula, label: bonus.label });
      });

      if (critBonuses.length) genericCritBonusDamage = critBonuses.join(" + ");
    }

    const { rollFormula } = constructRollFormula({
      actor: this.#actor,
      formula: this.#applyScaling(_roll),
      item: this.#item,
      modifiers,
    });

    if (!rollFormula) return null;

    const r = await new Roll(rollFormula).evaluate();
    let baseRoll = Roll.fromTerms(simplifyDiceTerms(r.terms));
    let roll = baseRoll;
    let critRoll = baseRoll;

    if (canCrit ?? true) {
      if (context?.isCritBonus) {
        critRoll = roll;
        baseRoll = await new Roll("0").evaluate();
        roll = baseRoll;
      } else {
        let bonus = critBonus || "";
        bonus += genericCritBonusDamage ? ` + ${genericCritBonusDamage}` : "";
        critRoll = await constructCritDamageRoll(roll, bonus);
      }
    }

    if (isCrit) roll = critRoll;

    const label = damageType
      ? localize("A5E.DamageSpecific", {
          damageType: localize(CONFIG.A5E.damageTypes[damageType]),
        })
      : localize("A5E.Damage");

    return {
      baseRoll: baseRoll as EvaluatedRoll,
      canCrit: canCrit ?? true,
      critRoll: critRoll as EvaluatedRoll,
      damageType,
      label,
      userLabel: _roll.label,
      roll: roll as EvaluatedRoll,
      type: "damage",
    };
  }

  /**
   * Prepares the damage bonuses without any damage type. These are folded into the first
   * damage roll for the action.
   */
  #prepareGenericBonusDamage() {
    const genericBonusDamage = Object.values(this.#damageBonuses).filter(
      ({ damageType }) => !damageType || damageType === "null",
    );

    return genericBonusDamage.map(({ formula, context, label }) => ({
      formula,
      context,
      label,
    }));
  }

  async #prepareGenericRoll(_roll: RollData.GenericRollData) {
    const { rollFormula } = constructRollFormula({
      actor: this.#actor,
      formula: this.#applyScaling(_roll),
      item: this.#item,
    });

    if (!rollFormula) return null;

    const r = await new Roll(rollFormula).evaluate();
    const roll = Roll.fromTerms(simplifyDiceTerms(r.terms));
    const label = _roll.label || localize("A5E.GenericRoll");

    return {
      label,
      roll: roll as EvaluatedRoll,
      type: "generic",
    };
  }

  async #prepareHealingRoll(
    _roll: RollData.HealingRollData,
  ): Promise<PreparedHealingData | null> {
    const { rollFormula } = constructRollFormula({
      actor: this.#actor,
      formula: this.#applyScaling(_roll),
      item: this.#item,
    });

    if (!rollFormula) return null;

    const r = await new Roll(rollFormula).evaluate();
    const roll = Roll.fromTerms(simplifyDiceTerms(r.terms));
    const healingType = CONFIG.A5E.healingTypes[_roll.healingType ?? "healing"];
    const label = localize(healingType);

    return {
      label,
      userLabel: _roll.label,
      healingType: _roll.healingType,
      roll: roll as EvaluatedRoll,
      type: "healing",
    };
  }

  async #prepareSavingThrowRoll(
    _roll: RollData.SavingThrowRollData &
      RollPreparationManager.ExtraRollData & { saveType: string },
  ) {
    const defaultData = this.#actor.getDefaultSavingThrowData(_roll.ability, {
      situationalMods: _roll.bonus,
    });

    const rollFormula = _roll.rollFormula ?? defaultData.rollFormula;

    if (!rollFormula) return null;

    const ability = localize(CONFIG.A5E.abilities[_roll?.ability ?? ""]);
    const roll = await new Roll(rollFormula).evaluate();
    let label: string;

    if (_roll.saveType === "concentration")
      label = localize("A5E.ConcentrationCheck");
    else if (_roll.saveType === "death")
      label = localize("A5E.DeathSavingThrow");
    else label = localize("A5E.SavingThrowSpecific", { ability });

    return {
      expertiseDice: _roll.expertiseDie ?? defaultData.expertiseDie,
      label,
      userLabel: _roll.label,
      roll,
      rollMode: _roll.rollMode ?? defaultData.rollMode,
      saveType: _roll.saveType,
      type: "savingThrow",
    };
  }

  async #prepareSkillCheckRoll(
    _roll: RollData.SkillCheckRollData & RollPreparationManager.ExtraRollData,
  ) {
    const skill = localize(CONFIG.A5E.skills[_roll?.skill]);

    const defaultData = this.#actor.getDefaultSkillCheckData(_roll.skill, {
      abilityKey: _roll.ability,
      situationalMods: _roll.bonus,
    });

    const ability = _roll.ability ?? defaultData.abilityKey;
    const rollFormula = _roll.rollFormula ?? defaultData.rollFormula;

    if (!rollFormula) return null;

    const roll = await new Roll(rollFormula).evaluate();

    const label =
      ability && ability !== "none"
        ? localize("A5E.skillLabels.checks.ability", {
            skill,
            ability: CONFIG.A5E.abilityAbbreviations[ability],
          })
        : localize("A5E.SkillCheck", { skill });

    return {
      expertiseDice: _roll.expertiseDie ?? defaultData.expertiseDie,
      label,
      userLabel: _roll.label,
      roll,
      rollMode: _roll.rollMode ?? defaultData.rollMode,
      skillKey: _roll?.skill,
      type: "skillCheck",
    };
  }

  async #prepareToolCheckRoll(_roll: RollData.ToolCheckRollData) {
    const abilityKey = _roll.ability === "none" ? null : _roll.ability;
    const isProficient = this.#actor.system.proficiencies?.tools?.includes(
      _roll.tool,
    );
    const modifiers: { value: string; label?: string }[] = [];

    // Flatten the tools array
    const tools = Object.values(CONFIG.A5E.tools).reduce(
      (acc, curr) => ({ ...acc, ...curr }),
      {},
    );

    const label = localize("A5E.ToolCheckSpecific", {
      tool: localize(tools[_roll?.tool] ?? ""),
    });

    // Check if ability configured
    if (abilityKey) {
      modifiers.push({
        label: localize("A5E.abilities.headings.checkMod", {
          ability: localize(CONFIG.A5E.abilities[abilityKey]),
        }),
        value: this.#actor.system.abilities[abilityKey]?.check.mod,
      });
    }

    // Check tool prof
    if (isProficient) {
      modifiers.push({
        label: localize("A5E.Proficiency"),
        // @ts-expect-error
        value: this.#actor.system.attributes.prof,
      });
    }

    // Add Global Ability bonus
    modifiers.push({
      label: localize("A5E.abilities.headings.checkBonusGlobal"),
      value: this.#actor.BonusesManager.getGlobalAbilityBonusesFormula("check"),
    });

    // Add Custom Bonus to Roll
    modifiers.push({
      value: _roll.bonus,
    });

    const { rollFormula } = constructD20RollFormula({
      actor: this.#actor,
      item: this.#item,
      modifiers,
    });

    if (!rollFormula) return null;

    const roll = await new Roll(rollFormula).evaluate();

    return {
      label,
      userLabel: _roll.label,
      roll,
      type: "toolCheck",
    };
  }

  /** ****************************************************
   *  Scaling Adjustment Methods
   **************************************************** */
  #applyScaling(roll: any): string {
    const scalingMode: string = roll.scaling?.mode;

    if (!scalingMode) return roll?.formula ?? 0;

    if (scalingMode === "cantrip") return this.#applyCantripScaling(roll);
    if (scalingMode === "spellLevel") return this.#applySpellLevelScaling(roll);
    if (scalingMode === "spellPoints")
      return this.#applySpellPointScaling(roll);
    if (scalingMode === "actionUses") return this.#applyActionUsesScaling(roll);
    if (scalingMode === "itemUses") return this.#applyItemUsesScaling(roll);
    if (scalingMode === "artifactCharges")
      return this.#applyArtifactChargesScaling(roll);

    return roll.formula ?? 0;
  }

  #applyCantripScaling(roll): string {
    const actorData = this.#actor.system;

    const casterLevel =
      // @ts-expect-error
      this.#actor?.levels?.character ??
      // @ts-expect-error
      actorData.details.level ??
      // @ts-expect-error
      actorData.attributes.casterLevel;

    const baseRoll: string = roll.formula;

    if (casterLevel < 5) return baseRoll;

    const scalingFormula = new Roll(roll.scaling?.formula ?? 0);
    let multiplier = 0;

    if (casterLevel >= 17) multiplier = 3;
    else if (casterLevel >= 11) multiplier = 2;
    else if (casterLevel >= 5) multiplier = 1;

    return [
      baseRoll,
      scalingFormula.alter(multiplier, 0, { multiplyNumeric: true }).formula,
    ].join("+");
  }

  #applySpellLevelScaling(roll): string {
    // @ts-expect-error
    const baseSpellLevel =
      this.#consumers.spell?.baseLevel ?? this.#item.system.level ?? 1;
    const castingLevel = this.#consumers.spell?.level ?? baseSpellLevel;
    const delta = castingLevel - baseSpellLevel;

    return this.#applyResourceBasedScaling(roll, delta);
  }

  #applySpellPointScaling(roll): string {
    const spellConsumer = this.#consumers.spell;
    if (foundry.utils.isEmpty(spellConsumer)) return roll.formula;

    const basePoints = spellConsumer?.basePoints || 1;
    if (basePoints >= spellConsumer.points) return roll.formula;

    const delta = Math.max(0, spellConsumer.points - basePoints);
    return this.#applyResourceBasedScaling(roll, delta);
  }

  #applyArtifactChargesScaling(roll): string {
    const spellConsumer = this.#consumers.spell;
    if (foundry.utils.isEmpty(spellConsumer)) return roll.formula;

    const baseCharges = spellConsumer?.baseCharges || 1;
    if (baseCharges >= spellConsumer.charges) return roll.formula;

    const delta = Math.max(0, spellConsumer.charges - baseCharges);
    return this.#applyResourceBasedScaling(roll, delta);
  }

  #applyActionUsesScaling(roll): string {
    const actionConsumer = this.#consumers.actionUses;
    if (foundry.utils.isEmpty(actionConsumer)) return roll.formula;

    const baseQuantity = actionConsumer.baseUses;
    if (baseQuantity >= actionConsumer.quantity) return roll.formula;

    const delta = actionConsumer.quantity - baseQuantity;
    return this.#applyResourceBasedScaling(roll, delta);
  }

  #applyItemUsesScaling(roll): string {
    const itemConsumer = this.#consumers.itemUses;
    if (foundry.utils.isEmpty(itemConsumer)) return roll.formula;

    const baseQuantity = itemConsumer.baseUses;
    if (baseQuantity >= itemConsumer.quantity) return roll.formula;

    const delta = itemConsumer.quantity - baseQuantity;
    return this.#applyResourceBasedScaling(roll, delta);
  }

  #applyResourceBasedScaling(roll, delta): string {
    const baseRoll = roll.formula;

    if (!delta) return baseRoll;

    const scalingFormula = new Roll(roll.scaling?.formula ?? 0);
    const step = roll.scaling?.step || 1;
    const multiplier = Math.floor(delta / step);

    if (multiplier === 0) return baseRoll;

    return [
      baseRoll,
      scalingFormula.alter(multiplier, 0, { multiplyNumeric: true }).formula,
    ].join("+");
  }

  /** ****************************************************
   *  Static Methods
   **************************************************** */
  static prepareAttackRollData(
    actor: BaseActorA5e,
    item: ItemA5e,
    attackRoll: RollData.AttackRollData,
    options: ActionActivationOptions = {},
  ) {
    const { attackType } = attackRoll;

    const attackBonuses = actor.BonusesManager.prepareAttackBonuses(
      item,
      attackType,
    );
    const attackAbility = getAttackAbility(actor, item, attackRoll);

    const expertiseDie = actor.RollOverrideManager.getExpertiseDice(
      `attackTypes.${attackType}`,
      options.expertiseDie ?? 0,
    );

    const expertiseDieSource = actor.RollOverrideManager.getExpertiseDiceSource(
      `attackTypes.${attackType}`,
      options.expertiseDie ?? 0,
    );

    const rollMode = actor.RollOverrideManager.getRollOverride(
      `attackTypes.${attackType}`,
      options.rollMode ?? CONFIG.A5E.ROLL_MODE.NORMAL,
    );

    const rollModeSource = actor.RollOverrideManager.getRollOverridesSource(
      `attackTypes.${attackType}`,
      options.rollMode ?? CONFIG.A5E.ROLL_MODE.NORMAL,
    );

    const selectedAttackBonuses = actor.BonusesManager.getDefaultSelections(
      "attacks",
      {
        item,
        attackType,
      },
    );

    const formula: string = getRollFormula(actor, {
      ability: attackAbility,
      attackBonus: attackRoll?.bonus,
      attackType: attackRoll?.attackType,
      expertiseDie,
      item,
      proficient: attackRoll?.proficient ?? true,
      rollMode,
      situationalMods: options.situationalMods,
      selectedAttackBonuses,
      type: "attack",
    });

    return {
      attackBonuses,
      attackAbility,
      expertiseDie,
      expertiseDieSource,
      formula,
      rollMode,
      rollModeSource,
      selectedAttackBonuses,
    };
  }

  static #getInvalidSelections(property: [string, any][]): string[] {
    return Object.values(property)
      .flat()
      .reduce((acc, [key, value]) => {
        if (
          ["generic", "healing", "damage"].includes(value.type) &&
          !value.formula
        ) {
          acc.push(key);
        }

        return acc;
      }, [] as string[]);
  }

  static prepareOtherRollData(rolls: RollHandlerReturnType) {
    const invalidSelections = RollPreparationManager.#getInvalidSelections(
      rolls as unknown as [string, any][],
    );

    const otherRolls = Object.entries(rolls).reduce(
      (acc, [rollType, rollGroup]) => {
        if (rollType === "attack") return acc;
        acc[rollType] = rollGroup;

        return acc;
      },
      {} as Omit<RollHandlerReturnType, "attack">,
    );

    return {
      invalidSelections,
      otherRolls,
    };
  }

  static getSelectedRolls(
    item: ItemA5e,
    actionId: string,
    selections: string[],
  ) {
    const action = item.actions.get(actionId)!;
    const rolls = Object.entries(action.rolls ?? {});
    // There to help with types
    const temp = Object.values(action.rolls ?? {});

    return rolls.reduce(
      (acc, [key, roll]) => {
        if (selections.includes(key) && roll.type !== "attack") acc.push(roll);
        return acc;
      },
      [] as typeof temp,
    );
  }

  static preparePromptsData(prompts: PromptHandlerReturnType) {
    const invalidSelections = RollPreparationManager.#getInvalidSelections(
      prompts as unknown as [string, any][],
    );

    return {
      invalidSelections,
    };
  }

  static getSelectedPrompts(
    actor: BaseActorA5e,
    item: ItemA5e,
    actionId: string,
    selections: string[],
  ) {
    const action = item.actions.get(actionId)!;
    const prompts = Object.entries(action.prompts ?? {});

    // There to help with types
    const temp = Object.values(action.prompts ?? {});

    return prompts.reduce(
      (acc, [key, prompt]) => {
        // eslint-disable-next-line no-param-reassign
        prompt = foundry.utils.duplicate(prompt);

        if (selections.includes(key)) {
          // @ts-expect-error
          if (prompt.type === "savingThrow") {
            // @ts-expect-error
            prompt.dc = computeSaveDC(actor, item, prompt.saveDC);
          }

          acc.push(prompt);
        }

        return acc;
      },
      [] as typeof temp,
    );
  }

  static getSelectedBonuses(
    actor: BaseActorA5e,
    type: "damage" | "healing",
    selections: string[],
  ) {
    const bonuses = Object.entries(actor.system.bonuses[type]);

    return bonuses.reduce((acc, [key, bonus]) => {
      if (selections.includes(key)) acc.push(bonus);

      return acc;
    }, [] as any[]);
  }

  static getDefaultSelectedEffects(effects) {
    return effects.reduce((acc, e) => {
      if (e.system.default) acc.push(e.id);
      return acc;
    }, [] as string[]);
  }

  /** ******************************************* */

  static prepareConsumers(item: ItemA5e, actionId: string) {
    return _prepareConsumers(item, actionId);
  }

  static prepareEffects(item: ItemA5e, actionId: string) {
    return _prepareEffects(item, actionId);
  }

  static preparePrompts(item: ItemA5e, actionId: string) {
    return _preparePrompts(item, actionId);
  }

  static prepareRolls(item: ItemA5e, actionId: string) {
    return _prepareRolls(item, actionId);
  }
}

declare namespace RollPreparationManager {
  interface ConstructorOptions {
    actor: BaseActorA5e;
    item?: ItemA5e;
    consumers?: ResourceConsumptionManager.ConsumptionData;
    damageBonuses?: DamageBonus[];
    healingBonuses?: HealingBonus[];
    rolls: RollData.A5eActionRolls | any[];
  }

  interface AttackRollData extends RollData.AttackRollData {
    expertiseDie: number;
    rollMode: number;
    formula: string;
  }

  interface ExtraRollData {
    rollFormula: string;
    expertiseDie: number;
    rollMode: number;
  }
}

// biome-ignore lint/complexity/noBannedTypes: <explanation>
type EvaluatedRoll = Awaited<
  ReturnType<InstanceType<typeof Roll<{}>>["evaluate"]>
>;

interface PreparedAttackRoll {
  attackType:
    | "meleeWeaponAttack"
    | "rangedWeaponAttack"
    | "meleeSpellAttack"
    | "rangedSpellAttack";
  critThreshold: number;
  expertiseDice: number;
  isCrit: boolean;
  label: string;
  roll: EvaluatedRoll;
  rollMode: number;
  type: "attack";
}

interface PreparedDamageData {
  baseRoll: EvaluatedRoll;
  canCrit: boolean;
  critRoll: EvaluatedRoll;
  damageType: string;
  label: string;
  userLabel: string;
  roll: EvaluatedRoll;
  type: "damage";
}

interface PreparedHealingData {
  label: string;
  userLabel: string;
  healingType: string;
  roll: EvaluatedRoll;
  type: "healing";
}

export { RollPreparationManager };
