import ActorSheet5e from './baseActor';

import getExpertiseDieSize from '../utils/getExpertiseDieSize';
import arraysAreEqual from '../utils/arraysAreEqual';

export default class ActorSheet5eNPC extends ActorSheet5e {
  /**
   * Define default rendering options for the character sheet.
   *
   * @returns {object}
   */
  static get defaultOptions() {
    return mergeObject(super.defaultOptions, {
      classes: ['a5e-sheet', 'a5e-sheet--actor'],
      scrollY: [
        '.a5e-js-core-scroll-area',
        '.a5e-js-notes-scroll-area',
        '.a5e-js-inventory-scroll-area',
        '.a5e-js-spell-scroll-area'
      ],
      resizable: true,
      width: 880,
      height: 700,
      currentTab: 'core'
    });
  }

  get template() {
    if (!game.user.isGM && this.actor.limited) return 'systems/a5e/templates/actors/limited-actor-sheet.hbs';
    return 'systems/a5e/templates/actors/npc-sheet.hbs';
  }

  getData() {
    const data = {
      config: CONFIG.A5E,
      rollData: this.actor.getRollData.bind(this.actor),
      items: {},
      currentTab: this.options.currentTab
    };

    const actorData = this.actor.data.toObject(false);
    data.actor = actorData;
    data.data = actorData.data;

    Object.entries(actorData.data.abilities).forEach(([key, ability]) => {
      ability.label = game.i18n.localize(CONFIG.A5E.abilityAbbreviations[key]);
    });

    Object.entries(actorData.data.skills).forEach(([key, skill]) => {
      skill.label = game.i18n.localize(CONFIG.A5E.skills[key]);
      skill.expertiseDieSize = getExpertiseDieSize(skill.expertiseDice, false);

      skill.specialties = skill.specialties.map((specialty) => {
        const localisationString = CONFIG.A5E.skillSpecialties[key][specialty];
        return localisationString ? game.i18n.localize(localisationString) : specialty;
      }).sort();
    });

    data.movement = Object.entries(actorData.data.attributes.movement).map(([key, speed]) => ({
      name: game.i18n.localize(CONFIG.A5E.movementAbbreviations[key]),
      speed
    })).filter(({ speed }) => speed);

    data.senses = Object.entries(actorData.data.attributes.senses)
      .map(([key, range]) => ({ name: game.i18n.localize(CONFIG.A5E.senses[key]), range }))
      .filter(({ range }) => range);

    data.conditionImmunities = actorData.data.traits.conditionImmunities
      .map((condition) => (
        CONFIG.A5E.conditions[condition]
          ? game.i18n.localize(CONFIG.A5E.conditions[condition])
          : condition))
      .filter((condition) => condition)
      .sort();

    ['damageImmunities', 'damageResistances', 'damageVulnerabilities'].forEach((category) => {
      data[category] = actorData.data.traits[category]
        .map((damageType) => (
          CONFIG.A5E.damageTypes[damageType]
            ? game.i18n.localize(CONFIG.A5E.damageTypes[damageType])
            : damageType))
        .filter((damageType) => damageType)
        .sort();
    });

    // Split weapons into categories.
    const weaponProficiencies = data.data.proficiencies.weapons.reduce(
      (acc, curr) => {
        if (Object.keys(CONFIG.A5E.weaponsPlural.martial).includes(curr)) {
          acc.martial.push(curr);
        } else if (Object.keys(CONFIG.A5E.weaponsPlural.simple).includes(curr)) {
          acc.simple.push(curr);
        } else if (Object.keys(CONFIG.A5E.weaponsPlural.rare).includes(curr)) {
          acc.rare.push(curr);
        } else {
          acc.other.push(curr);
        }

        return acc;
      },
      {
        simple: [],
        martial: [],
        rare: [],
        other: []
      }
    );

    // Replace complete weapon groups with a category name, instead of displaying dozens of tags.
    ['simple', 'martial', 'rare'].forEach((weaponType) => {
      const weaponKeys = Object.keys(CONFIG.A5E.weaponsPlural[weaponType]);

      if (arraysAreEqual(weaponKeys, weaponProficiencies[weaponType])) {
        weaponProficiencies[weaponType] = game.i18n.localize(
          `A5E.Weapons${weaponType[0].toUpperCase() + weaponType.slice(1)}`
        );
      } else {
        weaponProficiencies[weaponType] = weaponProficiencies[weaponType].map((weapon) => (
          game.i18n.localize(CONFIG.A5E.weaponsPlural[weaponType][weapon])
        ));
      }
    });

    const toolProficiencies = data.data.proficiencies.tools.reduce((acc, curr) => {
      let tool;

      /* eslint-disable no-restricted-syntax */
      for (const toolType of ['artisansTools', 'gamingSets', 'musicalInstruments', 'miscellaneous', 'vehicles']) {
        if (CONFIG.A5E.toolsPlural[toolType][curr]) {
          tool = game.i18n.localize(CONFIG.A5E.toolsPlural[toolType][curr]);
          break;
        }
      }

      acc.push(tool || curr);
      return acc;
    }, []);

    data.data.proficiencies.armor = data.data.proficiencies.armor.map((armor) => (
      game.i18n.localize(CONFIG.A5E.armorPlural[armor])
    )).sort();

    data.data.proficiencies.languages = data.data.proficiencies.languages.map((language) => {
      const localisationString = CONFIG.A5E.languages[language];
      return localisationString ? game.i18n.localize(localisationString) : language;
    }).sort();

    data.data.proficiencies.tools = toolProficiencies.sort();
    data.data.proficiencies.weapons = Object.values(weaponProficiencies).flat().sort();

    data.items = this._prepareItems(actorData.items);
    data.sizeCategory = game.i18n.localize(CONFIG.A5E.actorSizes[actorData.data.traits?.size]);

    const hpData = data.data.attributes.hp;
    hpData.low = Math.ceil(hpData.max / 2);

    data.availableSpellLevels = this.actor.getFlag('a5e', 'availableSpellLevels')
      || [...Array(10).keys()].map((x) => x.toString());

    data.showSpellSlots = this.actor.getFlag('a5e', 'showSpellSlots') ?? true;
    data.showSpellPoints = this.actor.getFlag('a5e', 'showSpellPoints') ?? true;
    data.filters = this._prepareFilters();

    data.creatureTypes = actorData.data.details.creatureTypes.map((creatureType) => {
      if (CONFIG.A5E.creatureTypes[creatureType]) {
        return game.i18n.localize(CONFIG.A5E.creatureTypes[creatureType]);
      }

      return creatureType;
    });

    return data;
  }

  /** @inheritdoc */
  activateListeners(html) {
    // Configuration handlers specific to NPCs
    html.find('.a5e-js-configure-creature-types').click(this._onConfigureCreatureTypes.bind(this));

    // Item creation handlers specific to NPCs
    html.find('.a5e-js-create-weapon').click(this._onCreateWeapon.bind(this));

    super.activateListeners(html);
  }

  _onActivateItem(event) {
    event.preventDefault();

    const { id } = event.currentTarget.parentElement.dataset;
    const item = this.actor.items.get(id);

    this.actor.activateItem(item);
  }

  /**
   * Handle clicking the configuration button for selecting creature types.
   *
   * @param {Event} event  The originating click event.
   * @private
   */
  _onConfigureCreatureTypes(event) {
    event.preventDefault();
    this.actor.configureCreatureTypes();
  }

  /**
   * Handle creating a new weapon object in the actor inventory as an Owned Item.
   *
   * @param {Event} event          The originating click event.
   * @returns {Promise<Item5e[]>}  The newly created item.
   * @private
   */
  _onCreateWeapon(event) {
    event.preventDefault();

    return this.actor.createEmbeddedDocuments('Item', [{
      name: game.i18n.localize('A5E.ItemNew'),
      type: 'object',
      'data.objectType': 'weapon'
    }]);
  }

  /**
  * Handle rolling an ability check.
  *
  * @param {Event} event  The originating click event.
  * @private
  */
  _onRollAbilityCheck(event) {
    event.preventDefault();
    const { ability } = event.currentTarget.dataset;
    this.actor.rollAbilityCheck(ability, { event });
  }

  /**
  * Handle rolling an initiative check.
  *
  * @param {Event} event  The originating click event.
  * @private
  */
  _onRollInitiative(event) {
    event.preventDefault();
    this.actor.rollInitiative({ createCombatants: true });
  }

  /**
  * Handle rolling a saving throw.
  *
  * @param {Event} event  The originating click event.
  * @private
  */
  _onRollSavingThrow(event) {
    event.preventDefault();
    const { ability } = event.currentTarget.dataset;
    this.actor.rollSavingThrow(ability, { event });
  }

  /**
  * Handle rolling a skill check.
  *
  * @param {Event} event  The originating click event.
  * @private
  */
  _onRollSkillCheck(event) {
    event.preventDefault();
    const { skill } = event.currentTarget.dataset;
    this.actor.rollSkillCheck(skill, { event });
  }

  _prepareFilters() {
    return {
      itemRarity: this.actor.getFlag('a5e', 'itemRarityFilters') ?? { inclusive: [], exclusive: [] },
      itemMiscellaneous: this.actor.getFlag('a5e', 'miscellaneousItemFilters') ?? { inclusive: [], exclusive: [] },
      spellComponents: this.actor.getFlag('a5e', 'spellComponentFilters') ?? { inclusive: [], exclusive: [] },
      spellSchools: this.actor.getFlag('a5e', 'spellSchoolFilters') ?? { inclusive: [], exclusive: [] },
      spellMiscellaneous: this.actor.getFlag('a5e', 'miscellaneousSpellFilters') ?? { inclusive: [], exclusive: [] }
    };
  }

  _prepareItems(items) {
    const itemGroups = items.sort((a, b) => a.sort - b.sort).reduce((acc, item) => {
      if (item.type === 'feature') acc.features.push(item);
      else if (item.type === 'maneuver') acc.maneuvers.push(item);
      else if (item.type === 'spell') acc.spells.push(item);
      else acc.inventory.push(item);

      return acc;
    }, {
      features: [], inventory: [], maneuvers: [], spells: []
    });

    itemGroups.inventory = this._prepareObjectLabels(this._filterObjects(itemGroups.inventory));
    itemGroups.spells = this._prepareSpells(this._filterSpells(itemGroups.spells));

    return itemGroups;
  }

  _prepareSpells(spells) {
    return spells.reduce((acc, spell) => {
      let { level } = spell.data;

      if (Number.isNaN(level) || typeof level !== 'number') level = 0;
      if (!(acc[level] instanceof Array)) acc[level] = [];

      this._prepareSpellLabels(spell);

      acc[level].push(spell);

      return acc;
    }, {});
  }

  _prepareObjectLabels(items) {
    return items.map((item) => {
      const inlineLabels = [];

      if (item.data.requiresAttunement && item.data.attuned) {
        inlineLabels.push(game.i18n.localize('A5E.Attuned'));
      }

      if (item.data.bulky) inlineLabels.push(game.i18n.localize('A5E.ItemBulky'));
      if (item.data.equipped) inlineLabels.push(game.i18n.localize('A5E.ItemEquipped'));

      item.showQuantity = item.data.quantity && item.data.quantity > 1;
      item.data.inlineLabels = inlineLabels;

      return item;
    });
  }

  _prepareSpellLabels(spell) {
    const inlineLabels = [];
    spell.data.descriptionLabels = {};

    spell.data.descriptionLabels.schools = [
      game.i18n.localize(CONFIG.A5E.spellSchools.primary[spell.data.schools.primary]),
      ...spell.data.schools.secondary.map(
        (school) => game.i18n.localize(CONFIG.A5E.spellSchools.secondary[school])
      )
    ].filter((x) => x).sort();

    const { components } = spell.data;
    spell.data.descriptionLabels.components = [];

    if (components.vocalized) {
      spell.data.descriptionLabels.components.push(game.i18n.localize('A5E.SpellComponentVocalizedAbbr'));
    }

    if (components.seen) {
      spell.data.descriptionLabels.components.push(game.i18n.localize('A5E.SpellComponentSeenAbbr'));
    }

    if (components.material) {
      const componentParts = [game.i18n.localize('A5E.SpellComponentMaterialAbbr')];

      if (spell.data.materials) componentParts.push(`(${spell.data.materials})`);

      spell.data.descriptionLabels.components.push(componentParts.join(' '));
    }

    if (spell.data.concentration) inlineLabels.push(game.i18n.localize('A5E.SpellConcentration'));
    if (spell.data.prepared) inlineLabels.push(game.i18n.localize('A5E.ItemPrepared'));
    if (spell.data.ritual) inlineLabels.push(game.i18n.localize('A5E.SpellRitual'));

    spell.data.inlineLabels = inlineLabels;
  }
}
