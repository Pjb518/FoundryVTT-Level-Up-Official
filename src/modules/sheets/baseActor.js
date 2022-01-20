export default class ActorSheet5e extends ActorSheet {
  /** @inheritdoc */
  activateListeners(html) {
    // Listener for a custom tab handler
    html.find('.a5e-js-sheet-tab').click(this._onClickTab.bind(this));

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
}
