/**
 * Override and extend the core ItemSheet implementation to handle specific item types.
 * @extends {ItemSheet}
 */
export default class ItemSheet5e extends ItemSheet {
  /**
   * Define default rendering options for the character sheet.
   *
   * @returns {object}
   */
  static get defaultOptions() {
    return mergeObject(super.defaultOptions, {
      classes: ['a5e-sheet'],
      scrollY: [
        '.a5e-js-sheet-body',
        '.a5e-js-details-scroll-area',
        '.a5e-js-item-description-scroll-area',
        '.a5e-js-object-properties-scroll-area',
        '.a5e-js-spell-properties-scroll-area'
      ],
      height: 500,
      width: 620,
      resizable: false,
      currentTab: 'description'
    });
  }

  get template() {
    return `systems/a5e/templates/items/${this.item.type}-sheet.hbs`;
  }

  getData(options) {
    const data = super.getData(options);
    data.config = CONFIG.A5E;
    data.currentTab = this.options.currentTab;

    const itemData = data.data;
    data.item = itemData;
    data.data = itemData.data;

    data.showAbilityScoreConfig = ['attack', 'damage'].some((option) => itemData.data.actionOptions.includes(option));

    return data;
  }

  /** @inheritdoc */
  activateListeners(html) {
    // Listener for a custom tab handler
    html.find('.a5e-js-sheet-tab').click(this._onClickTab.bind(this));

    // Tag listeners
    html.find('.a5e-js-toggle-concentration-requirement').click(this._onToggleConcentrationRequirement.bind(this));
    html.find('.a5e-js-select-maneuver-tradition').click(this._onSelectManeuverTradition.bind(this));
    html.find('.a5e-js-select-primary-spell-school').click(this._onSelectPrimarySpellSchool.bind(this));
    html.find('.a5e-js-toggle-ritual-tag').click(this._onToggleRitualTag.bind(this));
    html.find('.a5e-js-toggle-secondary-spell-school').click(this._onToggleSecondarySpellSchool.bind(this));
    html.find('.a5e-js-toggle-spell-component').click(this._onToggleSpellComponent.bind(this));
    html.find('.a5e-js-toggle-action-option').click(this._onToggleActionOptions.bind(this));

    // Item configuration listeners
    html.find('.a5e-js-add-damage-source').click(this._onAddDamageSource.bind(this));
    html.find('.a5e-js-delete-damage-source').click(this._onDeleteDamageSource.bind(this));
    html.find('.a5e-js-add-healing-source').click(this._onAddHealingSource.bind(this));
    html.find('.a5e-js-delete-healing-source').click(this._onDeleteHealingSource.bind(this));

    super.activateListeners(html);
  }

  /** @inheritdoc */
  _getSubmitData(updateData = {}) {
    // Create the expanded update data object
    const formData = new FormDataExtended(this.form, { editors: this.editors });
    let data = formData.toObject();

    if (updateData) data = mergeObject(data, updateData);
    else data = expandObject(data);

    // Handle Damage array
    const damage = data.data?.damage;

    if (damage) {
      data.data.damage = Object.values(damage || {}).map(({
        canCrit, damageType, formula, name
      }) => ({
        canCrit: canCrit ?? false,
        damageType: damageType || '',
        formula: formula || '',
        name: name || ''
      }));
    }

    // Return the flattened submission data
    return flattenObject(data);
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

  _onAddDamageSource(event) {
    event.preventDefault();

    const itemData = this.item.data.data;
    const { damage } = itemData ?? [];

    damage.push({
      name: '',
      formula: '',
      canCrit: !!itemData.actionOptions.includes('attack'),
      damageType: ''
    });

    this.item.update({ 'data.damage': damage });
  }

  _onAddHealingSource(event) {
    event.preventDefault();

    const itemData = this.item.data.data;
    const { healing } = itemData ?? [];

    healing.push({
      name: '',
      formula: '',
      healingType: ''
    });

    this.item.update({ 'data.healing': healing });
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

  _onDeleteDamageSource(event) {
    event.preventDefault();

    const { index } = event.currentTarget.dataset;
    const { damage } = this.item.data.data;

    damage.splice(index, 1);

    this.item.update({ 'data.damage': damage });
  }

  _onDeleteHealingSource(event) {
    event.preventDefault();

    const { index } = event.currentTarget.dataset;
    const { healing } = this.item.data.data;

    healing.splice(index, 1);

    this.item.update({ 'data.healing': healing });
  }

  /**
   * Handle clicking one of the action option tags to toggle the appropriate config section.
   *
   * @param {Event} event The originating click event.
   */
  _onToggleActionOptions(event) {
    event.preventDefault();

    const selectedOptions = this.item.data.data.actionOptions;
    const { option } = event.currentTarget.dataset;
    const index = selectedOptions.indexOf(option);

    if (index !== -1) selectedOptions.splice(index, 1);
    else selectedOptions.push(option);

    this.item.update({ 'data.actionOptions': selectedOptions });
  }

  /**
   * Handle clicking one of the maneuver tradition tags to select a given tradition.
   *
   * @param {Event} event The originating click event.
   */
  _onSelectManeuverTradition(event) {
    event.preventDefault();

    const { tradition } = event.currentTarget.dataset;
    this.item.update({ 'data.tradition': tradition });
  }

  /**
   * Handle clicking one of the primary spell school tags to select a given school.
   *
   * @param {Event} event The originating click event.
   */
  _onSelectPrimarySpellSchool(event) {
    event.preventDefault();

    const { school } = event.currentTarget.dataset;
    this.item.update({ 'data.schools.primary': school });
  }

  /**
   * Handle clicking on the concentration tag to toggle the concentration requirement for a given
   * spell.
   *
   * @param {Event} event The originating click event.
   */
  _onToggleConcentrationRequirement(event) {
    event.preventDefault();
    this.item.update({ 'data.concentration': !this.item.data.data.concentration });
  }

  /**
   * Handle clicking on the ritual tag to toggle a given spell's status as a ritual.
   *
   * @param {Event} event The originating click event.
   */
  _onToggleRitualTag(event) {
    event.preventDefault();
    this.item.update({ 'data.ritual': !this.item.data.data.ritual });
  }

  /**
   * Handle clicking one of the secondary spell school tags to toggle a given school.
   *
   * @param {Event} event The originating click event.
   */
  _onToggleSecondarySpellSchool(event) {
    event.preventDefault();

    const selectedSchools = this.item.data.data.schools.secondary;
    const { school } = event.currentTarget.dataset;
    const index = selectedSchools.indexOf(school);

    if (index !== -1) selectedSchools.splice(index, 1);
    else selectedSchools.push(school);

    this.item.update({ 'data.schools.secondary': selectedSchools });
  }

  /**
   * Handle clicking on the tags for spell components to mark the spell's component requirements.
   *
   * @param {Event} event The originating click event.
   */
  _onToggleSpellComponent(event) {
    event.preventDefault();

    const { component } = event.currentTarget.dataset;

    this.item.update({ [`data.components.${component}`]: !this.item.data.data.components[component] });
  }
}
