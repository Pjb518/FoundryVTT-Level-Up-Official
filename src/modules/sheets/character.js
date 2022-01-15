import getExpertiseDieSize from '../utils/getExpertiseDieSize';
import arraysAreEqual from '../utils/arraysAreEqual';

export default class ActorSheet5eCharacter extends ActorSheet {
  /**
   * Define default rendering options for the character sheet.
   *
   * @returns {object}
   */
  static get defaultOptions() {
    return mergeObject(super.defaultOptions, {
      classes: ['a5e-sheet'],
      scrollY: [
        '.a5e-js-attributes-scroll-area',
        '.a5e-js-biography-scroll-area',
        '.a5e-js-features-scroll-area',
        '.a5e-js-inventory-scroll-area',
        '.a5e-js-journal-scroll-area',
        '.a5e-js-spell-scroll-area'
      ],
      resizable: false,
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

    data.showSpellSlots = this.actor.getFlag('a5e', 'showSpellSlots');
    data.showSpellPoints = this.actor.getFlag('a5e', 'showSpellPoints');
    data.filters = this._prepareFilters();

    return data;
  }

  /** @inheritdoc */
  activateListeners(html) {
    // Listener for a custom tab handler
    html.find('.a5e-js-sheet-tab').click(this._onClickTab.bind(this));

    // Roll handlers
    html.find('.a5e-js-roll-ability-check').click(this._onRollAbilityCheck.bind(this));
    html.find('.a5e-js-roll-death-saving-throw').click(this._onRollDeathSavingThrow.bind(this));
    html.find('.a5e-js-roll-initiative').click(this._onRollInitiative.bind(this));
    html.find('.a5e-js-roll-saving-throw').click(this._onRollSavingThrow.bind(this));
    html.find('.a5e-js-roll-skill-check').click(this._onRollSkillCheck.bind(this));
    html.find('.a5e-js-activate-item').click(this._onActivateItem.bind(this));
    html.find('.a5e-js-trigger-rest').click(this._onTriggerRest.bind(this));

    // Configuration handlers
    html.find('.a5e-js-configure-ability-score').click(this._onConfigureAbilityScore.bind(this));
    html.find('.a5e-js-configure-armor-proficiencies').click(this._onConfigureArmorProficiencies.bind(this));
    html.find('.a5e-js-configure-background').click(this._onConfigureBackground.bind(this));
    html.find('.a5e-js-configure-condition-immunities').click(this._onConfigureConditionImmunities.bind(this));
    html.find('.a5e-js-configure-culture').click(this._onConfigureCulture.bind(this));
    html.find('.a5e-js-configure-damage-immunities').click(this._onConfigureDamageImmunities.bind(this));
    html.find('.a5e-js-configure-damage-resistances').click(this._onConfigureDamageResistances.bind(this));
    html.find('.a5e-js-configure-damage-vulnerabilities').click(this._onConfigureDamageVulnerabilities.bind(this));
    html.find('.a5e-js-configure-health').click(this._onConfigureHealth.bind(this));
    html.find('.a5e-js-configure-heritage').click(this._onConfigureHeritage.bind(this));
    html.find('.a5e-js-configure-initiative').click(this._onConfigureInitiative.bind(this));
    html.find('.a5e-js-configure-languages').click(this._onConfigureLanguages.bind(this));
    html.find('.a5e-js-configure-maneuvers').click(this._onConfigureManeuvers.bind(this));
    html.find('.a5e-js-configure-movement').click(this._onConfigureMovement.bind(this));
    html.find('.a5e-js-configure-senses').click(this._onConfigureSenses.bind(this));
    html.find('.a5e-js-configure-size-category').click(this._onConfigureSizeCategory.bind(this));
    html.find('.a5e-js-configure-skill').click(this._onConfigureSkill.bind(this));
    html.find('.a5e-js-configure-spell-tab').click(this._onConfigureSpellTab.bind(this));
    html.find('.a5e-js-configure-tools').click(this._onConfigureToolProficiencies.bind(this));
    html.find('.a5e-js-configure-weapon-proficiencies').click(this._onConfigureWeaponProficiencies.bind(this));

    // Context menu handlers
    html.find('.a5e-js-item').mouseup(this._onClickItem.bind(this));
    html.find('.a5e-js-delete-item').click(this._onDeleteItem.bind(this));
    html.find('.a5e-js-edit-item').click(this._onEditItem.bind(this));
    html.find('.a5e-js-equip-item').click(this._onToggleEquip.bind(this));
    html.find('.a5e-js-prepare-spell').click(this._onToggleSpellPreparation.bind(this));

    $(document).mouseup((event) => {
      if ($(event.target).hasClass('a5e-context-menu__option')) return;

      if (event.which === 1) {
        $(document).find('.a5e-context-menu').removeClass('a5e-context-menu--visible');
      }
    });

    // Strife and fatigue track handlers
    html.find('.a5e-js-track').hover(this._onToggleTrackVisibility.bind(this));
    html.find('.a5e-js-track-item').click(this._onClickTrackItem.bind(this));

    // Item creation handlers
    html.find('.a5e-js-create-feature-item').click(this._onCreateFeatureItem.bind(this));
    html.find('.a5e-js-create-inventory-item').click(this._onCreateInventoryItem.bind(this));
    html.find('.a5e-js-create-maneuver-item').click(this._onCreateManeuverItem.bind(this));
    html.find('.a5e-js-create-spell-item').click(this._onCreateSpellItem.bind(this));

    // Inspiration toggle
    html.find('.a5e-js-toggle-inspiration').click(this._onToggleInspiration.bind(this));

    // Drag and drop handlers
    html.find('.a5e-js-item').on('dragstart', (event) => this._onDragStart.call(this, event.originalEvent));

    // Filter handlers
    html.find('.a5e-js-toggle-filter').click(this._onToggleFilter.bind(this));
    html.find('.a5e-js-reset-filters').click(this._onResetFilters.bind(this));

    super.activateListeners(html);
  }

  /**
   * Implements custom tab switching logic for the main sheet body.
   *
   * @param {string} group   The name of the tab group.
   * @param {string} target  The name of the requested sheet page.
   */
  changePage(group, target) {
    const sheet = $(`[data-appid=${this.appId}]`);

    // Mark the clicked tab as the active tab.
    sheet.find('.a5e-js-sheet-tab').removeClass('a5e-sheet-tabs__tab--active');
    sheet.find(`.a5e-js-sheet-tab[data-tab='${target}']`).addClass('a5e-sheet-tabs__tab--active');

    // Hide all of the sheet pages.
    const pageGroup = sheet.find(`.a5e-js-sheet-page[data-group='${group}']`);
    pageGroup.addClass('a5e-sheet__tab-content--hidden');

    // Remove the hidden modifier from the target page.
    const page = sheet.find(`.a5e-js-sheet-page[data-group='${group}'][data-tab='${target}']`);
    page.removeClass('a5e-sheet__tab-content--hidden');

    this.options.currentTab = target;
  }

  _filterManeuvers(items) {
    let filteredItems = items;
    const degreeFilters = this.actor.getFlag('a5e', 'maneuverDegreeFilters');
    const traditionFilters = this.actor.getFlag('a5e', 'maneuverTraditionFilters');

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

  _filterObjects(items) {
    let filteredItems = items;
    const rarityFilters = this.actor.getFlag('a5e', 'itemRarityFilters');
    const miscellaneousFilters = this.actor.getFlag('a5e', 'miscellaneousItemFilters');

    if (rarityFilters?.inclusive?.length) {
      filteredItems = filteredItems.filter(
        (item) => rarityFilters.inclusive.includes(item.data.rarity)
      );
    }

    if (rarityFilters?.exclusive?.length) {
      filteredItems = filteredItems.filter(
        (item) => !rarityFilters.exclusive.includes(item.data.rarity)
      );
    }

    if (miscellaneousFilters?.inclusive?.length) {
      filteredItems = filteredItems.filter(
        (item) => miscellaneousFilters.inclusive.some((property) => item.data[property])
      );
    }

    if (miscellaneousFilters?.exclusive?.length) {
      filteredItems = filteredItems.filter(
        (item) => !miscellaneousFilters.exclusive.some((property) => item.data[property])
      );
    }

    return filteredItems;
  }

  _filterSpells(items) {
    let filteredItems = items;
    const componentFilters = this.actor.getFlag('a5e', 'spellComponentFilters');
    const schoolFilters = this.actor.getFlag('a5e', 'spellSchoolFilters');

    if (componentFilters?.inclusive?.length) {
      filteredItems = filteredItems.filter((item) => {
        const { components } = item.data;

        if (componentFilters.inclusive.includes('vocalized')) return components.vocalized;
        if (componentFilters.inclusive.includes('seen')) return components.seen;
        if (componentFilters.inclusive.includes('material')) return components.material;
        if (componentFilters.inclusive.includes('concentration')) return item.data.concentration;
        if (componentFilters.inclusive.includes('ritual')) return item.data.ritual;

        return false;
      });
    }

    if (componentFilters?.exclusive?.length) {
      filteredItems = filteredItems.filter((item) => {
        const { components } = item.data;

        if (componentFilters.exclusive.includes('vocalized')) return !components.vocalized;
        if (componentFilters.exclusive.includes('seen')) return !components.seen;
        if (componentFilters.exclusive.includes('material')) return !components.material;
        if (componentFilters.exclusive.includes('concentration')) return !item.data.concentration;
        if (componentFilters.exclusive.includes('ritual')) return !item.data.ritual;

        return true;
      });
    }

    if (schoolFilters?.inclusive?.length) {
      filteredItems = filteredItems.filter(
        (item) => schoolFilters.inclusive.includes(item.data.schools.primary)
      );
    }

    if (schoolFilters?.exclusive?.length) {
      filteredItems = filteredItems.filter(
        (item) => !schoolFilters.exclusive.includes(item.data.schools.primary)
      );
    }

    return filteredItems;
  }

  _onActivateItem(event) {
    event.preventDefault();

    const { id } = event.currentTarget.parentElement.dataset;
    const item = this.actor.items.get(id);

    this.actor.activateItem(item);
  }

  /**
   * Handle clicking one of the main sheet tabs.
   *
   * @param {Event} event The originating click event.
   */
  _onClickTab(event) {
    event.preventDefault();

    const { group } = event.currentTarget.parentElement.dataset;
    const { tab } = event.currentTarget.dataset;

    this.changePage(group, tab);
  }

  _onClickItem(event) {
    event.preventDefault();
    const item = event.currentTarget;

    if (event.which === 1) {
      const ignoreTarget = $(event.target).hasClass('a5e-item-list__item-details')
        || $(event.target).hasClass('a5e-context-menu')
        || $(event.target).hasClass('a5e-context-menu__option')
        || $(event.target).hasClass('a5e-js-activate-item')
        || $(event.target).closest('.a5e-item-list__item-details').length;

      if (ignoreTarget) return;

      const expanded = $(item).find('.a5e-item-list__item-details--visible').length;

      $('.a5e-js-item')
        .find('.a5e-item-list__item-details')
        .removeClass('a5e-item-list__item-details--visible');

      if (!expanded) {
        $(item)
          .find('.a5e-item-list__item-details')
          .addClass('a5e-item-list__item-details--visible');
      }
    } else if (event.which === 3) {
      $('.a5e-js-item')
        .find('.a5e-context-menu')
        .removeClass('a5e-context-menu--visible');

      const mouseX = event.clientX;
      const mouseY = event.clientY;

      const itemTop = $(item).offset().top;
      const itemLeft = $(item).offset().left;

      let contextTop = mouseY - itemTop + 1;
      let contextLeft = mouseX - itemLeft + 1;
      const contextWidth = $(item).find('.a5e-context-menu').width();
      const contextHeight = $(item).find('.a5e-context-menu').height();
      const contextRightBound = mouseX + contextWidth;
      const contextTopBound = mouseY - (2 * contextHeight);

      const itemsList = $(item).closest('.a5e-item-list');
      const itemsListRightBound = itemsList.offset().left + itemsList.width() - 17;
      const itemsListTopBound = itemsList.offset().top;

      if (contextRightBound > itemsListRightBound) {
        const rightDiff = itemsListRightBound - contextRightBound;
        contextLeft += rightDiff;
      }

      if (contextTopBound > itemsListTopBound) {
        contextTop -= (2 * contextHeight);
      }

      $(item)
        .find('.a5e-context-menu')
        .addClass('a5e-context-menu--visible')
        .css({ top: `${contextTop}px`, left: `${contextLeft}px` });
    }
  }

  _onClickTrackItem(event) {
    event.preventDefault();

    const updates = {};
    const { degree } = event.currentTarget.dataset;
    const { track } = $(event.currentTarget).closest('.a5e-js-track')[0].dataset;

    updates[`data.attributes.${track}`] = parseInt(degree, 10);

    this.actor.update(updates);
  }

  /**
   * Handle clicking the configuration button for ability scores.
   *
   * @param {Event} event  The originating click event.
   * @private
   */
  _onConfigureAbilityScore(event) {
    event.preventDefault();
    const { ability } = event.currentTarget.dataset;
    this.actor.configureAbilityScore(ability, { event });
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
   * Handle clicking the configuration button for setting an actor's condition immunities.
   *
   * @param {Event} event  The originating click event.
   * @private
   */
  _onConfigureConditionImmunities(event) {
    event.preventDefault();
    this.actor.configureConditionImmunities();
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
   * Handle clicking the configuration button for setting an actor's damage immunities.
   *
   * @param {Event} event  The originating click event.
   * @private
   */
  _onConfigureDamageImmunities(event) {
    event.preventDefault();
    this.actor.configureDamageImmunities();
  }

  /**
   * Handle clicking the configuration button for setting an actor's damage resistances.
   *
   * @param {Event} event  The originating click event.
   * @private
   */
  _onConfigureDamageResistances(event) {
    event.preventDefault();
    this.actor.configureDamageResistances();
  }

  /**
   * Handle clicking the configuration button for setting an actor's damage vulnerabilities.
   *
   * @param {Event} event  The originating click event.
   * @private
   */
  _onConfigureDamageVulnerabilities(event) {
    event.preventDefault();
    this.actor.configureDamageVulnerabilities();
  }

  /**
   * Handle clicking the configuration button for health and hit point modifiers.
   *
   * @param {Event} event  The originating click event.
   * @private
   */
  _onConfigureHealth(event) {
    event.preventDefault();
    this.actor.configureHealth();
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
   * Handle clicking the configuration button for initiative bonuses.
   *
   * @param {Event} event  The originating click event.
   * @private
   */
  _onConfigureInitiative(event) {
    event.preventDefault();
    this.actor.configureInitiative();
  }

  /**
   * Handle clicking the configuration button for language proficiencies.
   *
   * @param {Event} event  The originating click event.
   * @private
   */
  _onConfigureLanguages(event) {
    event.preventDefault();
    this.actor.configureLanguages();
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
   * Handle clicking the configuration button for movement speeds.
   *
   * @param {Event} event  The originating click event.
   * @private
   */
  _onConfigureMovement(event) {
    event.preventDefault();
    this.actor.configureMovement();
  }

  /**
   * Handle clicking the configuration button for special senses.
   *
   * @param {Event} event  The originating click event.
   * @private
   */
  _onConfigureSenses(event) {
    event.preventDefault();
    this.actor.configureSenses();
  }

  /**
   * Handle clicking the configuration button for special senses.
   *
   * @param {Event} event  The originating click event.
   * @private
   */
  _onConfigureSizeCategory(event) {
    event.preventDefault();
    this.actor.configureSizeCategory();
  }

  /**
   * Handle clicking the configuration button for skills.
   *
   * @param {Event} event  The originating click event.
   * @private
   */
  _onConfigureSkill(event) {
    event.preventDefault();
    event.stopPropagation();
    const { skill } = event.currentTarget.parentElement.dataset;
    this.actor.configureSkill(skill, { event });
  }

  /**
   * Handle clicking the configuration button for the spell tab, where users can set their spell
   * slots for each level, as well as which spell levels appear on the tab.
   *
   * @param {Event} event  The originating click event.
   * @private
   */
  _onConfigureSpellTab(event) {
    event.preventDefault();
    this.actor.configureSpellTab();
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
   * Handle creating a new object in the actor's feature list as an Owned Item.
   *
   * @param {Event} event          The originating click event.
   * @returns {Promise<Item5e[]>}  The newly created item.
   * @private
   */
  _onCreateFeatureItem(event) {
    event.preventDefault();

    return this.actor.createEmbeddedDocuments('Item', [{
      name: game.i18n.localize('A5E.ItemNew'),
      type: 'feature'
    }]);
  }

  /**
   * Handle creating a new object in the actor inventory as an Owned Item.
   *
   * @param {Event} event          The originating click event.
   * @returns {Promise<Item5e[]>}  The newly created item.
   * @private
   */
  _onCreateInventoryItem(event) {
    event.preventDefault();

    return this.actor.createEmbeddedDocuments('Item', [{
      name: game.i18n.localize('A5E.ItemNew'),
      type: 'object'
    }]);
  }

  /**
   * Handle creating a new object in the actor maneuver list as an Owned Item.
   *
   * @param {Event} event          The originating click event.
   * @returns {Promise<Item5e[]>}  The newly created item.
   * @private
   */
  _onCreateManeuverItem(event) {
    event.preventDefault();

    return this.actor.createEmbeddedDocuments('Item', [{
      name: game.i18n.localize('A5E.ItemNew'),
      type: 'maneuver'
    }]);
  }

  /**
   * Handle creating a new object in the actor's spell list as an Owned Item.
   *
   * @param {Event} event          The originating click event.
   * @returns {Promise<Item5e[]>}  The newly created item.
   * @private
   */
  async _onCreateSpellItem(event) {
    event.preventDefault();

    const { level } = event.currentTarget.dataset;

    return this.actor.createEmbeddedDocuments('Item', [{
      name: game.i18n.localize('A5E.ItemNew'),
      type: 'spell',
      'data.level': Number(level)
    }]);
  }

  /**
  * Handle clicking the delete button in the item context menu.
  *
  * @param {Event} event  The originating click event.
  */
  _onDeleteItem(event) {
    event.preventDefault();
    const { id } = event.currentTarget.closest('.a5e-js-item').dataset;
    this.actor.deleteEmbeddedDocuments('Item', [id]);
  }

  /**
  * Handle clicking the edit button in the item context menu.
  *
  * @param {Event} event  The originating click event.
  */
  _onEditItem(event) {
    event.preventDefault();
    const { id } = event.currentTarget.closest('.a5e-js-item').dataset;
    this.actor.items.get(id).sheet.render(true);

    $(document).find('.a5e-context-menu').removeClass('a5e-context-menu--visible');
  }

  /**
  * Handle clicking the equip button in the item context menu.
  *
  * @param {Event} event  The originating click event.
  */
  _onToggleEquip(event) {
    event.preventDefault();

    const { id } = event.currentTarget.closest('.a5e-js-item').dataset;
    const item = this.actor.items.get(id);

    item.update({ 'data.equipped': !item.data.data.equipped });
  }

  _onToggleInspiration(event) {
    event.preventDefault();
    this.actor.toggleInspiration();
  }

  _onToggleSpellPreparation(event) {
    event.preventDefault();

    const { id } = event.currentTarget.closest('.a5e-js-item').dataset;
    const item = this.actor.items.get(id);

    item.update({ 'data.prepared': !item.data.data.prepared });
  }

  _onToggleTrackVisibility(event) {
    event.preventDefault();

    const track = event.currentTarget;

    if (event.handleObj.type === 'mouseover') $(track).addClass('a5e-track--expanded');
    else $(track).removeClass('a5e-track--expanded');
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

  _onRollDeathSavingThrow(event) {
    event.preventDefault();
    this.actor.rollDeathSavingThrow();
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

  async _onToggleFilter(event) {
    const { category, itemType, value } = event.currentTarget.dataset;

    if (itemType === 'feature') await this.actor.updateFeatureFilters(category, value);
    else if (itemType === 'object') await this.actor.updateObjectFilters(category, value);
    else if (itemType === 'maneuver') await this.actor.updateManeuverFilters(category, value);
    else if (itemType === 'spell') await this.actor.updateSpellFilters(category, value);
  }

  async _onResetFilters(event) {
    const { itemType } = event.currentTarget.dataset;

    if (itemType === 'feature') await this.actor.resetFeatureFilters();
    else if (itemType === 'object') await this.actor.resetObjectFilters();
    else if (itemType === 'maneuver') await this.actor.resetManeuverFilters();
    else if (itemType === 'spell') await this.actor.resetSpellFilters();
  }

  _onTriggerRest(event) {
    event.preventDefault();
    this.actor.triggerRest();
  }

  _prepareFilters() {
    return {
      itemRarity: this.actor.getFlag('a5e', 'itemRarityFilters') ?? { inclusive: [], exclusive: [] },
      itemMiscellaneous: this.actor.getFlag('a5e', 'miscellaneousItemFilters') ?? { inclusive: [], exclusive: [] },
      maneuverDegree: this.actor.getFlag('a5e', 'maneuverDegreeFilters') ?? { inclusive: [], exclusive: [] },
      maneuverTradition: this.actor.getFlag('a5e', 'maneuverTraditionFilters') ?? { inclusive: [], exclusive: [] },
      spellComponents: this.actor.getFlag('a5e', 'spellComponentFilters') ?? { inclusive: [], exclusive: [] },
      spellSchools: this.actor.getFlag('a5e', 'spellSchoolFilters') ?? { inclusive: [], exclusive: [] }
    };
  }

  _prepareItems(items) {
    const itemGroups = items.reduce((acc, item) => {
      if (item.type === 'feature') acc.features.push(item);
      else if (item.type === 'maneuver') acc.maneuvers.push(item);
      else if (item.type === 'spell') acc.spells.push(item);
      else acc.inventory.push(item);

      return acc;
    }, {
      features: [], inventory: [], maneuvers: [], spells: []
    });

    itemGroups.inventory = this._prepareObjectLabels(this._filterObjects(itemGroups.inventory));
    itemGroups.maneuvers = this._prepareManeuverLabels(this._filterManeuvers(itemGroups.maneuvers));
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

    if (spell.data.ritual) {
      spell.data.descriptionLabels.components.push(game.i18n.localize('A5E.SpellRitualAbbr'));
    }

    if (spell.data.concentration) {
      spell.data.descriptionLabels.components.push(game.i18n.localize('A5E.SpellConcentrationAbbr'));
    }

    if (spell.data.prepared) inlineLabels.push(game.i18n.localize('A5E.ItemPrepared'));

    spell.data.inlineLabels = inlineLabels;
  }
}
