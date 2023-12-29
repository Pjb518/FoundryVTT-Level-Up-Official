/* eslint-disable no-restricted-syntax */
import { localize } from '#runtime/svelte/helper';

import ActiveEffectA5e from '../activeEffect/activeEffect';
import BonusesManager from '../../managers/BonusesManager';
import MigrationRunnerBase from '../../migration/MigrationRunnerBase';
import RestManager from '../../managers/RestManager';
import RollPreparationManager from '../../managers/RollPreparationManager';

import AbilityBonusConfigDialog from '../../apps/dialogs/AbilityBonusConfigDialog.svelte';
import AbilityCheckConfigDialog from '../../apps/dialogs/ActorAbilityConfigDialog.svelte';
import AbilityCheckRollDialog from '../../apps/dialogs/AbilityCheckRollDialog.svelte';
import ActorHpConfigDialog from '../../apps/dialogs/ActorHpConfigDialog.svelte';
import ActorInitConfigDialog from '../../apps/dialogs/ActorInitConfigDialog.svelte';
import ActorManueverConfigDialog from '../../apps/dialogs/ActorManueverConfigDialog.svelte';
import ActorSpellConfigDialog from '../../apps/dialogs/ActorSpellConfigDialog.svelte';
import ArmorProfConfigDialog from '../../apps/dialogs/ArmorProfConfigDialog.svelte';
import ArmorClassConfigDialog from '../../apps/dialogs/ArmorClassConfigDialog.svelte';
import ConditionImmunitiesConfigDialog from '../../apps/dialogs/ConditionImmunitiesConfigDialog.svelte';
import CreatureSizeConfigDialog from '../../apps/dialogs/CreatureSizeConfigDialog.svelte';
import CreatureTypeConfigDialog from '../../apps/dialogs/CreatureTypeConfigDialog.svelte';
import DamageBonusConfigDialog from '../../apps/dialogs/DamageBonusConfigDialog.svelte';
import DamageImmunitiesConfigDialog from '../../apps/dialogs/DamageImmunitiesConfigDialog.svelte';
import DamageResistancesConfigDialog from '../../apps/dialogs/DamageResistancesConfigDialog.svelte';
import DamageVulnerabilitiesConfigDialog from '../../apps/dialogs/DamageVulnerabilitiesConfigDialog.svelte';
import HealingBonusConfigDialog from '../../apps/dialogs/HealingBonusConfigDialog.svelte';
import LanguagesConfigDialog from '../../apps/dialogs/LanguagesConfigDialog.svelte';
import MovementConfigDialog from '../../apps/dialogs/MovementConfigDialog.svelte';
import RestDialog from '../../apps/dialogs/RestDialog.svelte';
import SavingThrowRollDialog from '../../apps/dialogs/SavingThrowRollDialog.svelte';
import SensesConfigDialog from '../../apps/dialogs/SensesConfigDialog.svelte';
import SkillBonusConfigDialog from '../../apps/dialogs/SkillBonusConfigDialog.svelte';
import SkillCheckRollDialog from '../../apps/dialogs/SkillCheckRollDialog.svelte';
import SkillConfigDialog from '../../apps/dialogs/SkillConfigDialog.svelte';
import ToolProfConfigDialog from '../../apps/dialogs/ToolProfConfigDialog.svelte';
import WeaponProfConfigDialog from '../../apps/dialogs/WeaponProfConfigDialog.svelte';

import GenericConfigDialog from '../../apps/dialogs/initializers/GenericConfigDialog';
import GenericRollDialog from '../../apps/dialogs/initializers/GenericRollDialog';

import automateHpConditions from '../activeEffect/utils/automateHpConditions';
import getDeterministicBonus from '../../dice/getDeterministicBonus';
import getRollFormula from '../../utils/getRollFormula';
import overrideRollMode from '../../utils/overrideRollMode';
import automateMultiLevelConditions from '../activeEffect/utils/automateMultiLevelConditions';

export default class ActorA5e extends Actor {
  #configDialogMap;

  constructor(...args) {
    super(...args);

    this.dialogs ??= {
      abilities: {},
      bonuses: {},
      genericResources: {},
      skills: {},
      notes: {}
    };

    this.#configDialogMap = {
      ability: AbilityCheckConfigDialog,
      abilityBonus: AbilityBonusConfigDialog,
      armor: ArmorProfConfigDialog,
      armorClass: ArmorClassConfigDialog,
      conditionImmunities: ConditionImmunitiesConfigDialog,
      damageBonus: DamageBonusConfigDialog,
      damageImmunities: DamageImmunitiesConfigDialog,
      damageResistances: DamageResistancesConfigDialog,
      damageVulnerabilities: DamageVulnerabilitiesConfigDialog,
      healingBonus: HealingBonusConfigDialog,
      health: ActorHpConfigDialog,
      initiative: ActorInitConfigDialog,
      languages: LanguagesConfigDialog,
      maneuvers: ActorManueverConfigDialog,
      movement: MovementConfigDialog,
      senses: SensesConfigDialog,
      size: CreatureSizeConfigDialog,
      skill: SkillConfigDialog,
      skillBonus: SkillBonusConfigDialog,
      spells: ActorSpellConfigDialog,
      tools: ToolProfConfigDialog,
      types: CreatureTypeConfigDialog,
      weapons: WeaponProfConfigDialog
    };
  }

  /**
   * @returns {Array<ActiveEffectA5e>}
   */
  get actorEffects() {
    return this.effects.map((e) => e);
  }

  /**
   * @returns {String} hitPointFormula
   */
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
   * An array of ActiveEffect instances which are present on the
   * Actor which have a limited duration.
   * @type {ActiveEffect[]}
   */
  get temporaryEffects() {
    const effects = [];
    for (const effect of this.allApplicableEffects()) {
      if (effect.active && (effect.isTemporary || effect?.flags?.a5e?.transferType === 'onUse')) {
        effects.push(effect);
      }
    }
    return effects.sort((a, b) => a.name.localeCompare(b.name));
  }

  /**
   * Sets the order of when to prepare data.
   * @override
   */
  prepareData() {
    this.prepareBaseData();
    super.prepareEmbeddedDocuments();
    this.prepareDerivedData();
    this.afterDerivedData();

    if ((this.system.schemaVersion?.version ?? this.system.schema?.version) < 0.005) return;
    this.prepareArmorClass();
  }

  /**
   * Prepare base data for the actor.
   * @override
   */
  prepareBaseData() {
    const actorType = this.type;

    // Add AC data to the actor.
    if ((this.system.schemaVersion?.version ?? this.system.schema?.version) >= 0.005) {
      if (typeof this.system.attributes.ac !== 'object') {
        this.system.attributes.ac = { baseFormula: `${this.system.attributes.ac}` };
      }
      this.system.attributes.ac.changes = {
        override: null, bonuses: { components: [], value: 0 }
      };
    }

    if (actorType === 'character') {
      this.prepareCharacterData();
    } else {
      this.prepareNPCData();
    }

    // Register Managers
    this.BonusesManager = new BonusesManager(this);
  }

  /**
   * Prepare the base data for an actor of type character.
   */
  prepareCharacterData() {
    // Calculate the proficiency bonus for the character with a minimum value of 2.
    this.system.attributes.prof = Math.max(2, Math.floor((this.system.details.level + 7) / 4));
  }

  /**
   * Prepare the base data for an actor of type npc.
   */
  prepareNPCData() {
    // Calculate the proficiency bonus for the character with a minimum value of 2.
    this.system.attributes.prof = Math.max(2, Math.floor((this.system.details.cr + 7) / 4));
  }

  /**
   * Apply activeEffects to the actor with the phase 'applyAEs'.
   * @override
   */
  applyActiveEffects() {
    this.overrides = {};

    // Create base to store statuses on actor.
    this.statuses ??= new Set();

    // Identify which special statuses had been active
    const specialStatuses = new Map();
    Object.values(CONFIG.specialStatusEffects).forEach((statusId) => {
      specialStatuses.set(statusId, this.statuses.has(statusId));
    });

    this.statuses.clear();

    // Create base to store effect phases to retry effects on the next pass
    this.effectPhases ??= {
      beforeDerived: [],
      afterDerived: []
    };

    ActiveEffectA5e.applyEffects(
      this,
      this.actorEffects,
      'applyAEs',
      'afterDerived',
      (change) => game.a5e.activeEffects.options[this.type]
        .allOptions[change.key]?.phase === 'applyAEs'
    );

    // Apply special statuses that changed to active tokens
    let tokens;
    // eslint-disable-next-line no-restricted-syntax
    for (const [statusId, wasActive] of specialStatuses) {
      const isActive = this.statuses.has(statusId);
      if (isActive === wasActive) return;
      tokens ??= this.getActiveTokens();
      tokens.forEach((token) => token._onApplyStatusEffect(statusId, isActive));
    }
  }

  /**
   * Prepares derived data for the actor.
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
    Object.entries(actorData.abilities).forEach(([abilityKey, ability]) => {
      ['check', 'save'].forEach((key) => {
        let deterministicBonus;

        try {
          deterministicBonus = getDeterministicBonus(
            [
              ability[key].mod,
              this.BonusesManager.getAbilityBonusesFormula(abilityKey, key).trim()
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
      // eslint-disable-next-line no-console
      console.error(`Failed to calculate a maneuver DC for ${this.name}`);
      actorData.attributes.maneuverDC = null;
    }

    try {
      actorData.attributes.spellDC = getDeterministicBonus([
        8,
        actorData.attributes.prof,
        actorData.bonuses?.spellDC || 0,
        actorData.abilities[actorData.attributes.spellcasting || 'int'].check.mod
      ].join(' + '), this.getRollData());
    } catch {
      // eslint-disable-next-line no-console
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
    if ((this.system.schemaVersion?.version ?? this.system.schema?.version) < 0.005) return;
    foundry.utils.setProperty(this, 'system.attributes.ac.changes', this.prepareArmorChanges());
  }

  prepareArmorClass() {
    const changes = this.system.attributes.ac.changes ?? {};

    // Add Base to changes
    let name = 'Natural Armor';
    const baseAC = getDeterministicBonus(
      `${this.system.attributes.ac.baseFormula}` || '10 + @dex.mod',
      this.getRollData()
    );

    // Check for complete override of AC
    const valueOverride = foundry.utils.getProperty(this.overrides, 'system.attributes.ac.value');
    if (valueOverride !== null && valueOverride !== undefined) {
      const effectOverride = this.actorEffects
        .findLast((effect) => effect.changes.some((change) => change.key.includes('ac.value')) && !effect.isSuppressed);

      name = effectOverride?.name ?? name;
      changes.override = { name, mode: CONFIG.A5E.ARMOR_MODES.OVERRIDE, value: valueOverride };
      changes.bonuses = {
        components: [],
        value: 0
      };
    }

    // Check for baseArmor override
    const overrideProperty = foundry.utils.getProperty(this.overrides, 'system.attributes.ac.baseFormula');
    if (overrideProperty && !valueOverride) {
      const effectOverride = this.actorEffects
        .findLast((effect) => effect.changes.some((change) => change.key.includes('ac.baseFormula')) && !effect.isSuppressed);

      name = effectOverride?.name ?? name;
      changes.override = { name, mode: CONFIG.A5E.ARMOR_MODES.OVERRIDE, value: baseAC };
    }

    changes.override ??= {
      name: 'Natural Armor',
      mode: CONFIG.A5E.ARMOR_MODES.OVERRIDE,
      formula: this.system.attributes.ac.baseFormula,
      value: baseAC
    };

    // Calculate the final AC value.
    const finalAC = (changes.override?.value ?? baseAC) + changes.bonuses.value;

    foundry.utils.mergeObject(this.system.attributes.ac, {
      changes,
      value: parseInt(finalAC, 10) || 10
    });
  }

  determineDefenseConfiguration() {
    // const currentStr = this.system.abilities.str.value;
    return this.items.reduce((acc, item) => {
      if (item.system.equippedState !== CONFIG.A5E.EQUIPPED_STATES.EQUIPPED) return acc;

      const { formula } = item.system.ac ?? {};
      if (!formula) return acc;

      if (item.system.objectType === 'armor') acc.hasArmor = true;
      else if (item.system.objectType === 'shield') acc.hasShield = true;

      return acc;
    }, { hasArmor: false, hasShield: false });
  }

  prepareArmorChanges() {
    // const currentStr = this.system.abilities.str.value;
    const { hasArmor, hasShield } = this.determineDefenseConfiguration();

    const changes = this.items.reduce((acc, item) => {
      const {
        formula, mode, requiresUnarmored, requiresNoShield
      } = item.system.ac ?? {};
      if (!formula) return acc;

      if (item.type === 'feature' && mode === CONFIG.A5E.ARMOR_MODES.OVERRIDE && hasArmor) return acc;
      if ((requiresUnarmored && hasArmor) || (requiresNoShield && hasShield)) return acc;

      if (item.type === 'object'
        && item.system.equippedState !== CONFIG.A5E.EQUIPPED_STATES.EQUIPPED
      ) return acc;

      if (item.system.objectType === 'armor') {
        const isUnderArmor = item.system.materialProperties.includes('underarmor');
        if (isUnderArmor && acc.override) return acc;
      }

      const value = getDeterministicBonus(formula, this.getRollData()) ?? 0;
      const change = {
        name: item.name, id: item.uuid, mode, value
      };

      if (mode === CONFIG.A5E.ARMOR_MODES.OVERRIDE) acc.override = change;
      else if (item.system.objectType === 'shield' && value > (acc.shield?.value ?? 0)) {
        acc.shield = change;
      } else acc.bonuses.push(change);

      return acc;
    }, { override: null, shield: null, bonuses: [] });

    if (changes.shield) changes.bonuses.unshift(changes.shield);
    delete changes.shield;

    // Bring reduced changes in line with the expected format
    const bonuses = changes.bonuses.reduce((acc, { value }) => acc + value, 0);
    changes.bonuses = { components: changes.bonuses, value: bonuses };

    return changes;
  }

  prepareSkills() {
    const actorData = this.system;
    const proficiencyBonus = actorData.attributes.prof;
    const jackOfAllTrades = this.flags.a5e?.jackOfAllTrades;

    Object.values(actorData.skills).forEach((skill) => {
      if (skill.proficient) skill.mod = proficiencyBonus;
      else if (jackOfAllTrades) skill.mod = Math.floor(proficiencyBonus / 2);
      else skill.mod = 0;

      if (skill.ability.startsWith('@attributes.spellcasting')) {
        skill.ability = actorData.attributes.spellcasting;
      }
    });

    Object.entries(actorData.skills).forEach(([key, skill]) => {
      const skillName = localize(CONFIG.A5E.skills[key]);

      let deterministicBonus;

      try {
        deterministicBonus = getDeterministicBonus(
          [
            skill.mod,
            this.BonusesManager.getSkillBonusesFormula(key, skill.ability, 'check').trim()
          ].filter(Boolean).join(' + '),
          this.getRollData()
        );
      } catch {
        // eslint-disable-next-line no-console
        console.error(`Couldn't calculate a ${skillName} modifier for ${this.name}`);
      }

      skill.deterministicBonus = deterministicBonus ?? skill.mod;

      try {
        skill.passive = this._calculatePassiveScore(key, skill);
      } catch {
        // eslint-disable-next-line no-console
        console.error(`Couldn't calculate a ${skillName} passive score for ${this.name}`);
        skill.passive = null;
      }
    });
  }

  _calculatePassiveScore(skillKey, skill) {
    const rollData = this.getRollData();

    return getDeterministicBonus([
      10,
      skill.mod,
      rollData.abilities[skill.ability]?.check?.deterministicBonus ?? 0,
      this.BonusesManager.getSkillBonusesFormula(skillKey, skill.ability, 'passive').trim()
    ].filter(Boolean).join(' + '), rollData);
  }

  /**
   * Prepare active effects for the actor with the phase 'afterDerived'.
   */
  afterDerivedData() {
    ActiveEffectA5e.applyEffects(
      this,
      this.actorEffects,
      'afterDerived',
      null,
      (change) => game.a5e.activeEffects.options[this.type]
        .allOptions[change.key]?.phase === 'afterDerived'
    );
  }

  /**
   * {@deprecated}
   */
  async applyPermanentEffects() {
    const effects = Array.from(this.items).flatMap((i) => i.effects.contents)
      .filter((e) => e.flags?.a5e?.transferType === 'permanent');

    const overrides = ActiveEffectA5e.getPermanentEffectChanges(this.toObject(), effects);
    // FIXME: Store theses updates somewhere so they can be undone and so
    // that the next run can figure out what changed

    // TODO: Add warning
    await this.update(overrides);
  }

  /** @inheritdoc */
  async _preCreate(data, options, user) {
    await super._preCreate(data, options, user);

    const items = [...this.items];
    // Add schema version
    if (!this.system.schemaVersion?.version && !this.system.schema?.version) {
      let version = null;
      if (['number', 'string'].includes(typeof this.system.ac)) version = 0.004;
      else if (items.some((i) => typeof i.system?.equipped === 'boolean')) version = 0.003;
      else if (items.some((i) => typeof i.system?.recharge === 'string')) version = 0.002;
      else if (items.some((i) => typeof i.system?.uses?.max === 'number')) version = 0.001;
      else if (typeof this.system.attributes.movement?.walk?.unit !== 'string') version = null;
      else version = MigrationRunnerBase.LATEST_SCHEMA_VERSION;

      this.updateSource({
        'system.schemaVersion.version': version
      });
    }

    // Player character configuration
    if (this.type === 'character') {
      const prototypeToken = { vision: true, actorLink: true, disposition: 1 };
      this.updateSource({ prototypeToken });
    }
  }

  /** @inheritdoc */
  async _preUpdate(changed, options, user) {
    const hasRemoveFlag = Object.keys(this.flags?.a5e ?? {}).includes('-=autoApplyFSConditions');
    const isRemoveFlag = Object.keys(changed?.flags?.a5e ?? {}).includes('-=-=autoApplyFSConditions');

    if (hasRemoveFlag && !isRemoveFlag) {
      await this.unsetFlag('a5e', '-=autoApplyFSConditions');
    }

    const autoApplyFSConditions = changed?.flags?.a5e?.autoApplyFSConditions ?? true;
    if (autoApplyFSConditions) {
      automateMultiLevelConditions(this, foundry.utils.deepClone(changed), user.id);
    }

    foundry.utils.setProperty(changed, 'flags.a5e.-=autoApplyFSConditions', null);

    await super._preUpdate(changed, options, user);

    // If hp drops below 0, set the value to 0.
    if (foundry.utils.getProperty(changed, 'system.attributes.hp.value') < 0) {
      foundry.utils.setProperty(changed, 'system.attributes.hp.value', 0);
    }

    // If temp hp drops to or below 0, set the value to 0.
    if (foundry.utils.getProperty(changed, 'system.attributes.hp.temp') <= 0) {
      foundry.utils.setProperty(changed, 'system.attributes.hp.temp', 0);
    }

    // Reset death save counters
    const isUnconscious = this.system.attributes.hp.value === 0;
    const willRegainConsciousness = foundry.utils.getProperty(changed, 'system.attributes.hp.value') > 0;

    if (isUnconscious && willRegainConsciousness) {
      foundry.utils.setProperty(changed, 'system.attributes.death.success', 0);
      foundry.utils.setProperty(changed, 'system.attributes.death.failure', 0);
    }

    // Update prototype token sizes to reflect the actor's token size
    if (foundry.utils.getProperty(changed, 'system.traits.size')) {
      const newSize = changed.system.traits.size;

      // If titanic token is already larger than 5, don't change it
      if (newSize !== 'titan' || this.prototypeToken.width < 5) {
        foundry.utils.setProperty(changed, 'prototypeToken.height', CONFIG.A5E.tokenDimensions[newSize]);
        foundry.utils.setProperty(changed, 'prototypeToken.width', CONFIG.A5E.tokenDimensions[newSize]);
      }
    }
  }

  _onUpdate(changed, options, userId) {
    super._onUpdate(changed, options, userId);

    const applyBloodied = game.settings.get('a5e', 'automateBloodiedApplication') ?? true;
    const applyUnconscious = game.settings.get('a5e', 'automateUnconsciousApplication') ?? true;

    if (applyBloodied) automateHpConditions(this, changed, userId, 'bloodied');
    if (applyUnconscious) automateHpConditions(this, changed, userId, 'unconscious');
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
    // eslint-disable-next-line no-param-reassign
    damage = Math.floor(damage);

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
    // eslint-disable-next-line no-param-reassign
    healing = Math.floor(healing);

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

    data.spell = {
      mod: this._calculateSpellcastingMod()
    };

    data.spellcasting = {
      mod: data.spell.mod
    };

    data.level = this.system.details.level;

    data.spellDC = this.system.attributes.spellDC;
    data.maneuverDC = this.system.attributes.maneuverDC;

    return data;
  }

  _calculateSpellcastingMod() {
    const { abilities, attributes } = this.system;
    const spellcastingAbility = attributes.spellcasting || 'int';

    return abilities[spellcastingAbility].check.mod;
  }

  addBonus(type = 'damage') {
    const bonuses = foundry.utils.duplicate(this._source.system.bonuses[type] ?? {});

    if (!['abilities', 'skills', 'damage', 'healing'].includes(type)) return;

    this.update({
      [`system.bonuses.${type}`]: {
        ...bonuses,
        [foundry.utils.randomID()]: {}
      }
    });
  }

  #configure(key, title, data, options) {
    if (!this.isOwner) return;

    const component = this.#configDialogMap[key];
    let dialog = null;

    if (key === 'ability') dialog = this.dialogs.abilities[data.abilityKey];
    else if (key === 'skill') dialog = this.dialogs.skills[data.skillKey];
    else if (['abilityBonus', 'damageBonus', 'healingBonus', 'skillBonus'].includes(key)) {
      dialog = this.dialogs.bonuses[data.bonusID];
    }
    else dialog = this.dialogs[key];

    if (!dialog) {
      dialog = new GenericConfigDialog(this, title, component, data, options);

      if (key === 'ability') this.dialogs.abilities[data.abilityKey] = dialog;
      else if (key === 'skill') this.dialogs.skills[data.skillKey] = dialog;
      else if (['abilityBonus', 'damageBonus', 'healingBonus', 'skillBonus'].includes(key)) {
        this.dialogs.bonuses[data.bonusID] = dialog;
      }
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

  configureBonus(bonusID, type = 'damage') {
    if (type === 'abilities') {
      this.#configure('abilityBonus', `${this.name} Ability Bonus Configuration`, { bonusID });
    } else if (type === 'damage') {
      this.#configure('damageBonus', `${this.name} Damage Bonus Configuration`, { bonusID });
    }
    else if (type === 'healing') {
      this.#configure('healingBonus', `${this.name} Healing Bonus Configuration`, { bonusID });
    }
    else if (type === 'skills') {
      this.#configure('skillBonus', `${this.name} Skill Bonus Configuration`, { bonusID });
    }
  }

  configureArmorClass(data = {}, options = {}) {
    const title = localize('A5E.ACConfigurationPrompt', { name: this.name });
    this.#configure('armorClass', title, data, options);
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
    this.#configure('initiative', title, data, { ...options, width: options.width ?? 432 });
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

  configureSkill(data = {}, options = { width: 440 }) {
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

  async deleteBonus(id, type = 'damage') {
    // Close dialog
    const dialog = this.dialogs.bonuses[id];
    await dialog?.close();
    delete this.dialogs.bonuses[id];

    await this.update({
      [`system.bonuses.${type}`]: {
        [`-=${id}`]: null
      }
    });
  }

  duplicateBonus(id, type = 'damage') {
    let defaultLabel;
    const bonuses = foundry.utils.duplicate(this._source.system.bonuses[type] ?? {});

    if (foundry.utils.isEmpty(bonuses)) return;

    const newBonus = foundry.utils.duplicate(
      this.system.bonuses[type][id]
    );

    if (type === 'damage') defaultLabel = localize('A5E.NewDamageBonus');
    else if (type === 'healing') defaultLabel = localize('A5E.NewHealingBonus');
    else defaultLabel = 'New Bonus';

    newBonus.label = `${newBonus.label || defaultLabel} (Copy)`;

    this.update({
      [`system.bonuses.${type}`]: {
        ...bonuses,
        [foundry.utils.randomID()]: newBonus
      }
    });
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

      return delta <= 0 ? this.applyHealing(-1 * delta) : this.applyDamage(delta);
    }

    return super.modifyTokenAttribute(attribute, value, isDelta, isBar);
  }

  async recoverExertionUsingHitDice() {
    const { current, max } = this.system.attributes.exertion;

    const [lowestAvailableHitDie] = Object.entries(this.system.attributes.hitDice).find(
      // eslint-disable-next-line no-unused-vars, @typescript-eslint/no-unused-vars
      ([_, { current: c, total: t }]) => c > 0 && t > 0
    );

    if (!lowestAvailableHitDie) {
      ui.notifications.warn(`${this.name} has no hit dice remaining.`);
      return;
    }

    const roll = await new Roll('1d4');

    // TODO: Make the message prettier
    await roll.toMessage();
    const newExertion = Math.min((current ?? 0) + roll.total, max);
    const newHitDieCount = this.system.attributes.hitDice[lowestAvailableHitDie].current - 1;

    await this.update({
      'system.attributes': {
        'exertion.current': newExertion,
        [`hitDice.${lowestAvailableHitDie}.current`]: newHitDieCount
      }
    });
  }

  /**
   * Rolls an ability check for a given skill. A dialog is presented to the user so that they can
   * perform choose the size of the expertise die to use for the check.
   *
   * @async
   * @method
   * @param {string} abilityKey A key that can be used to reference a given ability score.
   * @returns {Object}
   */
  async rollAbilityCheck(abilityKey, options = {}) {
    let dialogData;

    if (options.skipRollDialog) dialogData = this.getDefaultAbilityCheckData(abilityKey, options);
    else dialogData = await this.#showAbilityCheckPrompt(abilityKey, options);

    if (!dialogData) return null;

    const {
      expertiseDie, rollFormula, rollMode, visibilityMode
    } = dialogData;

    const rollPreparationManager = new RollPreparationManager({
      actor: this,
      rolls: [
        {
          ability: abilityKey,
          expertiseDie,
          rollFormula,
          rollMode,
          type: 'abilityCheck'
        }
      ]
    });

    const rolls = await rollPreparationManager.prepareRolls();

    const chatData = {
      user: game.user?.id,
      speaker: ChatMessage.getSpeaker({ actor: this }),
      type: CONST.CHAT_MESSAGE_TYPES.ROLL,
      sound: CONFIG.sounds.dice,
      rolls: rolls.map(({ roll }) => roll),
      rollMode: visibilityMode ?? game.settings.get('core', 'rollMode'),
      flags: {
        a5e: {
          actorId: this.uuid,
          cardType: 'abilityCheck',
          img: this.token?.img ?? this.img,
          name: this.name,
          rollData: rolls.map(({ roll, ...rollData }) => rollData)
        }
      },
      content: '<article></article>'
    };

    const hookData = {
      abilityKey, expertiseDie, rollFormula, rollMode
    };

    Hooks.callAll('a5e.rollAbilityCheck', this, hookData, rolls);

    const chatCard = await ChatMessage.create(chatData);
    return chatCard;
  }

  getDefaultAbilityCheckData(abilityKey, options = {}) {
    const ability = this.system.abilities[abilityKey];
    const defaultRollMode = options?.rollMode ?? CONFIG.A5E.ROLL_MODE.NORMAL;
    const expertiseDie = options.expertiseDice ?? ability.check.expertiseDice;

    const rollMode = overrideRollMode(
      this,
      defaultRollMode,
      { ability: abilityKey, type: 'check' }
    );

    const rollFormula = getRollFormula(this, {
      ability: abilityKey,
      expertiseDie,
      rollMode,
      situationalMods: options.situationalMods,
      type: 'abilityCheck'
    });

    return { expertiseDie, rollFormula, visibilityMode: options.visibilityMode ?? null };
  }

  async #showAbilityCheckPrompt(abilityKey, rollOptions = {}, dialogOptions = {}) {
    const title = localize(
      'A5E.AbilityCheckPromptTitle',
      { name: this.name, ability: localize(CONFIG.A5E.abilities[abilityKey]) }
    );

    const dialog = new GenericRollDialog(
      this,
      title,
      AbilityCheckRollDialog,
      { abilityKey },
      rollOptions,
      dialogOptions
    );

    await dialog.render(true);
    const dialogData = await dialog.promise;

    return dialogData;
  }

  async rollDeathSavingThrow(options = {}) {
    options.saveType = 'death';
    options.expertiseDice ??= 0;
    options.visibilityMode ??= 'gmroll';

    if (game.settings.get('a5e', 'blindDeathSaves')) {
      options.visibilityMode = 'blindroll';
    }

    this.rollSavingThrow(null, options);
  }

  async rollHitDice(dieSize, quantity = 1) {
    const actorData = this.system;
    const { attributes } = actorData;

    if (attributes.hitDice[dieSize].current - quantity < 0) return null;

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
          // cardType: 'hitDice',
          img: this.token?.img ?? this.img,
          name: this.name,
          title
        }
      }
      // content: '<article></article>'
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
    const chatCard = await ChatMessage.create(chatData);

    Hooks.callAll('a5e.rollHitDice', this, {
      dieSize,
      dieCount: (attributes.hitDice[dieSize].current - quantity),
      formula,
      newHp: Math.min(attributes.hp.value + hpDelta, maxHp),
      roll,
      quantity
    });

    return chatCard;
  }

  async rollSavingThrow(abilityKey, options = {}) {
    let dialogData;

    if (options.skipRollDialog) dialogData = this.getDefaultSavingThrowData(abilityKey, options);
    else dialogData = await this.#showSavingThrowPrompt(abilityKey, options);

    if (dialogData === null) return null;

    const {
      expertiseDie, rollFormula, rollMode, saveType, visibilityMode
    } = dialogData;

    const rollPreparationManager = new RollPreparationManager({
      actor: this,
      rolls: [
        {
          ability: abilityKey,
          expertiseDie,
          rollFormula,
          rollMode,
          saveType,
          type: 'savingThrow'
        }
      ]
    });

    const rolls = await rollPreparationManager.prepareRolls();

    const chatData = {
      user: game.user?.id,
      speaker: ChatMessage.getSpeaker({ actor: this }),
      type: CONST.CHAT_MESSAGE_TYPES.ROLL,
      sound: CONFIG.sounds.dice,
      rolls: rolls.map(({ roll }) => roll),
      rollMode: visibilityMode ?? game.settings.get('core', 'rollMode'),
      flags: {
        a5e: {
          actorId: this.uuid,
          cardType: 'savingThrow',
          img: this.token?.img ?? this.img,
          name: this.name,
          rollData: rolls.map(({ roll, ...rollData }) => rollData)
        }
      },
      content: '<article></article>'
    };

    const hookData = {
      abilityKey, expertiseDie, rollFormula, rollMode
    };

    if (options?.saveType === 'death') {
      Hooks.callAll('a5e.rollDeathSavingThrow', this, hookData, rolls);
      this.updateDeathSavingThrowFigures(rolls.map(({ roll }) => roll)[0]);
    } else {
      Hooks.callAll('a5e.rollSavingThrow', this, hookData, rolls);
    }

    const chatCard = await ChatMessage.create(chatData);
    return chatCard;
  }

  getDefaultSavingThrowData(abilityKey, options = {}) {
    const ability = this.system.abilities[abilityKey];
    const defaultRollMode = options?.rollMode ?? CONFIG.A5E.ROLL_MODE.NORMAL;
    const expertiseDie = options.expertiseDice ?? ability?.save.expertiseDice ?? 0;

    const rollMode = overrideRollMode(
      this,
      defaultRollMode,
      { ability: abilityKey, deathSave: abilityKey === null, type: 'save' }
    );

    const rollFormula = getRollFormula(this, {
      ability: abilityKey,
      expertiseDie,
      rollMode,
      saveType: options.saveType,
      situationalMods: options.situationalMods,
      type: 'savingThrow'
    });

    return { expertiseDie, rollFormula, visibilityMode: options.visibilityMode ?? null };
  }

  async #showSavingThrowPrompt(abilityKey, rollOptions = {}, dialogOptions = {}) {
    let title;

    if (rollOptions.saveType === 'death') {
      title = localize(
        'A5E.DeathSavingThrowPromptTitle',
        { name: this.name }
      );
    } else {
      title = localize(
        'A5E.SavingThrowPromptTitle',
        { name: this.name, ability: localize(CONFIG.A5E.abilities[abilityKey]) }
      );
    }

    const dialog = new GenericRollDialog(
      this,
      title,
      SavingThrowRollDialog,
      { abilityKey },
      rollOptions,
      dialogOptions
    );

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
    let dialogData;

    if (options.skipRollDialog) dialogData = this.getDefaultSkillCheckData(skillKey, options);
    else dialogData = await this.#showSkillCheckPrompt(skillKey, options);

    if (!dialogData) return null;

    const {
      abilityKey, expertiseDie, rollFormula, rollMode, visibilityMode
    } = dialogData;

    const rollPreparationManager = new RollPreparationManager({
      actor: this,
      rolls: [
        {
          ability: abilityKey,
          expertiseDie,
          rollFormula,
          rollMode,
          skill: skillKey,
          type: 'skillCheck'
        }
      ]
    });

    const rolls = await rollPreparationManager.prepareRolls();

    const chatData = {
      user: game.user?.id,
      speaker: ChatMessage.getSpeaker({ actor: this }),
      type: CONST.CHAT_MESSAGE_TYPES.ROLL,
      sound: CONFIG.sounds.dice,
      rolls: rolls.map(({ roll }) => roll),
      rollMode: visibilityMode ?? game.settings.get('core', 'rollMode'),
      flags: {
        a5e: {
          actorId: this.uuid,
          cardType: 'skillCheck',
          img: this.token?.img ?? this.img,
          name: this.name,
          rollData: rolls.map(({ roll, ...rollData }) => rollData)
        }
      },
      content: '<article></article>'
    };

    const hookData = {
      abilityKey, expertiseDie, rollFormula, rollMode, skillKey
    };

    Hooks.callAll('a5e.rollSkillCheck', this, hookData, rolls);

    const chatCard = await ChatMessage.create(chatData);
    return chatCard;
  }

  getDefaultSkillCheckData(skillKey, options = {}) {
    const skill = this.system.skills[skillKey];
    const abilityKey = options?.abilityKey ?? skill.ability;
    const defaultRollMode = options?.rollMode ?? CONFIG.A5E.ROLL_MODE.NORMAL;
    const expertiseDie = options.expertiseDice ?? skill.expertiseDice;

    const rollMode = overrideRollMode(
      this,
      defaultRollMode,
      { ability: abilityKey, skill: skillKey, type: 'skill' }
    );

    const rollFormula = getRollFormula(this, {
      ability: abilityKey,
      expertiseDie,
      minRoll: options.minRoll ?? skill.minRoll,
      proficient: skill.proficient,
      type: 'skillCheck',
      rollMode,
      skill: skillKey,
      situationalMods: options.situationalMods
    });

    return {
      abilityKey, expertiseDie, rollFormula, visibilityMode: options.visibilityMode ?? null
    };
  }

  async #showSkillCheckPrompt(skillKey, rollOptions = {}, dialogOptions = {}) {
    const title = localize(
      'A5E.SkillPromptTitle',
      { name: this.name, skill: localize(CONFIG.A5E.skills[skillKey]) }
    );

    const dialog = new GenericRollDialog(
      this,
      title,
      SkillCheckRollDialog,
      { skillKey },
      rollOptions,
      dialogOptions
    );

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

  /**
   *
   * @param {Object} restOptions
   * @param {Boolean} restOptions.consumeSupply
   * @param {Boolean} restOptions.haven
   * @param {Boolean} restOptions.recoverStrifeAndFatigue
   * @param {'long' | 'short'} restOptions.restType
   * @returns
   */
  async triggerRest(restOptions = {}) {
    let restData;
    if (foundry.utils.isEmpty(restOptions)) {
      const title = localize('A5E.RestConfigurationPrompt', { name: this.name });
      const dialog = new GenericConfigDialog(this, title, RestDialog);
      await dialog.render(true);
      restData = await dialog?.promise;
    } else {
      restData = foundry.utils.mergeObject({
        consumeSupply: false,
        haven: true,
        recoverStrifeAndFatigue: true,
        restType: 'short'
      }, restOptions);
    }

    if (!restData) return;
    const restManger = new RestManager(this, restData);

    await restManger.restoreResources();
  }

  async updateDeathSavingThrowFigures(roll) {
    const { death, fatigue, strife } = this.system.attributes;
    const { success, failure } = death;
    const d20Result = roll.dice[0].total;

    const updates = {
      'system.attributes.death': { success, failure }
    };

    if (d20Result === 1) {
      if (game.settings.get('a5e', '5eStyleDeathSaves')) {
        updates['system.attributes.death'].failure += 2;
      } else {
        updates['system.attributes.death'].failure += 1;
        updates['system.attributes.fatigue'] = fatigue + 1;
        updates['system.attributes.strife'] = strife + 1;
      }
    } else if (d20Result === 20) updates['system.attributes.hp.value'] = 1;
    else if (d20Result < 10) updates['system.attributes.death'].failure += 1;
    else updates['system.attributes.death'].success += 1;

    await this.update(updates);
  }

  async rechargeGenericResource(resource) {
    if (!this.system.resources[resource]) return;

    // eslint-disable-next-line max-len
    const max = getDeterministicBonus(this.system.resources[resource].max, this.getRollData());
    const current = this.system.resources[resource].value;
    const formula = this.system.resources[resource]?.recharge?.formula || '1d6';
    const threshold = this.system.resources[resource]?.recharge?.threshold || 6;
    const updatePath = `system.resources.${resource}.value`;

    // Roll
    const roll = await new Roll(formula, this.getRollData()).evaluate({ async: true });

    // TODO: Make the message prettier
    roll.toMessage();

    if (roll.total >= threshold) await this.update({ [updatePath]: Math.min(max, current + 1) });
  }
}
