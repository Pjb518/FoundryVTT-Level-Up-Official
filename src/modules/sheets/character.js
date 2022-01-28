import ActorSheet5e from './baseActor';

import getExpertiseDieSize from '../utils/getExpertiseDieSize';
import arraysAreEqual from '../utils/arraysAreEqual';

export default class ActorSheet5eCharacter extends ActorSheet5e {
  /**
   * Define default rendering options for the character sheet.
   *
   * @returns {object}
   */
  static get defaultOptions() {
    return mergeObject(super.defaultOptions, {
      classes: ['a5e-sheet', 'a5e-sheet--actor'],
      scrollY: [
        '.a5e-js-attributes-scroll-area',
        '.a5e-js-biography-scroll-area',
        '.a5e-js-features-scroll-area',
        '.a5e-js-inventory-scroll-area',
        '.a5e-js-journal-scroll-area',
        '.a5e-js-spell-scroll-area'
      ],
      resizable: true,
      width: 880,
      height: 700,
      currentTab: 'attributes'
    });
  }

  get template() {
    if (!game.user.isGM && this.actor.limited) return 'systems/a5e/templates/actors/limited-actor-sheet.hbs';
    return 'systems/a5e/templates/actors/character-sheet.hbs';
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
    data.expandedFilterCategories = this.actor.getFlag('a5e', 'expandedFilterCategories') ?? [];

    return data;
  }

  /** @inheritdoc */
  activateListeners(html) {
    // Roll handlers specific to PCs
    html.find('.a5e-js-roll-death-saving-throw').click(this._onRollDeathSavingThrow.bind(this));

    // Configuration handlers specific to PCs
    html.find('.a5e-js-configure-armor-proficiencies').click(this._onConfigureArmorProficiencies.bind(this));
    html.find('.a5e-js-configure-background').click(this._onConfigureBackground.bind(this));
    html.find('.a5e-js-configure-culture').click(this._onConfigureCulture.bind(this));
    html.find('.a5e-js-configure-heritage').click(this._onConfigureHeritage.bind(this));
    html.find('.a5e-js-configure-maneuvers').click(this._onConfigureManeuvers.bind(this));
    html.find('.a5e-js-configure-tool-proficiencies').click(this._onConfigureToolProficiencies.bind(this));
    html.find('.a5e-js-configure-weapon-proficiencies').click(this._onConfigureWeaponProficiencies.bind(this));

    // Item creation handlers specific to PCs
    html.find('.a5e-js-create-maneuver-item').click(this._onCreateManeuverItem.bind(this));

    // Inspiration toggle
    html.find('.a5e-js-toggle-inspiration').click(this._onToggleInspiration.bind(this));

    super.activateListeners(html);
  }

  _filterFeatures(items) {
    let filteredItems = items;
    const activationCostFilters = this.actor.getFlag('a5e', 'featureActivationCostFilters');

    if (activationCostFilters?.inclusive?.length) {
      filteredItems = filteredItems.filter((item) => (
        activationCostFilters.inclusive.some((value) => value === item.data.activation.type)));
    }

    if (activationCostFilters?.exclusive?.length) {
      filteredItems = filteredItems.filter((item) => (
        !activationCostFilters.exclusive.some((value) => value === item.data.activation.type)));
    }

    return filteredItems;
  }

  _filterManeuvers(items) {
    let filteredItems = items;
    const activationCostFilters = this.actor.getFlag('a5e', 'maneuverActivationCostFilters');
    const degreeFilters = this.actor.getFlag('a5e', 'maneuverDegreeFilters');
    const traditionFilters = this.actor.getFlag('a5e', 'maneuverTraditionFilters');

    if (activationCostFilters?.inclusive?.length) {
      filteredItems = filteredItems.filter((item) => (
        activationCostFilters.inclusive.some((value) => value === item.data.activation.type)));
    }

    if (activationCostFilters?.exclusive?.length) {
      filteredItems = filteredItems.filter((item) => (
        !activationCostFilters.exclusive.some((value) => value === item.data.activation.type)));
    }

    if (degreeFilters?.inclusive?.length) {
      filteredItems = filteredItems.filter(
        (item) => degreeFilters.inclusive.includes(item.data.degree.toString())
      );
    }

    if (degreeFilters?.exclusive?.length) {
      filteredItems = filteredItems.filter(
        (item) => !degreeFilters.exclusive.includes(item.data.degree.toString())
      );
    }

    if (traditionFilters?.inclusive?.length) {
      filteredItems = filteredItems.filter(
        (item) => traditionFilters.inclusive.includes(item.data.tradition)
      );
    }

    if (traditionFilters?.exclusive?.length) {
      filteredItems = filteredItems.filter(
        (item) => !traditionFilters.exclusive.includes(item.data.tradition)
      );
    }

    return filteredItems;
  }

  /**
   * Handle clicking the configuration button for selecting armour proficiencies.
   *
   * @param {Event} event  The originating click event.
   * @private
   */
  _onConfigureArmorProficiencies(event) {
    event.preventDefault();
    this.actor.configureArmorProficiencies();
  }

  /**
   * Handle clicking the configuration button for inputting an actor's background.
   *
   * @param {Event} event  The originating click event.
   * @private
   */
  _onConfigureBackground(event) {
    event.preventDefault();
    this.actor.configureBackground();
  }

  /**
   * Handle clicking the configuration button for inputting an actor's culture.
   *
   * @param {Event} event  The originating click event.
   * @private
   */
  _onConfigureCulture(event) {
    event.preventDefault();
    this.actor.configureCulture();
  }

  /**
   * Handle clicking the configuration button for inputting an actor's heritage.
   *
   * @param {Event} event  The originating click event.
   * @private
   */
  _onConfigureHeritage(event) {
    event.preventDefault();
    this.actor.configureHeritage();
  }

  /**
   * Handle clicking the configuration button for maneuvers.
   *
   * @param {Event} event  The originating click event.
   * @private
   */
  _onConfigureManeuvers(event) {
    event.preventDefault();
    this.actor.configureManeuvers();
  }

  /**
   * Handle clicking the configuration button for selecting tool proficiencies.
   *
   * @param {Event} event  The originating click event.
   * @private
   */
  _onConfigureToolProficiencies(event) {
    event.preventDefault();
    this.actor.configureToolProficiencies();
  }

  /**
   * Handle clicking the configuration button for selecting weapon proficiencies.
   *
   * @param {Event} event  The originating click event.
   * @private
   */
  _onConfigureWeaponProficiencies(event) {
    event.preventDefault();
    this.actor.configureWeaponProficiencies();
  }

  /**
   * Handle creating a new object in the actor maneuver list as an Owned Item.
   *
   * @param {Event} event  The originating click event.
   * @returns {Item5e[]}   The newly created item.
   *
   * @async
   * @private
   */
  async _onCreateManeuverItem(event) {
    event.preventDefault();

    const newItems = await this.actor.createEmbeddedDocuments('Item', [{
      name: game.i18n.localize('A5E.ItemNew'),
      type: 'maneuver'
    }]);

    newItems[0].sheet.render(true);

    return newItems;
  }

  _onToggleInspiration(event) {
    event.preventDefault();
    this.actor.toggleInspiration();
  }

  _onRollDeathSavingThrow(event) {
    event.preventDefault();
    this.actor.rollDeathSavingThrow();
  }

  /**
   * @inheritdoc
   */
  async _onToggleFilter(event) {
    const { category, itemType, value } = event.currentTarget.dataset;

    if (itemType === 'maneuver') await this.actor.updateManeuverFilters(category, value);
    else await super._onToggleFilter(event);
  }

  /**
   * @inheritdoc
   */
  async _onResetFilters(event) {
    const { itemType } = event.currentTarget.dataset;

    if (itemType === 'maneuver') await this.actor.resetManeuverFilters();
    else super._onResetFilters(event);
  }

  /**
   * @inheritdoc
   */
  _prepareFilters() {
    const filters = [
      { key: 'featureActivationCost', flag: 'featureActivationCostFilters' },
      { key: 'maneuverActivationCost', flag: 'maneuverActivationCostFilters' },
      { key: 'maneuverDegree', flag: 'maneuverDegreeFilters' },
      { key: 'maneuverTradition', flag: 'maneuverTraditionFilters' }
    ];

    return mergeObject(
      super._prepareFilters(),
      Object.fromEntries(filters.map(({ key, flag }) => (
        [key, this.actor.getFlag('a5e', flag) ?? { inclusive: [], exclusive: [] }]
      )))
    );
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

    itemGroups.features = this._filterFeatures(itemGroups.features);
    itemGroups.inventory = this._prepareObjectLabels(this._filterObjects(itemGroups.inventory));
    itemGroups.maneuvers = this._prepareManeuverLabels(this._filterManeuvers(itemGroups.maneuvers));
    itemGroups.spells = this._prepareSpells(this._filterSpells(itemGroups.spells));

    return itemGroups;
  }

  _prepareManeuverLabels(maneuvers) {
    return maneuvers.map((item) => {
      const inlineLabels = [];

      if (item.data.degree > 0) {
        inlineLabels.push(game.i18n.localize(CONFIG.A5E.maneuverDegrees[item.data.degree]));
        inlineLabels.push(game.i18n.localize(CONFIG.A5E.maneuverTraditions[item.data.tradition]));
      }

      if (item.data.exertionCost > 0) {
        item.showExertionLabel = true;
        item.exertionLabel = game.i18n.format('A5E.ItemExertionLabel', { exertion: item.data.exertionCost });
      }

      item.data.inlineLabels = inlineLabels;

      return item;
    });
  }
}
