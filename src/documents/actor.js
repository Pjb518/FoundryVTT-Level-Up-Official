// eslint-disable-next-line import/no-unresolved
import { localize } from '@typhonjs-fvtt/runtime/svelte/helper';

import Item5e from './item';

import AbilityCheckConfigDialog from '../apps/dialogs/ActorAbilityConfigDialog.svelte';
import ActorHpConfigDialog from '../apps/dialogs/ActorHpConfigDialog.svelte';
import ActorInitConfigDialog from '../apps/dialogs/ActorInitConfigDialog.svelte';
import ActorManueverConfigDialog from '../apps/dialogs/ActorManueverConfigDialog.svelte';
import ActorSpellConfigDialog from '../apps/dialogs/ActorSpellConfigDialog.svelte';
import ArmorProfConfigDialog from '../apps/dialogs/ArmorProfConfigDialog.svelte';
import ConditionImmunitiesConfigDialog from '../apps/dialogs/ConditionImmunitiesConfigDialog.svelte';
import CreatureSizeConfigDialog from '../apps/dialogs/CreatureSizeConfigDialog.svelte';
import CreatureTypeConfigDialog from '../apps/dialogs/CreatureTypeConfigDialog.svelte';
import DamageImmunitiesConfigDialog from '../apps/dialogs/DamageImmunitiesConfigDialog.svelte';
import DamageResistancesConfigDialog from '../apps/dialogs/DamageResistancesConfigDialog.svelte';
import DamageVulnerabilitiesConfigDialog from '../apps/dialogs/DamageVulnerabilitiesConfigDialog.svelte';
import LanguagesConfigDialog from '../apps/dialogs/LanguagesConfigDialog.svelte';
import MovementConfigDialog from '../apps/dialogs/MovementConfigDialog.svelte';
import RestDialog from '../apps/dialogs/RestDialog.svelte';
import SensesConfigDialog from '../apps/dialogs/SensesConfigDialog.svelte';
import SkillConfigDialog from '../apps/dialogs/SkillConfigDialog.svelte';
import ToolProfConfigDialog from '../apps/dialogs/ToolProfConfigDialog.svelte';
import WeaponProfConfigDialog from '../apps/dialogs/WeaponProfConfigDialog.svelte';

import GenericConfigDialog from '../apps/dialogs/initializers/GenericConfigDialog';
import AbilityCheckRollDialog from '../apps/dialogs/initializers/AbilityCheckRollDialog';
import SavingThrowRollDialog from '../apps/dialogs/initializers/SavingThrowRollDialog';
import SkillCheckRollDialog from '../apps/dialogs/initializers/SkillCheckRollDialog';

import calculatePassiveScore from '../utils/calculatePassiveScore';
import constructD20RollFormula from '../dice/constructD20RollFormula';
import getDeterministicBonus from '../dice/getDeterministicBonus';
import getExpertiseDieSize from '../utils/getExpertiseDieSize';

export default class ActorA5e extends Actor {
  #configDialogMap;

  constructor(...args) {
    super(...args);

    this.dialogs ??= {
      abilities: {},
      skills: {}
    };

    this.#configDialogMap = {
      ability: AbilityCheckConfigDialog,
      armor: ArmorProfConfigDialog,
      conditionImmunities: ConditionImmunitiesConfigDialog,
      damageImmunities: DamageImmunitiesConfigDialog,
      damageResistances: DamageResistancesConfigDialog,
      damageVulnerabilities: DamageVulnerabilitiesConfigDialog,
      health: ActorHpConfigDialog,
      initiative: ActorInitConfigDialog,
      languages: LanguagesConfigDialog,
      maneuvers: ActorManueverConfigDialog,
      movement: MovementConfigDialog,
      senses: SensesConfigDialog,
      size: CreatureSizeConfigDialog,
      skill: SkillConfigDialog,
      spells: ActorSpellConfigDialog,
      tools: ToolProfConfigDialog,
      types: CreatureTypeConfigDialog,
      weapons: WeaponProfConfigDialog
    };
  }

  get hitPointFormula() {
    const { hitDice } = this.system.attributes;
    const { mod } = this.system.abilities.con;

    let hitDiceCount = 0;
    const parts = [];

    Object.entries(hitDice).forEach(([dieSize, { total: diceQuantity }]) => {
      if (!diceQuantity) return;

      parts.push(`${diceQuantity}${dieSize}`);
      hitDiceCount += diceQuantity;
    });

    if (hitDiceCount === 0) return null;

    return `${parts.join(' + ')} + ${hitDiceCount * mod}`;
  }

  /**
   * @override
   */
  prepareBaseData() {
    const actorType = this.type;

    if (actorType === 'character') {
      return this.prepareCharacterData();
    }

    return this.prepareNPCData();
  }

  /**
   * @override
   */
  prepareDerivedData() {
    const actorData = this.system;

    // Calculate the base ability modifier for each ability score.
    Object.values(actorData.abilities).forEach((ability) => {
      const baseMod = Math.floor((ability.value - 10) / 2);

      ability.check.mod = baseMod;
      ability.save.mod = baseMod + (ability.save.proficient ? actorData.attributes.prof : 0);
    });

    /**
     * Calculate the deterministic bonuses for each ability score.
     *
     * IMPORTANT: This step cannot be combined into the previous forEach; otherwise, deterministic
     *            bonuses will be unable to refer to modifiers from subsequent ability scores.
     */
    Object.values(actorData.abilities).forEach((ability) => {
      ['check', 'save'].forEach((key) => {
        let deterministicBonus;

        try {
          deterministicBonus = getDeterministicBonus(
            [
              ability[key].mod,
              ability[key].bonus,
              actorData.bonuses.abilities[key]
            ].filter(Boolean).join(' + '),
            this.getRollData()
          );
        } finally {
          // Fall back to the base ability mod if no bonus could be calculated.
          ability[key].deterministicBonus = deterministicBonus ?? ability[key].mod;
        }
      });
    });

    const { baseMax: baseHP, bonus: bonusHP } = actorData.attributes.hp;
    actorData.attributes.hp.max = baseHP + bonusHP;

    try {
      actorData.attributes.maneuverDC = getDeterministicBonus([
        8,
        actorData.attributes.prof,
        actorData.bonuses.maneuverDC,
        Math.max(actorData.abilities.str.check.mod, actorData.abilities.dex.check.mod)
      ].join(' + '), this.getRollData());
    } catch {
      console.error(`Failed to calculate a maneuver DC for ${this.name}`);
      actorData.attributes.maneuverDC = null;
    }

    try {
      actorData.attributes.spellDC = getDeterministicBonus([
        8,
        actorData.attributes.prof,
        actorData.bonuses?.spell?.dc || 0,
        actorData.abilities[actorData.attributes.spellcasting || 'int'].check.mod
      ].join(' + '), this.getRollData());
    } catch {
      console.error(`Failed to calculate a spell DC for ${this.name}`);
      actorData.attributes.spellDC = null;
    }

    if (this.type === 'character') {
      actorData.attributes.attunement.current = this.items.reduce((acc, curr) => {
        const { requiresAttunement, attuned } = curr.system;
        return (requiresAttunement && attuned) ? acc + 1 : acc;
      }, 0);
    }

    this.prepareSkills();
  }

  prepareCharacterData() {
    // Calculate the proficiency bonus for the character with a minimum value of 2.
    this.system.attributes.prof = Math.max(2, Math.floor((this.system.details.level + 7) / 4));
  }

  prepareNPCData() {
    // Calculate the proficiency bonus for the character with a minimum value of 2.
    this.system.attributes.prof = Math.max(2, Math.floor((this.system.details.cr + 7) / 4));
  }

  /** @inheritdoc */
  async _preCreate(data, options, user) {
    await super._preCreate(data, options, user);

    // Player character configuration
    if (this.type === 'character') {
      const prototypeToken = { vision: true, actorLink: true, disposition: 1 };
      this.updateSource({ prototypeToken });
    }
  }

  /** @inheritdoc */
  async _preUpdate(changed, options, user) {
    await super._preUpdate(changed, options, user);

    // If hp drops below 0, set the value to 0.
    if (foundry.utils.getProperty(changed, 'system.attributes.hp.value') < 0) {
      foundry.utils.setProperty(changed, 'system.attributes.hp.value', 0);
    }

    // If temp hp drops to or below 0, set the value to 0.
    if (foundry.utils.getProperty(changed, 'system.attributes.hp.temp') <= 0) {
      foundry.utils.setProperty(changed, 'system.attributes.hp.temp', '');
    }

    // Reset death save counters
    const isUnconscious = this.system.attributes.hp.value === 0;
    const willRegainConsciousness = foundry.utils.getProperty(changed, 'system.attributes.hp.value') > 0;

    if (isUnconscious && willRegainConsciousness) {
      foundry.utils.setProperty(changed, 'system.attributes.death.success', 0);
      foundry.utils.setProperty(changed, 'system.attributes.death.failure', 0);
    }
  }

  /**
   * Apply a certain amount of damage to the health pool for Actor, prioritizing temporary hp.
   * Negative damage values will have no effect.
   *
   * @param {number} damage  An amount of damage to apply to the actor.
   *
   * @returns {Promise<Actor5e>}  A Promise which resolves once the damage has been applied
   */
  async applyDamage(damage) {
    const updates = {};
    const { value, temp } = this.system.attributes.hp;

    if (temp) {
      updates['system.attributes.hp'] = {
        temp: Math.clamped(temp - damage, 0, temp),
        value: Math.clamped(value + temp - damage, 0, value)
      };
    } else {
      updates['system.attributes.hp.value'] = Math.clamped(value - damage, 0, value);
    }

    Hooks.callAll('a5e.actorDamaged', this, { prevHp: { value, temp }, damage });
    return this.update(updates);
  }

  /**
   * Apply a certain amount of healing to the health pool for Actor. Temporary healing can be set
   * using a flag in the options object.
   *
   * When dealing with temporary hp, providing a value below the current temp hp of the target will
   * trigger a warning and abort the update of the actor.
   *
   * Negative healing value are ignored.
   *
   * @param {number} healing        An amount of damage to apply to the actor.
   * @param {Object} options
   * @param {Boolean} options.temp    A flag for indicating whether the healing being applied is
   *                                  temporary.
   *
   * @returns {Promise<Actor5e>}  A Promise which resolves once the damage has been applied
   */
  async applyHealing(healing, options = { temp: false }) {
    const updates = {};
    const { value, max, temp } = this.system.attributes.hp;

    if (options.temp) {
      if (healing <= temp) {
        ui.notifications.warn('A5E.ActionWarningTempHpNotOverwritten', { localize: true });
        return this;
      }

      updates['system.attributes.hp.temp'] = healing;
    } else {
      updates['system.attributes.hp.value'] = Math.clamped(value + healing, value, max);
    }

    Hooks.callAll('a5e.actorHealed', this, { prevHp: { value, temp }, healingData: { healing, options } });
    return this.update(updates);
  }

  prepareSkills() {
    const actorData = this.system;
    const proficiencyBonus = actorData.attributes.prof;
    const jackOfAllTrades = this.flags.a5e?.jackOfAllTrades;

    Object.values(actorData.skills).forEach((skill) => {
      if (skill.proficient) skill.mod = proficiencyBonus;
      else if (jackOfAllTrades) skill.mod = Math.floor(proficiencyBonus / 2);
      else skill.mod = 0;
    });

    Object.entries(actorData.skills).forEach(([key, skill]) => {
      const skillName = localize(CONFIG.A5E.skills[key]);
      const { check: globalCheckBonus, skill: globalSkillBonus } = actorData.bonuses.abilities;

      let deterministicBonus;

      try {
        deterministicBonus = getDeterministicBonus(
          [
            skill.mod,
            skill.bonuses.check,
            globalSkillBonus,
            globalCheckBonus
          ].filter(Boolean).join(' + '),
          this.getRollData()
        );
      } catch {
        console.error(`Couldn't calculate a ${skillName} modifier for ${this.name}`);
      }

      skill.deterministicBonus = deterministicBonus ?? skill.mod;

      try {
        skill.passive = calculatePassiveScore(skill, this.getRollData());
      } catch {
        console.error(`Couldn't calculate a ${skillName} passive score for ${this.name}`);
        skill.passive = null;
      }
    });
  }

  /** @inheritdoc */
  getRollData() {
    const data = { ...super.getRollData() };
    const { abilities, skills } = this.system;

    data.prof = this.system.attributes.prof || 0;

    // Add a shortcut for abilities.<ability>.check.mod, abilities.<ability>.mod, and <ability>.mod
    Object.entries(abilities).reduce((acc, [key, ability]) => {
      acc.abilities ??= {};
      acc.abilities[key] = { ...ability, mod: ability.check.mod };
      acc[key] = { ...ability, mod: ability.check.mod };

      return acc;
    }, data);

    // Add similar shortcuts for skills
    Object.entries(skills).reduce((acc, [key, skill]) => {
      acc.skills ??= {};
      acc.skills[key] = skill;
      acc[key] = skill;

      return acc;
    }, data);

    data.finesse = {
      mod: Math.max(data.dex.mod, data.str.mod)
    };

    data.level = this.system.details.level;

    data.spellDC = this.system.attributes.spellDC;
    data.maneuverDC = this.system.attributes.maneuverDC;

    return data;
  }

  /**
   * A helper function to handle updates to the fatigue or strife tracked conditions during a long
   * rest.
   *
   * @param {Boolean} haven   Whether or not a haven was available during the rest
   * @param {Boolean} supply  Whether or not supply was consumed during the rest
   */
  async adjustTrackedConditions(haven, supply) {
    const updates = {};
    const { strife, fatigue } = this.system.attributes;

    if (!supply) {
      updates['system.attributes.fatigue'] = fatigue + 1;
    } else if (!haven) {
      updates['system.attributes.strife'] = strife === 1 ? 0 : strife;
      updates['system.attributes.fatigue'] = fatigue === 1 ? 0 : fatigue;
    } else {
      updates['system.attributes.strife'] = Math.max(strife - 1, 0);
      updates['system.attributes.fatigue'] = Math.max(fatigue - 1, 0);
    }

    this.update(updates);
  }

  #configure(key, title, data, options) {
    const component = this.#configDialogMap[key];
    let dialog = null;

    if (key === 'ability') dialog = this.dialogs.abilities[data.abilityKey];
    else if (key === 'skill') dialog = this.dialogs.skills[data.skillKey];
    else dialog = this.dialogs[key];

    if (!dialog) {
      dialog = new GenericConfigDialog(this, title, component, data, options);

      if (key === 'ability') this.dialogs.abilities[data.abilityKey] = dialog;
      else if (key === 'skill') this.dialogs.skills[data.skillKey] = dialog;
      else this.dialogs[key] = dialog;
    }

    dialog.render(true);
  }

  configureAbilityScore(data = {}, options = {}) {
    const title = localize(
      'A5E.AbilityCheckPromptTitle',
      { name: this.name, ability: localize(CONFIG.A5E.abilities[data.abilityKey]) }
    );

    this.#configure('ability', title, data, options);
  }

  configureArmorProficiencies(data = {}, options = {}) {
    const title = localize('A5E.ArmorProficienciesConfigurationPrompt', { name: this.name });
    this.#configure('armor', title, data, options);
  }

  configureConditionImmunities(data = {}, options = {}) {
    const title = localize('A5E.ConditionImmunitiesConfigurationPrompt', { name: this.name });
    this.#configure('conditionImmunities', title, data, options);
  }

  configureCreatureTypes(data = {}, options = {}) {
    const title = localize('A5E.CreatureTypesConfigurationPrompt', { name: this.name });
    this.#configure('types', title, data, options);
  }

  configureDamageImmunities(data = {}, options = {}) {
    const title = localize('A5E.DamageImmunitiesConfigurationPrompt', { name: this.name });
    this.#configure('damageImmunities', title, data, options);
  }

  configureDamageResistances(data = {}, options = {}) {
    const title = localize('A5E.DamageResistancesConfigurationPrompt', { name: this.name });
    this.#configure('damageResistances', title, data, options);
  }

  configureDamageVulnerabilities(data = {}, options = {}) {
    const title = localize('A5E.DamageVulnerabilitiesConfigurationPrompt', { name: this.name });
    this.#configure('damageVulnerabilities', title, data, options);
  }

  configureHealth(data = {}, options = {}) {
    const title = localize('A5E.HitPointsConfigurationPrompt', { name: this.name });
    options.width ??= 380;
    this.#configure('health', title, data, options);
  }

  configureInitiative(data = {}, options = {}) {
    const title = localize('A5E.InitiativeConfigurationPrompt', { name: this.name });
    this.#configure('initiative', title, data, options);
  }

  configureLanguages(data = {}, options = {}) {
    const title = localize('A5E.LanguagesConfigurationPrompt', { name: this.name });
    this.#configure('languages', title, data, options);
  }

  configureManeuvers(data = {}, options = {}) {
    const title = localize('A5E.ManeuverConfigurationPrompt', { name: this.name });
    this.#configure('maneuvers', title, data, options);
  }

  configureMovement(data = {}, options = {}) {
    const title = localize('A5E.MovementConfigurationPrompt', { name: this.name });
    this.#configure('movement', title, data, options);
  }

  configureSenses(data = {}, options = {}) {
    const title = localize('A5E.SensesConfigurationPrompt', { name: this.name });
    this.#configure('senses', title, data, options);
  }

  configureSizeCategory(data = {}, options = {}) {
    const title = localize('A5E.SizeCategoryConfigurationPrompt', { name: this.name });
    this.#configure('size', title, data, options);
  }

  configureSkill(data = {}, options = {}) {
    const title = localize(
      'A5E.SkillConfigurationPrompt',
      { name: this.name, skill: localize(CONFIG.A5E.skills[data.skillKey]) }
    );

    this.#configure('skill', title, data, options);
  }

  configureSpellTab(data = {}, options = {}) {
    const title = localize('A5E.SpellTabConfigurationPrompt', { name: this.name });
    this.#configure('spells', title, data, options);
  }

  configureToolProficiencies(data = {}, options = {}) {
    const title = localize('A5E.ToolProficienciesConfigurationPrompt', { name: this.name });
    this.#configure('tools', title, data, options);
  }

  configureWeaponProficiencies(data = {}, options = {}) {
    const title = localize('A5E.WeaponProficienciesConfigurationPrompt', { name: this.name });
    this.#configure('weapons', title, data, options);
  }

  get isBloodied() {
    const { max, value } = this.system.attributes.hp;
    return (value / max) * 100 <= 50;
  }

  async modifyTokenAttribute(attribute, value, isDelta, isBar) {
    if (attribute === 'attributes.hp') {
      const hp = getProperty(this.system, attribute);
      const hpPool = hp.value + hp.temp;
      const delta = hpPool - value;

      if (isDelta) {
        return value <= 0 ? this.applyDamage(-1 * value) : this.applyHealing(value);
      }

      return delta <= 0 ? this.applyHealing(-1 * delta) : this.applyHealing(delta);
    }

    return super.modifyTokenAttribute(attribute, value, isDelta, isBar);
  }

  async resetHitPoints() {
    const { baseMax } = this.system.attributes.hp;

    this.update({
      'data.attributes.hp': {
        bonus: 0,
        value: baseMax,
        temp: 0
      }
    });
  }

  async restoreExertion() {
    const { exertion } = this.system.attributes;

    if (!exertion?.recoverOnRest) return;

    await this.update({
      'data.attributes.exertion.current': exertion.max
    });
  }

  async restoreHitDice() {
    const { hitDice } = this.system.attributes;
    const updates = {};

    const expendedHitDice = Object.entries(hitDice).reduce((acc, [die, { current, total }]) => {
      acc[die] = Math.max(total - current, 0);
      return acc;
    }, {});

    // eslint-disable-next-line max-len
    const expendedHitDiceQuantity = Object.values(expendedHitDice).reduce((count, curr) => count + curr, 0);

    // eslint-disable-next-line max-len
    const totalHitDiceQuantity = Object.values(hitDice).reduce((count, { total: curr }) => count + curr, 0);
    const quantityToRecover = Math.floor(totalHitDiceQuantity / 2) || 1;

    if (quantityToRecover >= expendedHitDiceQuantity) {
      updates['system.attributes.hitDice'] = {
        'd6.current': hitDice.d6.total,
        'd8.current': hitDice.d8.total,
        'd10.current': hitDice.d10.total,
        'd12.current': hitDice.d12.total
      };
    } else {
      for (let i = 0; i < quantityToRecover; i += 1) {
        // eslint-disable-next-line no-restricted-syntax
        for (const dieSize of Object.keys(hitDice).reverse()) {
          if (expendedHitDice[dieSize] > 0) {
            if (!updates[`system.attributes.hitDice.${dieSize}.current`]) {
              updates[`system.attributes.hitDice.${dieSize}.current`] = hitDice[dieSize].current + 1;
            } else {
              updates[`system.attributes.hitDice.${dieSize}.current`] += 1;
            }

            expendedHitDice[dieSize] -= 1;
            break;
          }
        }
      }
    }

    await this.update(updates);
  }

  async restoreItemUses() {
    const items = Array.from(this.items);

    items.forEach(async (item) => {
      const { uses } = item.system;

      if (['shortRest', 'longRest'].includes(uses.per)) {
        if (uses.max) {
          await item.update({ 'data.uses.value': uses.max });
        }
      }
    });
  }

  async restoreSpellResources(restType) {
    const { spellResources } = this.system;

    const updates = {
      'system.spellResources.points.current': Math.max(spellResources.points.max, 0)
    };

    if (restType === 'long') {
      Object.entries(spellResources.slots).forEach(([level, { max }]) => {
        updates[`system.spellResources.slots.${level}.current`] = Math.max(max, 0);
      });
    }

    this.update(updates);
  }

  /**
   * Rolls an ability check for a given skill. A dialog is presented to the user so that they can
   * perform choose the size of the expertise die to use for the check.
   *
   * @async
   * @method
   * @param {string} abilityKey A key that can be used to reference a given ability score.
   */
  async rollAbilityCheck(abilityKey, options = {}) {
    let dialogData;

    if (options.skipRollDialog) dialogData = this.getDefaultAbilityCheckData(abilityKey, options);
    else dialogData = await this.#showAbilityCheckPrompt(abilityKey, options);

    if (!dialogData) return;

    const { rollFormula } = dialogData;
    const roll = await new CONFIG.Dice.D20Roll(rollFormula).roll({ async: true });

    const chatData = {
      user: game.user?.id,
      speaker: ChatMessage.getSpeaker({ actor: this }),
      type: CONST.CHAT_MESSAGE_TYPES.ROLL,
      sound: CONFIG.sounds.dice,
      rolls: [roll],
      flags: {
        a5e: {
          abilityKey,
          actorId: this.uuid,
          cardType: 'abilityCheck',
          img: this.token?.img ?? this.img,
          name: this.name
        }
      },
      content: '<article></article>'
    };

    const hookData = { abilityKey, rollFormula };
    Hooks.callAll('a5e.rollAbilityCheck', this, hookData, roll);
    ChatMessage.create(chatData);
  }

  getDefaultAbilityCheckData(abilityKey, options = {}) {
    const ability = this.system.abilities[abilityKey];

    const { rollFormula } = constructD20RollFormula({
      actor: this,
      rollMode: options?.rollMode ?? CONFIG.A5E.ROLL_MODE.NORMAL,
      modifiers: [
        {
          label: localize('A5E.AbilityCheckMod', { ability: localize(CONFIG.A5E.abilities[abilityKey]) }),
          value: ability.check.mod
        },
        {
          label: localize('A5E.AbilityCheckBonus', {
            ability: localize(
              CONFIG.A5E.abilities[abilityKey]
            )
          }),
          value: ability.check.bonus
        },
        {
          label: localize('A5E.AbilityCheckBonusGlobal'),
          value: this.system.bonuses.abilities.check
        },
        {
          label: localize('A5E.ExpertiseDie'),
          value: getExpertiseDieSize(options?.expertiseDice ?? ability.expertiseDice)
        },
        {
          value: options?.situationalMods
        }
      ]
    });

    return { rollFormula };
  }

  async #showAbilityCheckPrompt(abilityKey, options) {
    const dialog = new AbilityCheckRollDialog(this, abilityKey, options);
    await dialog.render(true);
    const dialogData = await dialog.promise;

    return dialogData;
  }

  async rollDeathSavingThrow(options = {}) {
    options.saveType = 'death';

    this.rollSavingThrow(null, options);
  }

  async rollHitDice(dieSize, quantity = 1) {
    const actorData = this.system;
    const { attributes } = actorData;

    if (attributes.hitDice[dieSize].current - quantity < 0) return;

    const title = localize('A5E.HitDiceChatHeader', { dieSize: dieSize.toUpperCase() });

    const conMod = parseInt(actorData.abilities.con.check.mod, 10);
    const formula = `${quantity}${dieSize} + ${quantity * conMod}`;

    const roll = await new Roll(formula).roll({ async: true });

    const chatData = {
      user: game.user?.id,
      speaker: ChatMessage.getSpeaker({ actor: this }),
      type: CONST.CHAT_MESSAGE_TYPES.ROLL,
      sound: CONFIG.sounds.dice,
      rolls: [roll],
      flags: {
        a5e: {
          actorId: this.uuid,
          cardType: 'hitDice',
          img: this.token?.img ?? this.img,
          name: this.name,
          title
        }
      },
      content: '<article></article>'
    };

    const hpDelta = Math.max(roll.total, 0);
    const maxHp = attributes.hp.baseMax + attributes.hp.bonus;

    this.update({
      'data.attributes': {
        [`hitDice.${dieSize}.current`]: attributes.hitDice[dieSize].current - quantity
      }
    });

    // Apply healing
    this.applyHealing(hpDelta);

    ChatMessage.create(chatData);

    Hooks.callAll('a5e.rollHitDice', this, {
      dieSize,
      dieCount: (attributes.hitDice[dieSize].current - quantity),
      formula,
      newHp: Math.min(attributes.hp.value + hpDelta, maxHp),
      roll,
      quantity
    });
  }

  async rollSavingThrow(abilityKey, options = {}) {
    let dialogData;

    if (options.skipRollDialog) dialogData = this.getDefaultSavingThrowData(abilityKey, options);
    else dialogData = await this.#showSavingThrowPrompt(abilityKey, options);

    if (dialogData === null) return;

    const { rollFormula } = dialogData;
    const roll = await new CONFIG.Dice.D20Roll(rollFormula).roll({ async: true });

    const chatData = {
      user: game.user?.id,
      speaker: ChatMessage.getSpeaker({ actor: this }),
      type: CONST.CHAT_MESSAGE_TYPES.ROLL,
      sound: CONFIG.sounds.dice,
      rolls: [roll],
      flags: {
        a5e: {
          abilityKey,
          actorId: this.uuid,
          cardType: 'savingThrow',
          img: this.token?.img ?? this.img,
          name: this.name
        }
      },
      content: '<article></article>'
    };

    const hookData = { abilityKey, rollFormula };

    if (options?.saveType === 'death') {
      Hooks.callAll('a5e.rollDeathSavingThrow', this, hookData, roll);
      this.updateDeathSavingThrowFigures(roll);
    } else {
      Hooks.callAll('a5e.rollSavingThrow', this, hookData, roll);
    }

    ChatMessage.create(chatData);
  }

  getDefaultSavingThrowData(abilityKey, options = {}) {
    const ability = this.system.abilities[abilityKey];

    const { rollFormula } = constructD20RollFormula({
      actor: this,
      rollMode: options?.rollMode ?? CONFIG.A5E.ROLL_MODE.NORMAL,
      modifiers: [
        {
          label: localize('A5E.AbilityCheckMod', {
            ability: localize(CONFIG.A5E.abilities[ability])
          }),
          value: ability?.save.mod
        },
        {
          label: localize('A5E.SavingThrowBonus', {
            ability: localize(CONFIG.A5E.abilities[ability])
          }),
          value: ability?.save.bonus
        },
        {
          label: localize('A5E.ConcentrationBonus'),
          value:
            options.saveType === 'concentration'
              ? ability?.save.concentrationBonus
              : null
        },
        {
          label: localize('A5E.SavingThrowBonusGlobal'),
          value: this.system.bonuses.abilities.save
        },
        {
          label: localize('A5E.ExpertiseDie'),
          value: getExpertiseDieSize(options?.expertiseDice ?? ability?.expertiseDice)
        },
        {
          value: options?.situationalMods
        }
      ]
    });

    return { rollFormula };
  }

  async #showSavingThrowPrompt(abilityKey, options) {
    const dialog = new SavingThrowRollDialog(this, abilityKey, options);
    await dialog.render(true);
    const dialogData = await dialog.promise;

    return dialogData;
  }

  /**
   * Rolls a skill check for a given skill. A dialog is presented to the user so that they can
   * perform additional configuration, such as choosing an ability score for the check.
   *
   * @async
   * @method
   * @param {string} skillKey A key that can be used to reference a given skill.
   * @param {object}
   *
   * @returns {Promise<undefined>}
   */
  async rollSkillCheck(skillKey, options = {}) {
    let rollData;

    if (options.skipRollDialog) rollData = this.getDefaultSkillCheckData(skillKey, options);
    else rollData = await this.#showSkillCheckPrompt(skillKey, options);

    if (!rollData) return;

    const { rollFormula, abilityKey } = rollData;
    const roll = await new CONFIG.Dice.D20Roll(rollFormula).roll({ async: true });

    const chatData = {
      user: game.user?.id,
      speaker: ChatMessage.getSpeaker({ actor: this }),
      type: CONST.CHAT_MESSAGE_TYPES.ROLL,
      sound: CONFIG.sounds.dice,
      rolls: [roll],
      flags: {
        a5e: {
          abilityKey,
          actorId: this.uuid,
          cardType: 'skillCheck',
          img: this.token?.img ?? this.img,
          name: this.name,
          skillKey
        }
      },
      content: '<article></article>'
    };

    const hookData = {
      abilityKey, rollFormula, skillKey
    };

    Hooks.callAll('a5e.rollSkillCheck', this, hookData, roll);
    ChatMessage.create(chatData);
  }

  getDefaultSkillCheckData(skillKey, options = {}) {
    const skill = this.system.skills[skillKey];
    const abilityKey = options?.abilityKey ?? skill.ability;
    const ability = this.system.abilities[abilityKey];

    // TODO: Update the keys below to use format and proper localisations.

    const { rollFormula } = constructD20RollFormula({
      actor: this,
      rollMode: options?.rollMode ?? CONFIG.A5E.ROLL_MODE.NORMAL,
      minRoll: options?.minRoll ?? skill.minRoll,
      modifiers: [
        {
          label: localize('A5E.SkillCheckMod', { skill: localize(CONFIG.A5E.skills[skillKey]) }),
          value: skill.mod
        },
        {
          label: localize('A5E.AbilityCheckMod', { ability: localize(CONFIG.A5E.abilities[abilityKey]) }),
          value: ability?.check.mod
        },
        {
          label: localize('A5E.SkillCheckBonus', {
            skill: localize(CONFIG.A5E.skills[skillKey])
          }),
          value: skill.bonuses.check
        },
        {
          label: localize('A5E.AbilityCheckBonus', {
            ability: localize(CONFIG.A5E.abilities[abilityKey])
          }),
          value: ability?.check.bonus
        },
        {
          label: localize('A5E.SkillCheckBonusGlobal'),
          value: this.system.bonuses.abilities.skill
        },
        {
          label: localize('A5E.AbilityCheckBonusGlobal'),
          value: this.system.bonuses.abilities.check
        },
        {
          label: localize('A5E.ExpertiseDie'),
          value: getExpertiseDieSize(options?.expertiseDice ?? skill.expertiseDice)
        },
        {
          value: options?.situationalMods
        }
      ]
    });

    return { rollFormula, abilityKey };
  }

  async #showSkillCheckPrompt(skillKey, options) {
    const dialog = new SkillCheckRollDialog(this, skillKey, options);
    await dialog.render(true);
    const dialogData = await dialog.promise;

    return dialogData;
  }

  toggleElite() {
    this.update({ 'system.details.elite': !this.system.details.elite });
  }

  toggleInspiration() {
    const currentState = this.system.attributes.inspiration;
    this.update({ 'system.attributes.inspiration': !currentState });

    if (currentState) {
      Hooks.callAll('a5e.inspirationUsed', this);
    } else {
      Hooks.callAll('a5e.inspirationGained', this);
    }
  }

  async triggerRest() {
    const title = localize('A5E.RestConfigurationPrompt', { name: this.name });
    const dialog = new GenericConfigDialog(this, title, RestDialog);
    await dialog.render(true);
    const restData = await dialog?.promise;

    if (!restData) return;
    const {
      consumeSupply, haven, restType, recoverStrifeAndFatigue
    } = restData;

    if (restType === 'long') {
      await this.resetHitPoints();
      await this.restoreHitDice();
      await this.adjustTrackedConditions(haven, recoverStrifeAndFatigue);

      if (consumeSupply) {
        await this.update({ 'system.supply': Math.max(this.system.supply - 1, 0) });
      }
    }

    await this.restoreExertion();
    await this.restoreItemUses();
    await this.restoreSpellResources(restType);

    Hooks.callAll('a5e.restCompleted', this, {
      consumeSupply, haven, restType, recoverStrifeAndFatigue
    });
  }

  async updateDeathSavingThrowFigures(roll) {
    const { success, failure } = this.system.attributes.death;
    const d20Result = roll.dice[0].total;

    const updates = {
      'system.attributes.death': { success, failure }
    };

    if (d20Result === 1) updates['system.attributes.death'].failure += 2;
    else if (d20Result === 20) updates['system.attributes.hp.value'] = 1;
    else if (d20Result < 10) updates['system.attributes.death'].failure += 1;
    else updates['system.attributes.death'].success += 1;

    await this.update(updates);
  }
}
