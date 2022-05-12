import A5E from '../config';
import Item5e from '../item/entity';
import ReactiveDialog from '../apps/reactiveDialog';

import AbilityDialog from '../../vue/AbilityDialog.vue';
import AbilityScoreConfigDialog from '../../vue/dialogs/AbilityScoreConfigDialog.vue';
import ArmorProficienciesConfigDialog from '../../vue/dialogs/ArmorProficienciesConfigDialog.vue';
import BackgroundConfigDialog from '../../vue/dialogs/BackgroundConfigDialog.vue';
import ConditionImmunitiesConfigDialog from '../../vue/dialogs/ConditionImmunitiesConfigDialog.vue';
import CreatureTypesConfigDialog from '../../vue/dialogs/CreatureTypesConfigDialog.vue';
import CultureConfigDialog from '../../vue/dialogs/CultureConfigDialog.vue';
import DamageIRVConfigDialog from '../../vue/dialogs/DamageIRVConfigDialog.vue';
import DeathSavingThrowDialog from '../../vue/DeathSavingThrowDialog.vue';
import HeritageConfigDialog from '../../vue/dialogs/HeritageConfigDialog.vue';
import HitPointConfigDialog from '../../vue/dialogs/HitPointConfigDialog.vue';
import InitiativeConfigDialog from '../../vue/dialogs/InitiativeConfigDialog.vue';
import LanguagesConfigDialog from '../../vue/dialogs/LanguagesConfigDialog.vue';
import ManeuverTabConfigDialog from '../../vue/dialogs/ManeuverTabConfigDialog.vue';
import MovementConfigDialog from '../../vue/dialogs/MovementConfigDialog.vue';
import RestDialog from '../../vue/RestDialog.vue';
import SensesConfigDialog from '../../vue/dialogs/SensesConfigDialog.vue';
import SizeCategoryConfigDialog from '../../vue/dialogs/SizeCategoryConfigDialog.vue';
import SkillDialog from '../../vue/SkillDialog.vue';
import SkillConfigDialog from '../../vue/dialogs/SkillConfigDialog.vue';
import SpellTabConfigDialog from '../../vue/dialogs/SpellTabConfigDialog.vue';
import ToolProficienciesConfigDialog from '../../vue/ToolProficienciesConfigDialog.vue';
import WeaponProficienciesConfigDialog from '../../vue/WeaponProficienciesConfigDialog.vue';

import calculateManeuverDC from '../utils/calculateManeuverDC';
import calculatePassiveScore from '../utils/calculatePassiveScore';
import calculateSpellDC from '../utils/calculateSpellDC';
import getBaseAbilityMod from '../utils/getBaseAbilityMod';
import getDialogData from '../dice/getDialogData';
import getDeterministicBonus from '../dice/getDeterministicBonus';
import toggleFilter from '../utils/toggleFilter';

export default class Actor5e extends Actor {
  /**
   * @override
   */
  prepareBaseData() {
    const actorType = this.data.type;

    if (actorType === 'character') {
      return this.prepareCharacterData();
    }

    return this.prepareNPCData();
  }

  /**
   * @override
   */
  prepareDerivedData() {
    const actorData = this.data.data;

    // Calculate the base ability modifier for each ability score.
    Object.values(actorData.abilities).forEach((ability) => {
      const baseMod = getBaseAbilityMod(ability.value);

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
        const deterministicBonus = getDeterministicBonus(
          `${ability[key].mod} + ${ability[key].bonus} + ${actorData.bonuses.abilities[key]}`,
          this.getRollData()
        );

        // Fall back to the base ability mod if no bonus could be calculated.
        ability[key].deterministicBonus = deterministicBonus ?? ability[key].mod;
      });
    });

    const { baseMax: baseHP, bonus: bonusHP } = actorData.attributes.hp;
    actorData.attributes.hp.max = baseHP + bonusHP;

    actorData.attributes.maneuverDC = 8
      + actorData.attributes.prof
      + (parseInt(actorData.bonuses.maneuverDC, 10) || 0)
      + Math.max(actorData.abilities.str.check.mod, actorData.abilities.dex.check.mod);

    if (this.type === 'character') {
      actorData.attributes.attunement.current = this.items.reduce((acc, curr) => {
        const { requiresAttunement, attuned } = curr.data.data;
        return (requiresAttunement && attuned) ? acc + 1 : acc;
      }, 0);
    }

    this.prepareSkills();
  }

  prepareCharacterData() {
    const actorData = this.data.data;

    // Calculate the proficiency bonus for the character with a minimum value of 2.
    actorData.attributes.prof = Math.max(2, Math.floor((actorData.details.level + 7) / 4));
  }

  prepareNPCData() {
    const actorData = this.data.data;

    // Calculate the proficiency bonus for the character with a minimum value of 2.
    actorData.attributes.prof = Math.max(2, Math.floor((actorData.details.cr + 7) / 4));
  }

  /** @inheritdoc */
  async _preCreate(data, options, user) {
    await super._preCreate(data, options, user);

    // Player character configuration
    if (this.type === 'character') {
      this.data.token.update({ vision: true, actorLink: true, disposition: 1 });
    }
  }

  /** @inheritdoc */
  async _preUpdate(changed, options, user) {
    await super._preUpdate(changed, options, user);

    // If hp drops below 0, set the value to 0.
    if (foundry.utils.getProperty(changed, 'data.attributes.hp.value') < 0) {
      foundry.utils.setProperty(changed, 'data.attributes.hp.value', 0);
    }

    // If temp hp drops to or below 0, set the value to 0.
    if (foundry.utils.getProperty(changed, 'data.attributes.hp.temp') <= 0) {
      foundry.utils.setProperty(changed, 'data.attributes.hp.temp', '');
    }

    // Reset death save counters
    const isUnconscious = this.data.data.attributes.hp.value === 0;
    const willRegainConsciousness = foundry.utils.getProperty(changed, 'data.attributes.hp.value') > 0;

    if (isUnconscious && willRegainConsciousness) {
      foundry.utils.setProperty(changed, 'data.attributes.death.success', 0);
      foundry.utils.setProperty(changed, 'data.attributes.death.failure', 0);
    }
  }

  /**
   * Given a list of items to add to the Actor.
   *
   * @param {Item5e[]} items         The items being added to the Actor.
   *
   * @returns {Promise<Item5e[]>}
   */
  async addEmbeddedItems(items) {
    if (!items.length) return [];

    return Item5e.createDocuments(
      items.map((item) => item.toObject()),
      { parent: this }
    );
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
    const { value, temp } = this.data.data.attributes.hp;

    if (temp) {
      updates['data.attributes.hp'] = {
        temp: Math.clamped(temp - damage, 0, temp),
        value: Math.clamped(value + temp - damage, 0, value)
      };
    } else {
      updates['data.attributes.hp.value'] = Math.clamped(value - damage, 0, value);
    }

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
    const { value, max, temp } = this.data.data.attributes.hp;

    if (options.temp) {
      if (healing <= temp) {
        ui.notifications.warn('A5E.ActionWarningTempHpNotOverwritten', { localize: true });
        return this;
      }

      updates['data.attributes.hp.temp'] = healing;
    } else {
      updates['data.attributes.hp.value'] = Math.clamped(value + healing, value, max);
    }

    return this.update(updates);
  }

  prepareSkills() {
    const actorData = this.data.data;

    Object.values(actorData.skills).forEach((skill) => {
      skill.mod = skill.proficient ? actorData.attributes.prof : 0;
    });

    Object.values(actorData.skills).forEach((skill) => {
      const { check: globalCheckBonus, skill: globalSkillBonus } = actorData.bonuses.abilities;

      const deterministicBonus = getDeterministicBonus(
        `${skill.mod} + ${skill.bonuses.check} + ${globalSkillBonus || 0} + ${globalCheckBonus || 0}`,
        this.getRollData()
      );

      skill.deterministicBonus = deterministicBonus ?? skill.mod;
      skill.passive = calculatePassiveScore(skill, this.getRollData());
    });
  }

  /** @inheritdoc */
  getRollData() {
    const data = super.getRollData();
    const { abilities } = this.data.data;

    data.prof = this.data.data.attributes.prof || 0;

    // Add a shortcut for abilities.<ability>.check.mod.
    data.abilities = Object.entries(abilities).reduce((acc, [key, ability]) => {
      acc[key] = { ...ability, mod: ability.check.mod };
      return acc;
    }, {});

    // Add a shortcut for ability scores.
    Object.entries(abilities).reduce((acc, [key, ability]) => {
      acc[key] = { ...ability, mod: ability.check.mod };
      return acc;
    }, data);

    data.level = this.data.data.details.level;

    data.spellDC = calculateSpellDC(this.data);
    data.maneuverDC = calculateManeuverDC(this.data);

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
    const { strife, fatigue } = this.data.data.attributes;

    if (!supply) {
      updates['data.attributes.fatigue'] = fatigue + 1;
    } else if (!haven) {
      updates['data.attributes.strife'] = strife === 1 ? 0 : strife;
      updates['data.attributes.fatigue'] = fatigue === 1 ? 0 : fatigue;
    } else {
      updates['data.attributes.strife'] = Math.max(strife - 1, 0);
      updates['data.attributes.fatigue'] = Math.max(fatigue - 1, 0);
    }

    this.update(updates);
  }

  configureAbilityScore(ability) {
    const dialogTitle = game.i18n.format(
      'A5E.AbilityScoreConfigurationPrompt',
      { name: this.name, ability: game.i18n.localize(CONFIG.A5E.abilities[ability]) }
    );

    const dialog = new ReactiveDialog(AbilityScoreConfigDialog, {
      title: dialogTitle, props: { actor: this, ability, isSave: false }
    });

    dialog.render(true);
  }

  configureArmorProficiencies() {
    const dialogTitle = game.i18n.format('A5E.ArmorProficienciesConfigurationPrompt', { name: this.name });

    const dialog = new ReactiveDialog(ArmorProficienciesConfigDialog, {
      title: dialogTitle, props: { actor: this }
    });

    dialog.render(true);
  }

  configureBackground() {
    const dialogTitle = game.i18n.format('A5E.BackgroundConfigurationPrompt', { name: this.name });

    const dialog = new ReactiveDialog(BackgroundConfigDialog, {
      title: dialogTitle, props: { actor: this }
    });

    dialog.render(true);
  }

  configureConditionImmunities() {
    const dialogTitle = game.i18n.format('A5E.ConditionImmunitiesConfigurationPrompt', { name: this.name });

    const dialog = new ReactiveDialog(ConditionImmunitiesConfigDialog, {
      title: dialogTitle, props: { actor: this }
    });

    dialog.render(true);
  }

  configureCreatureTypes() {
    const dialogTitle = game.i18n.format('A5E.CreatureTypesConfigurationPrompt', { name: this.name });

    const dialog = new ReactiveDialog(CreatureTypesConfigDialog, {
      title: dialogTitle, props: { actor: this }
    });

    dialog.render(true);
  }

  configureCulture() {
    const dialogTitle = game.i18n.format('A5E.CultureConfigurationPrompt', { name: this.name });

    const dialog = new ReactiveDialog(CultureConfigDialog, {
      title: dialogTitle, props: { actor: this }
    });

    dialog.render(true);
  }

  configureDamageImmunities() {
    const dialogTitle = game.i18n.format('A5E.DamageImmunitiesConfigurationPrompt', { name: this.name });

    const dialog = new ReactiveDialog(DamageIRVConfigDialog, {
      title: dialogTitle, props: { actor: this, updatePath: 'damageImmunities' }
    });

    dialog.render(true);
  }

  configureDamageResistances() {
    const dialogTitle = game.i18n.format('A5E.DamageResistancesConfigurationPrompt', { name: this.name });

    const dialog = new ReactiveDialog(DamageIRVConfigDialog, {
      title: dialogTitle, props: { actor: this, updatePath: 'damageResistances' }
    });

    dialog.render(true);
  }

  configureDamageVulnerabilities() {
    const dialogTitle = game.i18n.format('A5E.DamageVulnerabilitiesConfigurationPrompt', { name: this.name });

    const dialog = new ReactiveDialog(DamageIRVConfigDialog, {
      title: dialogTitle, props: { actor: this, updatePath: 'damageVulnerabilities' }
    });

    dialog.render(true);
  }

  configureHealth() {
    const dialogTitle = game.i18n.format('A5E.HitPointsConfigurationPrompt', { name: this.name });

    const dialog = new ReactiveDialog(HitPointConfigDialog, {
      title: dialogTitle, props: { actor: this }
    });

    dialog.render(true);
  }

  configureHeritage() {
    const dialogTitle = game.i18n.format('A5E.HeritageConfigurationPrompt', { name: this.name });

    const dialog = new ReactiveDialog(HeritageConfigDialog, {
      title: dialogTitle, props: { actor: this }
    });

    dialog.render(true);
  }

  configureInitiative() {
    const dialogTitle = game.i18n.format('A5E.InitiativeConfigurationPrompt', { name: this.name });

    const dialog = new ReactiveDialog(InitiativeConfigDialog, {
      title: dialogTitle, props: { actor: this }
    });

    dialog.render(true);
  }

  configureLanguages() {
    const dialogTitle = game.i18n.format('A5E.LanguagesConfigurationPrompt', { name: this.name });

    const dialog = new ReactiveDialog(LanguagesConfigDialog, {
      title: dialogTitle, props: { actor: this }
    });

    dialog.render(true);
  }

  configureManeuvers() {
    const dialogTitle = game.i18n.format('A5E.ManeuverConfigurationPrompt', { name: this.name });

    const dialog = new ReactiveDialog(ManeuverTabConfigDialog, {
      title: dialogTitle, props: { actor: this }
    });

    dialog.render(true);
  }

  configureMovement() {
    const dialogTitle = game.i18n.format('A5E.MovementConfigurationPrompt', { name: this.name });

    const dialog = new ReactiveDialog(MovementConfigDialog, {
      title: dialogTitle, props: { actor: this }
    });

    dialog.render(true);
  }

  configureSenses() {
    const dialogTitle = game.i18n.format('A5E.SensesConfigurationPrompt', { name: this.name });

    const dialog = new ReactiveDialog(SensesConfigDialog, {
      title: dialogTitle, props: { actor: this }
    });

    dialog.render(true);
  }

  configureSizeCategory() {
    const dialogTitle = game.i18n.format('A5E.SizeCategoryConfigurationPrompt', { name: this.name });

    const dialog = new ReactiveDialog(SizeCategoryConfigDialog, {
      title: dialogTitle, props: { actor: this }
    });

    dialog.render(true);
  }

  configureSkill(skill) {
    const dialogTitle = game.i18n.format(
      'A5E.SkillConfigurationPrompt',
      { name: this.name, skill: game.i18n.localize(CONFIG.A5E.skills[skill]) }
    );

    const dialog = new ReactiveDialog(SkillConfigDialog, {
      title: dialogTitle, props: { actor: this, skill }
    });

    dialog.render(true);
  }

  configureSpellTab() {
    const dialogTitle = game.i18n.format(
      'A5E.SpellTabConfigurationPrompt',
      { name: this.name }
    );

    const dialog = new ReactiveDialog(SpellTabConfigDialog, {
      title: dialogTitle, props: { actor: this }
    });

    dialog.render(true);
  }

  configureToolProficiencies() {
    const dialogTitle = game.i18n.format('A5E.ToolProficienciesConfigurationPrompt', { name: this.name });

    const dialog = new ReactiveDialog(ToolProficienciesConfigDialog, {
      title: dialogTitle, props: { actor: this }
    });

    dialog.render(true);
  }

  configureWeaponProficiencies() {
    const dialogTitle = game.i18n.format('A5E.WeaponProficienciesConfigurationPrompt', { name: this.name });

    const dialog = new ReactiveDialog(WeaponProficienciesConfigDialog, {
      title: dialogTitle, props: { actor: this }
    });

    dialog.render(true);
  }

  async constructItemCard(data) {
    const chatData = {
      user: game.user?.id,
      speaker: ChatMessage.getSpeaker({ actor: this }),
      type: CONST.CHAT_MESSAGE_TYPES.OTHER,
      content: await renderTemplate(
        'systems/a5e/templates/chat/item-card.hbs',
        {
          config: CONFIG.A5E,
          title: data.title,
          img: data.img,
          attack: data.attack,
          description: data.description,
          damage: data.damage,
          healing: data.healing,
          abilityCheck: data.abilityCheck,
          savingThrow: data.savingThrow,
          hasAttack: data.actionOptions?.includes('attack'),
          hasDamage: data.actionOptions?.includes('damage'),
          hasHealing: data.actionOptions?.includes('healing'),
          hasDescription: data.description?.toString().trim(),
          hasAbilityCheck: data.actionOptions?.includes('abilityCheck'),
          hasSavingThrow: data.actionOptions?.includes('savingThrow'),
          isCrit: data.isCrit,
          isFumble: data.isFumble
        }
      )
    };

    if (data.attack?.roll) {
      chatData.type = CONST.CHAT_MESSAGE_TYPES.ROLL;
      chatData.sound = CONFIG.sounds.dice;
      chatData.roll = data.attack.roll;
    }

    ChatMessage.create(chatData);

    if (data.damage?.length) {
      data.damage.forEach((damageSource) => {
        game.dice3d?.showForRoll(
          damageSource.roll, game.user, false, null, false, null, chatData.speaker
        );
      });
    }

    if (data.healing?.length) {
      data.healing.forEach((healingSource) => {
        game.dice3d?.showForRoll(
          healingSource.roll, game.user, false, null, false, null, chatData.speaker
        );
      });
    }
  }

  async modifyTokenAttribute(attribute, value, isDelta, isBar) {
    if (attribute === 'attributes.hp') {
      const hp = getProperty(this.data.data, attribute);
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
    const { baseMax } = this.data.data.attributes.hp;

    this.update({
      'data.attributes.hp': {
        bonus: 0,
        value: baseMax,
        temp: 0
      }
    });
  }

  async resetFilters(tab) {
    if (tab === 'features') await this.resetFeatureFilters();
    else if (tab === 'maneuvers') await this.resetManeuverFilters();
    else if (tab === 'inventory') await this.resetObjectFilters();
    else if (tab === 'spells') await this.resetSpellFilters();
  }

  async resetFeatureFilters() {
    await Promise.all([
      this.setFlag('a5e', 'featureActivationCostFilters', { inclusive: [], exclusive: [] })
    ]);
  }

  async resetManeuverFilters() {
    await Promise.all([
      this.setFlag('a5e', 'maneuverActivationCostFilters', { inclusive: [], exclusive: [] }),
      this.setFlag('a5e', 'maneuverDegreeFilters', { inclusive: [], exclusive: [] }),
      this.setFlag('a5e', 'maneuverTraditionFilters', { inclusive: [], exclusive: [] })
    ]);
  }

  async resetObjectFilters() {
    await Promise.all([
      this.setFlag('a5e', 'itemActivationCostFilters', { inclusive: [], exclusive: [] }),
      this.setFlag('a5e', 'itemRarityFilters', { inclusive: [], exclusive: [] }),
      this.setFlag('a5e', 'miscellaneousItemFilters', { inclusive: [], exclusive: [] })
    ]);
  }

  async resetSpellFilters() {
    await Promise.all([
      this.setFlag('a5e', 'spellActivationCostFilters', { inclusive: [], exclusive: [] }),
      this.setFlag('a5e', 'spellComponentFilters', { inclusive: [], exclusive: [] }),
      this.setFlag('a5e', 'spellSchoolFilters', { inclusive: [], exclusive: [] }),
      this.setFlag('a5e', 'miscellaneousSpellFilters', { inclusive: [], exclusive: [] })
    ]);
  }

  async restoreExertion() {
    const { exertion } = this.data.data.attributes;

    if (!exertion?.recoverOnRest) return;

    await this.update({
      'data.attributes.exertion.current': exertion.max
    });
  }

  async restoreHitDice() {
    const { hitDice } = this.data.data.attributes;
    const updates = {};

    const expendedHitDice = Object.entries(hitDice).reduce((acc, [die, { current, total }]) => {
      acc[die] = Math.max(total - current, 0);
      return acc;
    }, {});

    const expendedHitDiceQuantity = Object.values(expendedHitDice).reduce(
      (count, curr) => count + curr, 0
    );

    const totalHitDiceQuantity = Object.values(hitDice).reduce(
      (count, { total: curr }) => count + curr, 0
    );

    const quantityToRecover = Math.floor(totalHitDiceQuantity / 2);

    if (quantityToRecover >= expendedHitDiceQuantity) {
      updates['data.attributes.hitDice'] = {
        'd6.current': hitDice.d6.total,
        'd8.current': hitDice.d8.total,
        'd10.current': hitDice.d10.total,
        'd12.current': hitDice.d12.total
      };
    } else {
      // TODO: Clean up this implementation. Ewwww.
      for (let i = 0; i < quantityToRecover; i += 1) {
        if (expendedHitDice.d12 > 0) {
          if (!updates['data.attributes.hitDice.d12.current']) {
            updates['data.attributes.hitDice.d12.current'] = 1;
          } else {
            updates['data.attributes.hitDice.d12.current'] += 1;
          }

          expendedHitDice.d12 -= 1;
        } else if (expendedHitDice.d10 > 0) {
          if (!updates['data.attributes.hitDice.d10.current']) {
            updates['data.attributes.hitDice.d10.current'] = 1;
          } else {
            updates['data.attributes.hitDice.d10.current'] += 1;
          }

          expendedHitDice.d10 -= 1;
        } else if (expendedHitDice.d8 > 0) {
          if (!updates['data.attributes.hitDice.d8.current']) {
            updates['data.attributes.hitDice.d8.current'] = 1;
          } else {
            updates['data.attributes.hitDice.d8.current'] += 1;
          }

          expendedHitDice.d8 -= 1;
        } else {
          if (!updates['data.attributes.hitDice.d6.current']) {
            updates['data.attributes.hitDice.d6.current'] = 1;
          } else {
            updates['data.attributes.hitDice.d6.current'] += 1;
          }

          expendedHitDice.d6 -= 1;
        }
      }
    }

    await this.update(updates);
  }

  async restoreItemUses() {
    const items = Array.from(this.items);

    items.forEach(async (item) => {
      const { uses } = item.data.data;

      if (['shortRest', 'longRest'].includes(uses.per)) {
        if (uses.max) {
          await item.update({ 'data.uses.value': uses.max });
        }
      }
    });
  }

  async restoreSpellResources(restType) {
    const { spellResources } = this.data.data;

    const updates = {
      'data.spellResources.points.current': Math.max(spellResources.points.max, 0)
    };

    if (restType === 'long') {
      Object.entries(spellResources.slots).forEach(([level, { max }]) => {
        updates[`data.spellResources.slots.${level}.current`] = Math.max(max, 0);
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
   * @param {string} ability A key that can be used to reference a given ability score.
   */
  async rollAbilityCheck(ability, options = {}) {
    const dialogTitle = game.i18n.format(
      'A5E.AbilityCheckPromptTitle',
      { name: this.name, ability: game.i18n.localize(CONFIG.A5E.abilities[ability]) }
    );

    const checkData = await getDialogData(AbilityDialog, {
      title: dialogTitle,
      props: {
        actor: this, ability, isSave: false, rollMode: options.rollMode
      }
    });

    if (checkData === null) return;

    const { formula } = checkData;
    const roll = await new CONFIG.Dice.D20Roll(formula).roll({ async: true });

    const chatData = {
      user: game.user?.id,
      speaker: ChatMessage.getSpeaker({ actor: this }),
      type: CONST.CHAT_MESSAGE_TYPES.ROLL,
      sound: CONFIG.sounds.dice,
      roll,
      content: await renderTemplate(
        'systems/a5e/templates/chat/ability-check.hbs',
        {
          title: game.i18n.format(
            'A5E.AbilityCheckSpecific',
            { ability: game.i18n.localize(A5E.abilities[ability]) }
          ),
          img: this.img,
          formula: roll.formula,
          tooltip: await roll.getTooltip(),
          total: roll.total
        }
      )
    };

    ChatMessage.create(chatData);
  }

  async rollDeathSavingThrow() {
    const dialogTitle = game.i18n.format(
      'A5E.DeathSavingThrowPromptTitle',
      { name: this.name }
    );

    const saveData = await getDialogData(DeathSavingThrowDialog, {
      title: dialogTitle, props: { actor: this }
    });

    if (saveData === null) return;

    const roll = await new CONFIG.Dice.D20Roll(saveData.formula).roll({ async: true });

    const chatData = {
      user: game.user?.id,
      speaker: ChatMessage.getSpeaker({ actor: this }),
      type: CONST.CHAT_MESSAGE_TYPES.ROLL,
      sound: CONFIG.sounds.dice,
      roll,
      content: await renderTemplate(
        'systems/a5e/templates/chat/ability-check.hbs',
        {
          title: game.i18n.localize('A5E.DeathSavingThrow'),
          img: this.img,
          formula: roll.formula,
          tooltip: await roll.getTooltip(),
          total: roll.total
        }
      )
    };

    ChatMessage.create(chatData);
    this.updateDeathSavingThrowFigures(roll);
  }

  // TODO: Refactor this to use its own card constructor
  async rollHitDice(dieSize, quantity = 1) {
    const actorData = this.data.data;
    const { attributes } = actorData;

    if (attributes.hitDice[dieSize].current - quantity < 0) return;

    const title = game.i18n.format('A5E.HitDiceChatHeader', { dieSize: dieSize.toUpperCase() });

    const conMod = parseInt(actorData.abilities.con.check.mod, 10);
    const formula = `${quantity}${dieSize} + ${quantity * conMod}`;

    const roll = new CONFIG.Dice.DamageRoll(formula);
    await roll.evaluate({ async: true });
    const tooltip = await roll.getTooltip();

    const data = {
      title,
      img: this.img,
      attack: null,
      healing: [{ healingType: 'healing', roll, tooltip }],
      actionOptions: ['healing'],
      isCrit: false,
      isFumble: false
    };

    const hpDelta = Math.max(roll.total, 0);
    const maxHp = attributes.hp.baseMax + attributes.hp.bonus;

    this.constructItemCard(data);

    this.update({
      'data.attributes': {
        [`hitDice.${dieSize}.current`]: attributes.hitDice[dieSize].current - quantity,
        'hp.value': Math.min(attributes.hp.value + hpDelta, maxHp)
      }
    });
  }

  async rollSavingThrow(ability, options = {}) {
    const dialogTitle = game.i18n.format(
      'A5E.SavingThrowPromptTitle',
      { name: this.name, ability: game.i18n.localize(CONFIG.A5E.abilities[ability]) }
    );

    const checkData = await getDialogData(AbilityDialog, {
      title: dialogTitle,
      props: {
        actor: this, ability, isSave: true, rollMode: options.rollMode
      }
    });

    if (checkData === null) return;

    const { formula } = checkData;
    const roll = await new CONFIG.Dice.D20Roll(formula).roll({ async: true });

    const chatData = {
      user: game.user?.id,
      speaker: ChatMessage.getSpeaker({ actor: this }),
      type: CONST.CHAT_MESSAGE_TYPES.ROLL,
      sound: CONFIG.sounds.dice,
      roll,
      content: await renderTemplate(
        'systems/a5e/templates/chat/ability-check.hbs',
        {
          title: game.i18n.format(
            'A5E.SavingThrowSpecific',
            { ability: game.i18n.localize(A5E.abilities[ability]) }
          ),
          img: this.img,
          formula: roll.formula,
          tooltip: await roll.getTooltip(),
          total: roll.total
        }
      )
    };

    ChatMessage.create(chatData);
  }

  /**
   * Rolls a skill check for a given skill. A dialog is presented to the user so that they can
   * perform additional configuration, such as choosing an ability score for the check.
   *
   * @async
   * @method
   * @param {string} skill A key that can be used to reference a given skill.
   *
   * @returns {Promise<undefined>}
   */
  async rollSkillCheck(skill, options = {}) {
    const dialogTitle = game.i18n.format(
      'A5E.SkillPromptTitle',
      { name: this.name, skill: game.i18n.localize(CONFIG.A5E.skills[skill]) }
    );

    const skillData = await getDialogData(SkillDialog, {
      title: dialogTitle, props: { actor: this, skill, rollMode: options.rollMode }
    });

    if (!skillData) return;

    const { formula, ability } = skillData;
    const roll = await new CONFIG.Dice.D20Roll(formula).roll({ async: true });

    const chatData = {
      user: game.user?.id,
      speaker: ChatMessage.getSpeaker({ actor: this }),
      type: CONST.CHAT_MESSAGE_TYPES.ROLL,
      sound: CONFIG.sounds.dice,
      roll,
      content: await renderTemplate(
        'systems/a5e/templates/chat/ability-check.hbs',
        {
          title: game.i18n.format('A5E.SkillCheck', { skill: game.i18n.localize(A5E.skills[skill]) }),
          img: this.img,
          ability: game.i18n.localize(CONFIG.A5E.abilityAbbreviations[ability]),
          formula: roll.formula,
          tooltip: await roll.getTooltip(),
          total: roll.total
        }
      )
    };

    ChatMessage.create(chatData);
  }

  toggleElite() {
    this.update({ 'data.details.elite': !this.data.data.details.elite });
  }

  toggleInspiration() {
    this.update({ 'data.attributes.inspiration': !this.data.data.attributes.inspiration });
  }

  async triggerRest() {
    const dialogTitle = game.i18n.format('A5E.RestConfigurationPrompt', { name: this.name });

    const restData = await getDialogData(RestDialog, {
      title: dialogTitle, props: { actor: this }
    });

    if (!restData) return;

    const { haven, restType, supply } = restData;

    if (restType === 'long') {
      await this.resetHitPoints();
      await this.restoreHitDice();
      await this.adjustTrackedConditions(haven, supply);
    }

    await this.restoreExertion();
    await this.restoreItemUses();
    await this.restoreSpellResources(restType);
  }

  async updateDeathSavingThrowFigures(roll) {
    const { success, failure } = this.data.data.attributes.death;
    const d20Result = roll.dice[0].total;

    const updates = {
      'data.attributes.death': { success, failure }
    };

    if (d20Result === 1) updates['data.attributes.death'].failure += 2;
    else if (d20Result === 20) updates['data.attributes.hp.value'] = 1;
    else if (d20Result < 10) updates['data.attributes.death'].failure += 1;
    else updates['data.attributes.death'].success += 1;

    await this.update(updates);
  }

  async updateFilters(filterKey, filterValue) {
    const filter = this.getFlag('a5e', filterKey) ?? {};
    const [inclusiveFilters, exclusiveFilters] = toggleFilter(filter, filterValue);

    await this.setFlag(
      'a5e',
      filterKey,
      { inclusive: inclusiveFilters, exclusive: exclusiveFilters }
    );
  }
}
