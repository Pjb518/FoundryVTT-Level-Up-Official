import calculateContextMenuPlacement from '../utils/calculateContextMenuPlacement';

export default class ActorSheet5e extends ActorSheet {
  /** @inheritdoc */
  activateListeners(html) {
    // Listener for a custom tab handler
    html.find('.a5e-js-sheet-tab').click(this._onClickTab.bind(this));

    // Configuration handlers
    html.find('.a5e-js-configure-ability-score').click(this._onConfigureAbilityScore.bind(this));
    html.find('.a5e-js-configure-condition-immunities').click(this._onConfigureConditionImmunities.bind(this));
    html.find('.a5e-js-configure-damage-immunities').click(this._onConfigureDamageImmunities.bind(this));
    html.find('.a5e-js-configure-damage-resistances').click(this._onConfigureDamageResistances.bind(this));
    html.find('.a5e-js-configure-damage-vulnerabilities').click(this._onConfigureDamageVulnerabilities.bind(this));
    html.find('.a5e-js-configure-health').click(this._onConfigureHealth.bind(this));
    html.find('.a5e-js-configure-initiative').click(this._onConfigureInitiative.bind(this));
    html.find('.a5e-js-configure-languages').click(this._onConfigureLanguages.bind(this));
    html.find('.a5e-js-configure-movement').click(this._onConfigureMovement.bind(this));
    html.find('.a5e-js-configure-senses').click(this._onConfigureSenses.bind(this));
    html.find('.a5e-js-configure-size-category').click(this._onConfigureSizeCategory.bind(this));
    html.find('.a5e-js-configure-skill').click(this._onConfigureSkill.bind(this));
    html.find('.a5e-js-configure-spell-tab').click(this._onConfigureSpellTab.bind(this));

    // Item creation handlers
    html.find('.a5e-js-create-feature-item').click(this._onCreateFeatureItem.bind(this));
    html.find('.a5e-js-create-inventory-item').click(this._onCreateInventoryItem.bind(this));
    html.find('.a5e-js-create-spell-item').click(this._onCreateSpellItem.bind(this));

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
    const miscellaneousFilters = this.actor.getFlag('a5e', 'miscellaneousSpellFilters');

    // Clean up any outdated filters.
    if (componentFilters?.inclusive?.length) {
      const { inclusive } = componentFilters;

      if (inclusive.includes('concentration')) inclusive.splice(inclusive.indexOf('concentration'), 1);
      if (inclusive.includes('ritual')) inclusive.splice(inclusive.indexOf('ritual'), 1);
    }

    // Clean up any outdated filters.
    if (componentFilters?.exclusive?.length) {
      const { exclusive } = componentFilters;

      if (exclusive.includes('concentration')) exclusive.splice(exclusive.indexOf('concentration'), 1);
      if (exclusive.includes('ritual')) exclusive.splice(exclusive.indexOf('ritual'), 1);
    }

    if (componentFilters?.inclusive?.length) {
      filteredItems = filteredItems.filter((item) => (
        componentFilters.inclusive.some((value) => item.data.components[value])));
    }

    if (componentFilters?.exclusive?.length) {
      filteredItems = filteredItems.filter((item) => (
        !componentFilters.exclusive.some((value) => item.data.components[value])));
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

    if (miscellaneousFilters?.inclusive.length) {
      filteredItems = filteredItems.filter(
        (item) => miscellaneousFilters.inclusive.some((property) => item.data[property])
      );
    }

    if (miscellaneousFilters?.exclusive.length) {
      filteredItems = filteredItems.filter(
        (item) => !miscellaneousFilters.exclusive.some((property) => item.data[property])
      );
    }

    return filteredItems;
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

      const { top, left } = calculateContextMenuPlacement(event);

      $(item)
        .find('.a5e-context-menu')
        .addClass('a5e-context-menu--visible')
        .css({ top: `${top}px`, left: `${left}px` });
    }
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

  /**
   * Handle clicking a value on the strife or fatigue tracks.
   *
   * @param {Event} event The originating click event.
   */
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
}
